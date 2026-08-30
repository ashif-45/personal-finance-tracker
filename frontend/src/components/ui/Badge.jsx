export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    danger: 'bg-rose-100 text-rose-800 border border-rose-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    info: 'bg-sky-100 text-sky-800 border border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}