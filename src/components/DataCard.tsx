
import './DataCard.css';

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const DataCard: React.FC<DataCardProps> = ({ children, className = '', title, ...props }) => {
  return (
    <div className={`data-card layer-1 ${className}`} {...props}>
      {title && <h3 className="label-caps data-card-title">{title}</h3>}
      {children}
    </div>
  );
};
