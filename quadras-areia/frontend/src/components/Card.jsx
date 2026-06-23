export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-primary-100 bg-white shadow-card ${padding ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
