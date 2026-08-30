export default function ProgressBar({ percentage = 0, className = '' }) {
  // Clamp between 0 and 100 for display width, but allow >100 for color logic
  const clampedWidth = Math.min(Math.max(percentage, 0), 100);

  // Color coding based on spending percentage
  let barColor = 'bg-emerald-500';
  if (percentage >= 100) {
    barColor = 'bg-red-500';
  } else if (percentage >= 80) {
    barColor = 'bg-amber-500';
  } else if (percentage >= 60) {
    barColor = 'bg-yellow-400';
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
        style={{ width: `${clampedWidth}%` }}
      />
    </div>
  );
}