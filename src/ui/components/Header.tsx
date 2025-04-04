
import { Bell, Search, Settings,  LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../slices/AuthSlice';
import { logoutRequest } from '../../services/auth/logoutService';

const Header = () => {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest(); // Call the logout API
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      dispatch(logout()); // Clear state and storage
      navigate('/login');
    }
  };

  return (
    <header className="bg-secondary-light dark:bg-secondary h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center flex-1">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white dark:bg-background rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-lg text-gray-600 dark:text-gray-400"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button> */}
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-lg">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-lg">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-sm font-medium">Admin User</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-500"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
