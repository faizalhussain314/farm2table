import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  History,
  HelpCircle,
  User2,
  UserCog,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white  text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="p-4">
        <div className="flex items-center space-x-2 text-primary mb-8">
          <Package size={24} />
          <span className="text-xl font-bold">Farm2Table</span>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-4">
              Overview
            </p>
            <nav className="space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <ShoppingCart size={20} />
                <span>Orders</span>
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <Package size={20} />
                <span>Products</span>
              </NavLink>

              <NavLink
                to="/vendors"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <User2 size={20} />
                <span>Vendors</span>
              </NavLink>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <Users size={20} />
                <span>Customers</span>
              </NavLink>
            </nav>
          </div>

          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-4">
              Management
            </p>
            <nav className="space-y-2">
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <FolderTree size={20} />
                <span>Categories</span>
              </NavLink>

              <NavLink
                to="/sub-categories"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <FolderTree size={20} />
                <span>Sub Categories</span>
              </NavLink>

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <BarChart3 size={20} />
                <span>Reports</span>
              </NavLink>
              <NavLink
                to="/requests"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <UserCog  size={20} />
                <span>User Request</span>
              </NavLink>
            </nav>
          </div>

          <div>
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-4">
              Support
            </p>
            <nav className="space-y-2">
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <History size={20} />
                <span>History</span>
              </NavLink>
              <NavLink
                to="/help"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-background ${
                    isActive
                      ? "text-primary bg-gray-100 dark:bg-background"
                      : "text-gray-600 dark:text-gray-300"
                  }`
                }>
                <HelpCircle size={20} />
                <span>Help & Support</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
