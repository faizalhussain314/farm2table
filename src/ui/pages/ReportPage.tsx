import { useEffect, useState } from 'react';
import { Download, Filter, Calendar, User, Package, CheckCircle, XCircle, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency'; // Assuming you have this utility
import { format } from 'date-fns'; // Using date-fns for date formatting

// Define dummy data types (adjust based on your actual report data structure)
interface ReportRow {
  id: string;
  orderId?: string;
  customerId?: string;
  customerName?: string;
  productId?: string;
  productName?: string;
  date: string; // Use string or Date type
  amount?: number;
  status?: string; // e.g., 'Completed', 'Pending', 'Cancelled'
  // Add other relevant report fields
}

interface ReportFilters {
  startDate: string | null;
  endDate: string | null;
  customerId: string | null;
  productId: string | null;
  status: string | null;
  // Add other filter criteria
}

// Dummy service function to fetch report data
// In a real application, this would make an API call with filters
const fetchReportData = async (filters: ReportFilters): Promise<ReportRow[]> => {
  console.log("Fetching report data with filters:", filters);

  // --- Dummy Data ---
  const dummyData: ReportRow[] = [
    { id: 'rep-1', orderId: 'ord-001', customerId: 'cust-1', customerName: 'Alice Smith', productId: 'prod-a', productName: 'Product A', date: '2023-10-20', amount: 120.50, status: 'Completed' },
    { id: 'rep-2', orderId: 'ord-002', customerId: 'cust-2', customerName: 'Bob Johnson', productId: 'prod-b', productName: 'Product B', date: '2023-10-21', amount: 75.00, status: 'Pending' },
    { id: 'rep-3', orderId: 'ord-003', customerId: 'cust-1', customerName: 'Alice Smith', productId: 'prod-c', productName: 'Product C', date: '2023-10-22', amount: 300.00, status: 'Completed' },
    { id: 'rep-4', orderId: 'ord-004', customerId: 'cust-3', customerName: 'Charlie Brown', productId: 'prod-a', productName: 'Product A', date: '2023-10-23', amount: 55.75, status: 'Cancelled' },
    { id: 'rep-5', orderId: 'ord-005', customerId: 'cust-2', customerName: 'Bob Johnson', productId: 'prod-c', productName: 'Product C', date: '2023-10-24', amount: 180.00, status: 'Completed' },
     { id: 'rep-6', orderId: 'ord-006', customerId: 'cust-1', customerName: 'Alice Smith', productId: 'prod-b', productName: 'Product B', date: '2023-11-01', amount: 90.00, status: 'Completed' },
    { id: 'rep-7', orderId: 'ord-007', customerId: 'cust-3', customerName: 'Charlie Brown', productId: 'prod-c', productName: 'Product C', date: '2023-11-05', amount: 210.00, status: 'Processing' },
  ];
  // --- End Dummy Data ---

  // Simulate filtering based on dummy data
  const filteredData = dummyData.filter(row => {
    const rowDate = new Date(row.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    const dateMatch = (!startDate || rowDate >= startDate) && (!endDate || rowDate <= endDate);
    const customerMatch = !filters.customerId || row.customerId === filters.customerId;
    const productMatch = !filters.productId || row.productId === filters.productId;
    const statusMatch = !filters.status || row.status === filters.status;

    return dateMatch && customerMatch && productMatch && statusMatch;
  });


  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filteredData);
    }, 1000); // Simulate network delay
  });
};

