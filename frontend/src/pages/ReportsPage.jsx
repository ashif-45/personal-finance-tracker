import { useState } from 'react';
import MonthlyReport from '../components/reports/MonthlyReport.jsx';
import YearlyReport from '../components/reports/YearlyReport.jsx';
import CategoryBreakdown from '../components/reports/CategoryBreakdown.jsx';

const TABS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'category', label: 'Category' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Analyze your financial trends and patterns</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'monthly' && <MonthlyReport />}
      {activeTab === 'yearly' && <YearlyReport />}
      {activeTab === 'category' && <CategoryBreakdown />}
    </div>
  );
}