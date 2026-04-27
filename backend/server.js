import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import rateLimit from 'express-rate-limit';

// Load .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.use(cors());
app.use(express.json());

// Init Rate Limiter for /api/ routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 15 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Setup Gemini
let genAI = null;

async function initializeGemini() {
  let apiKey = process.env.GEMINI_API_KEY;
  
  if (process.env.NODE_ENV === 'production') {
    try {
      const client = new SecretManagerServiceClient();
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || await client.getProjectId();
      const name = `projects/${projectId}/secrets/GEMINI_API_KEY/versions/latest`;
      const [version] = await client.accessSecretVersion({ name });
      apiKey = version.payload.data.toString('utf8');
      console.log('Successfully retrieved GEMINI_API_KEY from Secret Manager.');
    } catch (error) {
      console.error('Failed to fetch secret from GCP. Falling back to .env', error);
    }
  }

  genAI = new GoogleGenerativeAI(apiKey || 'MOCK_KEY');
}

initializeGemini();

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a professional nutritionist. Analyze this image. Estimate the weight in grams and return a JSON object ONLY: { "foodName": "name", "calories": 100, "protein": 10, "carbs": 10, "fat": 10, "confidenceScore": 0.9 }. No markdown formatting, just pure JSON string.`;

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(fs.readFileSync(req.file.path)).toString("base64"),
          mimeType: req.file.mimetype
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up Markdown JSON block if any
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(text);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(parsedData);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.post('/api/analyze-text', async (req, res) => {
  try {
    const { text } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a professional nutritionist. A user has logged food via text/voice: "${text}". 
    Extract the nutritional information and return a JSON object ONLY: { "foodName": "name", "calories": 100, "protein": 10, "carbs": 10, "fat": 10, "confidenceScore": 0.9 }. No markdown formatting, just pure JSON string.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let resultText = response.text();
    
    resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error) {
    console.error('Error analyzing text:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method === 'GET') {
    if (fs.existsSync(path.join(distPath, 'index.html'))) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.send('Frontend not built yet. Run npm run build.');
    }
  } else {
    next();
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
