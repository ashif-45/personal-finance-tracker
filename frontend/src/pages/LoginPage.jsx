import { Wallet } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm.jsx';
import Card from '../components/ui/Card.jsx';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-3">
            <Wallet className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Tracker</h1>
          <p className="text-gray-600 mt-1">Sign in to manage your money</p>
        </div>
        <Card>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}