export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-primary-900">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-dark outline-none transition-colors placeholder:text-muted-light focus:border-lime-500 focus:ring-2 focus:ring-lime-400/30 ${
          error ? 'border-danger' : 'border-primary-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
