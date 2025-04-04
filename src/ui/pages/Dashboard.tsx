import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardSummary, DashboardSummary } from '../../services/dashboardService';  // Import the service

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const Dashboard: React.FC = () => {
 
  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary(); 
        setDashboardData(data); 
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
    fetchData();
  }, []); 

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm rounded-lg p-6 ">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-primary">₹{dashboardData.totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">+8% from last month</p>
        </div>

        <div className=" rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between ">
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-primary">{dashboardData.totalOrders}</h3>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">+5% from last month</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Customers</p>
              <h3 className="text-2xl font-bold text-primary">{dashboardData.totalCustomers}</h3>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">+12% from last month</p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4318ff"
                strokeWidth={2}
                dot={{ fill: '#00E676' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
