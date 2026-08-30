import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function BudgetAlertBanner({ alerts = [] }) {
  const [dismissed, setDismissed] = useState(new Set());

  if (!alerts.length) return null;

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.budgetId));
  if (!visibleAlerts.length) return null;

  return (
    <div className="space-y-2 mb-6">
      {visibleAlerts.map((alert) => {
        const isCritical = alert.alertLevel === 'CRITICAL';
        return (
          <div
            key={alert.budgetId}
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              isCritical
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            {isCritical ? (
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{alert.alertLevel}</p>
              <p className="text-sm mt-0.5">{alert.message}</p>
            </div>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(alert.budgetId))}
              className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}