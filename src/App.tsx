// src/App.tsx
import { Provider } from 'react-redux';
import store from './store/store';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './ui/pages/Login';
import Dashboard from './ui/pages/Dashboard';
import Products from './ui/pages/Products';
import Categories from './ui/pages/Categories';
import Orders from './ui/pages/Orders';
import Customers from './ui/pages/Customers';
import AddProduct from './ui/pages/AddProduct';
import AddCustomer from './ui/pages/AddCustomer';
import ProtectedRoute from './routes/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import Header from './ui/components/Header';
import { Toaster } from 'react-hot-toast';
import Sidebar from './ui/components/Sidebar';
import Vendors from './ui/pages/Vendors';
import AddVendor from './ui/pages/AddVendor';
import Subcategories from './ui/pages/Subcategories';
import EditProduct from './ui/pages/edit-product/[id]';
import EditOrders from './ui/pages/edit-order/[id]';
import CustomerPage from './ui/pages/CustomerPage';
import ReportPage from './ui/pages/ReportPage';
import Requests from './ui/pages/Request';
import SignupRequestsPage from './ui/pages/SignupRequestsPage';

function App() {
  const AuthenticatedLayout = () => (
    <div className="flex h-screen bg-background-light transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto  dark:bg-background p-6">
        
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path='/vendors' element={<Vendors />} />
            <Route path='/sub-categories' element={<Subcategories />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path='/add-vendor' element={<AddVendor />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/edit-order/:id" element={<EditOrders />} />
            <Route path="/customers/:customerId" element={<CustomerPage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path='/requests' element={<Requests />} />
            <Route path='/sign-up-request' element={<SignupRequestsPage />} />

            {/* Fallback route: redirect unknown routes to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );

  return (
    <Provider store={store}>
      <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/not-authorized"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <h1>You are not authorized to view this page.</h1>
                </div>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
