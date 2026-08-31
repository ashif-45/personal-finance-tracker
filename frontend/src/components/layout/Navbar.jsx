import { useState, useEffect } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth.js';
import { budgetApi } from '../../api/budgetApi.js';
import Button from '../ui/Button.jsx';
import Modal from '../ui/Modal.jsx';
import BudgetAlertBanner from '../budgets/BudgetAlertBanner.jsx';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await budgetApi.getAlerts();
        const fetchedAlerts = res.data || [];
        setAlerts(fetchedAlerts);

        // Display toasts ONLY the very first time the user logs in/opens the app in this session
        if (fetchedAlerts.length > 0 && !sessionStorage.getItem('alertsShown')) {
          fetchedAlerts.forEach((alert) => {
            if (alert.alertLevel === 'CRITICAL') {
              toast.error(alert.message, { duration: 6000 });
            } else {
              toast(alert.message, { duration: 5000, icon: '⚠️' });
            }
          });
          sessionStorage.setItem('alertsShown', 'true');
        }
      } catch (err) {
        console.error('Failed to fetch alerts', err);
      }
    };
    
    fetchAlerts();
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-sm font-medium text-gray-500 hidden sm:block">
            Welcome back, <span className="text-gray-900 font-semibold">{user?.fullName || 'User'}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Bell Icon */}
          <button 
            onClick={() => setIsNotificationModalOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            )}
          </button>
          
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={16} className="mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Notifications Modal */}
      <Modal 
        isOpen={isNotificationModalOpen} 
        onClose={() => setIsNotificationModalOpen(false)} 
        title="Notifications"
        maxWidth="max-w-md"
      >
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
            <p>You have no new notifications.</p>
          </div>
        ) : (
          <div className="py-2">
            <BudgetAlertBanner alerts={alerts} />
          </div>
        )}
      </Modal>
    </>
  );
}