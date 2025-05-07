// src/services/signupRequests/signupRequestService.ts

export interface SignupRequest {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    address: string; // New field
    password?: string; // New field, storing plain for mock, will be masked in UI
    companyName?: string; // Kept for 'View Details' modal
    reasonForSignup?: string; // Kept for 'View Details' modal
    requestedDate: string; // ISO date string
    status: 'Pending Approval' | 'Approved' | 'Sent To Vendor' | 'Rejected';
  }
  
  // --- Mock Data Generation ---
  const tamilNames = [
    "Aarav Kumaravel", "Ananya Krish", "Arjun Pandian", "Deepika Selvam",
    "Karthik Natarajan", "Meera Gopal", "Prakash Rajan", "Priya Murugan",
    "Rajesh Kannan", "Saranya Balan", "Suresh Velu", "Vanitha Senthil"
  ];
  
//   const shopDetails = [
//     { company: "Covai Fresh Kaigari Store", reason: "New vegetable shop in Gandhipuram, Coimbatore, seeking online presence." },
//     { company: "Chennai Green Grocers", reason: "Expanding our T. Nagar vegetable delivery service via your platform." },
//     { company: "Madurai Malligai Vegetables", reason: "Listing fresh farm produce, including keerai and local vegetables from Madurai." },
//     { company: "Salem Organic Farmers Market", reason: "Platform to sell certified organic vegetables from our Salem farms." },
//     { company: "Nellai Natural Produce", reason: "Specializing in native Tirunelveli vegetables and greens for wider reach." },
//     { company: "Erode Manjal Online Mart", reason: "Online store for turmeric and fresh vegetables from Erode region." }
//   ];
  
  const addresses = [
    "12, R. S. Puram, Coimbatore - 641002, Tamil Nadu",
    "45, Usman Road, T. Nagar, Chennai - 600017, Tamil Nadu",
    "78B, Simmakkal Main Road, Madurai - 625001, Tamil Nadu",
    "Plot 101, Cherry Road, Hasthampatti, Salem - 636007, Tamil Nadu",
    "22, Trivandrum Road, Palayamkottai, Tirunelveli - 627002, Tamil Nadu",
    "3/50, Perundurai Road, Erode - 638011, Tamil Nadu"
  ];
  
  const generatePassword = () => `Pass@${Math.floor(1000 + Math.random() * 9000)}`;
  
  let mockSignupRequestsDB: SignupRequest[] = [];
  
  for (let i = 0; i < 6; i++) {
    const nameIndex = Math.floor(Math.random() * tamilNames.length);
    const addressIndex = Math.floor(Math.random() * addresses.length);
    const daysAgo = Math.floor(Math.random() * 10) + 1;
    const initialStatuses: SignupRequest['status'][] = ['Pending Approval', 'Pending Approval', 'Approved', 'Rejected', 'Pending Approval'];
  
  
    mockSignupRequestsDB.push({
      _id: `signupTN${String(i + 1).padStart(3, '0')}`,
      fullName: tamilNames[nameIndex % tamilNames.length], // Use modulo to avoid out of bounds if arrays differ in length
      email: `${tamilNames[nameIndex % tamilNames.length].split(" ")[0].toLowerCase()}@example.co.in`,
      phoneNumber: `9${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
      address: addresses[addressIndex % addresses.length],
      password: generatePassword(),
     
      requestedDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      status: initialStatuses[i % initialStatuses.length]
    });
    // To ensure some variety and test the "Send to Vendor" for already approved ones
    if (i === 2) mockSignupRequestsDB[i].status = 'Approved'; // Ensure one is 'Approved'
    if (i === 1 && mockSignupRequestsDB.length > 1) mockSignupRequestsDB[1].status = 'Pending Approval';
  }
  
  
  // --- Service Functions ---
  
  export const getSignupRequests = async (): Promise<SignupRequest[]> => {
    console.log("Fetching signup requests from service...");
    return new Promise(resolve => setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(mockSignupRequestsDB)));
    }, 700));
  };
  
  export const updateSignupRequestStatus = async (
    id: string,
    status: SignupRequest['status'],
  ): Promise<SignupRequest> => {
    console.log(`Service: Updating signup request ${id} to status ${status}`);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requestIndex = mockSignupRequestsDB.findIndex(req => req._id === id);
        if (requestIndex !== -1) {
          mockSignupRequestsDB[requestIndex] = {
            ...mockSignupRequestsDB[requestIndex],
            status: status,
          };
          resolve(JSON.parse(JSON.stringify(mockSignupRequestsDB[requestIndex])));
        } else {
          console.error(`Service: Signup request with ID ${id} not found.`);
          reject(new Error("Signup request not found"));
        }
      }, 500);
    });
  };
  
  export const sendSignupDetailsToVendorService = async (id: string): Promise<SignupRequest> => {
    console.log(`Service: Sending details of approved signup request ${id} to vendor.`);
    // This action now specifically happens after approval.
    // It will change the status from 'Approved' to 'Sent To Vendor'.
    return updateSignupRequestStatus(id, 'Sent To Vendor');
  };