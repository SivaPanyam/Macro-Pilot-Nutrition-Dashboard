
import './InputField.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, className = '', id, ...props }) => {
  const inputId = id || Math.random().toString(36).substring(7);
  
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label htmlFor={inputId} className="label-caps input-label">{label}</label>}
      <input id={inputId} className="input-field body-main" {...props} />
    </div>
  );
};
