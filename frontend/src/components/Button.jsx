export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
    light: 'bg-white text-primary-700 hover:bg-sand-100 shadow-sm',
    secondary: 'bg-sand-200 text-dark hover:bg-sand-300',
    success: 'bg-success text-white hover:bg-success-dark',
    danger: 'bg-danger text-white hover:bg-danger-dark',
    ghost: 'bg-transparent text-dark hover:bg-sand-100 border border-sand-200',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent',
    outlineLight: 'border-2 border-white text-white hover:bg-white/10 bg-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}
