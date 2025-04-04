import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { login } from '../../services/auth/loginService'; 
import { useDispatch } from 'react-redux';
import { setAuthInfo } from '../../slices/AuthSlice';
import toast from 'react-hot-toast';


const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    phoneNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // ✅ Show loading toast ONCE
    const toastId = toast.loading('Logging you in...');
  
    try {
      const data = await login(credentials.phoneNumber, credentials.password);
  
      // ✅ Dismiss loading toast and show success
      toast.success('Logged in successfully!', { id: toastId });
  
      dispatch(setAuthInfo({ token: data.token, user: data.user }));
      navigate('/');
    } catch (error: any) {
      // ✅ Dismiss loading toast and show error
      toast.error('Login failed. Please check your credentials.', { id: toastId });
      console.error('Login error:', error);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background">
      <div className="bg-white dark:bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 text-primary mb-8">
          <Package size={32} />
          <span className="text-2xl font-bold">Farm2Table</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="number"
              value={credentials.phoneNumber}
              onChange={(e) => setCredentials({ ...credentials, phoneNumber: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary bg-white dark:bg-background"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
