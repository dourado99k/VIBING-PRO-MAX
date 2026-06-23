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
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-lime-400 text-primary-900 hover:bg-lime-300 shadow-glow hover:shadow-lg',
    light: 'bg-white text-primary-700 hover:bg-lime-50 shadow-sm',
    secondary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
    success: 'bg-lime-500 text-primary-900 hover:bg-lime-400',
    danger: 'bg-danger text-white hover:bg-danger-dark',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 border border-primary-200',
    outline: 'border-2 border-lime-400 text-lime-600 hover:bg-lime-50 bg-transparent',
    outlineLight: 'border-2 border-lime-400 text-lime-300 hover:bg-lime-400/10 bg-transparent',
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
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-900/30 border-t-primary-900" />
      )}
      {children}
    </button>
  );
}