const ReportPage = () => {
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: null,
    endDate: null,
    customerId: null,
    productId: null,
    status: null,
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof ReportRow; direction: 'ascending' | 'descending' } | null>(null);

  // Dummy options for dropdowns (replace with actual data fetching if needed)
  const dummyCustomers = [
    { id: 'cust-1', name: 'Alice Smith' },
    { id: 'cust-2', name: 'Bob Johnson' },
    { id: 'cust-3', name: 'Charlie Brown' },
  ];

  const dummyProducts = [
    { id: 'prod-a', name: 'Product A' },
    { id: 'prod-b', name: 'Product B' },
    { id: 'prod-c', name: 'Product C' },
  ];

  const dummyStatuses = ['Completed', 'Pending', 'Processing', 'Cancelled'];


  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchReportData(filters);
      setReportData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // Optionally generate a default report on initial load
      // generateReport();
  }, []); // Empty dependency array means this runs once on mount


  const handleFilterChange = (filterName: keyof ReportFilters, value: string | null) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const sortedData = [...reportData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
    if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;


    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

   const requestSort = (key: keyof ReportRow) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

   const getClassNamesFor = (name: keyof ReportRow) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };


  const downloadReport = () => {
    if (reportData.length === 0) {
      alert('No data to download.'); // Using alert for simplicity, consider a modal
      return;
    }

    // Convert data to CSV format
    const headers = Object.keys(reportData[0]).join(',');
    const csvRows = reportData.map(row =>
      Object.values(row).map(value => {
         // Handle potential commas or quotes in data
         const stringValue = String(value);
         if (stringValue.includes(',') || stringValue.includes('"')) {
           return `"${stringValue.replace(/"/g, '""')}"`; // Escape double quotes
         }
         return stringValue;
      }).join(',')
    );

    const csvString = [headers, ...csvRows].join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h1>

      {/* Filter Section */}
      <div className="bg-white  rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Filter className="w-6 h-6 mr-2 bg-white"/> Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="date"
                id="startDate"
                className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm bg-white border-gray-300 rounded-md dark:bg-secondary-light dark:border-gray-600 dark:text-white"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || null)}
              />
            </div>
          </div>
           <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="date"
                id="endDate"
                className="focus:ring-primary focus:border-primary block w-full bg-white pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-secondary-light dark:border-gray-600 dark:text-white"
                 value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || null)}
              />
            </div>
          </div>

          {/* Customer Filter */}
          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            <select
              id="customer"
              className="focus:ring-primary focus:border-primary bg-white block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-secondary-light dark:border-gray-600 dark:text-white"
              value={filters.customerId || ''}
              onChange={(e) => handleFilterChange('customerId', e.target.value || null)}
            >
              <option value="">All Customers</option>
              {dummyCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
             </div>
          </div>

           {/* Product Filter */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            <select
              id="product"
              className="focus:ring-primary focus:border-primary bg-white block w-full pl-10 sm:text-sm border-gray-300 rounded-md  dark:border-gray-600 dark:text-white"
              value={filters.productId || ''}
              onChange={(e) => handleFilterChange('productId', e.target.value || null)}
            >
              <option value="">All Products</option>
              {dummyProducts.map(product => (
                <option key={product.id} className='bg-white' value={product.id}>{product.name}</option>
              ))}
            </select>
             </div>
          </div>

           {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckCircle className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            <select
              id="status"
              className="focus:ring-primary focus:border-primary block w-full bg-white pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-secondary-light dark:border-gray-600 dark:text-white"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || null)}
            >
              <option value="">All Statuses</option>
              {dummyStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
             </div>
          </div>

          {/* Add more filter inputs here */}

        </div>
         <div className="mt-6 flex justify-end space-x-4">
             <button
                onClick={generateReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={loading}
             >
                {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
                    </svg>
                ) : (
                   <Search className="w-5 h-5 mr-2"/>
                )}
                Generate Report
             </button>
             <button
                onClick={downloadReport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-secondary-light dark:text-gray-300 dark:border-gray-600 dark:hover:bg-secondary-dark"
                disabled={reportData.length === 0}
             >
                <Download className="w-5 h-5 mr-2"/>
                Download CSV
             </button>
         </div>
      </div>

      {/* Report Results Section */}
      <div className="bg-white dark:bg-secondary rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Report Results</h2>
         {error && <div className="text-center text-red-500 mb-4">{error}</div>}
        {loading ? (
           <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        ) : reportData.length === 0 ? (
          <div className="text-center text-gray-500">Generate a report using the filters above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-secondary-light">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('id')}>
                    Report ID
                     {getClassNamesFor('id') === 'ascending' ? ' ▲' : getClassNamesFor('id') === 'descending' ? ' ▼' : ''}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('orderId')}>
                    Order ID
                     {getClassNamesFor('orderId') === 'ascending' ? ' ▲' : getClassNamesFor('orderId') === 'descending' ? ' ▼' : ''}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('customerName')}>
                    Customer Name
                     {getClassNamesFor('customerName') === 'ascending' ? ' ▲' : getClassNamesFor('customerName') === 'descending' ? ' ▼' : ''}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('productName')}>
                    Product Name
                     {getClassNamesFor('productName') === 'ascending' ? ' ▲' : getClassNamesFor('productName') === 'descending' ? ' ▼' : ''}
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('date')}>
                    Date
                     {getClassNamesFor('date') === 'ascending' ? ' ▲' : getClassNamesFor('date') === 'descending' ? ' ▼' : ''}
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('amount')}>
                    Amount (INR)
                     {getClassNamesFor('amount') === 'ascending' ? ' ▲' : getClassNamesFor('amount') === 'descending' ? ' ▼' : ''}
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer" onClick={() => requestSort('status')}>
                    Status
                     {getClassNamesFor('status') === 'ascending' ? ' ▲' : getClassNamesFor('status') === 'descending' ? ' ▼' : ''}
                  </th>
                  {/* Add more table headers for other report fields */}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
                {sortedData.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {row.id}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {row.orderId || 'N/A'}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {row.customerName || 'N/A'}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {row.productName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                       {row.date ? format(new Date(row.date), 'yyyy-MM-dd') : 'N/A'} {/* Format date */}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {row.amount !== undefined ? formatCurrency(row.amount, 'INR') : 'N/A'} {/* Format currency */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       {row.status ? (
                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                               row.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                               row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                               row.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                               'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                           }`}>
                               {row.status}
                           </span>
                       ) : 'N/A'}
                    </td>
                    {/* Add more table data cells */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

       {/* Advanced Features Section (Placeholder) */}
       <div className="bg-white dark:bg-secondary rounded-lg shadow p-6">
           <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Advanced Features</h2>
           <p className="text-gray-700 dark:text-gray-300">
               This section can be expanded to include advanced features such as:
           </p>
           <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
               <li>Adding charts and visualizations (e.g., sales trends, product performance).</li>
               <li>More complex filtering logic (e.g., multiple statuses, keyword search).</li>
               <li>Scheduling reports to be generated automatically.</li>
               <li>Saving frequently used report configurations.</li>
           </ul>
           {/* You can add components for charts or other features here */}
       </div>

    </div>
  );
};

export default ReportPage;
