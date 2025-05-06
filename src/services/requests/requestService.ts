// src/services/requests/requestService.ts

export interface Request {
    _id: string;
    userName: string;
    requestType: "Address Change" | "Phone Number Change" | "New Registration" | "Other";
    details: string;
    status: "Pending" | "Approved" | "Rejected" | "In Progress";
    requestedDate: string; // ISO date string
  }
  
  // More diverse dummy data
  const dummyRequests: Request[] = [
    {
      _id: "req101",
      userName: "Alice Wonderland",
      requestType: "Address Change",
      details: "Moving to 123 Main St, Anytown, AT 12345. Previous: 456 Old Rd.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req102",
      userName: "Bob The Builder",
      requestType: "Phone Number Change",
      details: "New number: 555-0102. Old number: 555-0001.",
      status: "Approved",
      requestedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req103",
      userName: "Charlie Brown",
      requestType: "New Registration",
      details: "Wants to join the platform. Email: charlie@example.com",
      status: "In Progress",
      requestedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req104",
      userName: "Diana Prince",
      requestType: "Address Change",
      details: "Current address on file is outdated. New: 789 Amazon Way.",
      status: "Rejected",
      requestedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req105",
      userName: "Edward Scissorhands",
      requestType: "Other",
      details: "Requesting an update to profile picture due to policy violation.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      _id: "req106",
      userName: "Fiona Gallagher",
      requestType: "New Registration",
      details: "Applying for a new account. Referred by Bob.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      _id: "req107",
      userName: "George Jetson",
      requestType: "Phone Number Change",
      details: "Lost old phone, new number is 555-7890.",
      status: "Approved",
      requestedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req108",
      userName: "Hannah Montana",
      requestType: "Address Change",
      details: "Updating P.O. Box to a street address.",
      status: "In Progress",
      requestedDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      _id: "req109",
      userName: "Tony Stark",
      requestType: "Other",
      details: "Requesting API access for a new project.",
      status: "Pending",
      requestedDate: new Date().toISOString(),
    },
    {
      _id: "req110",
      userName: "Bruce Wayne",
      requestType: "New Registration",
      details: "Registering a new corporate account.",
      status: "Approved",
      requestedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
     {
      _id: "req111",
      userName: "Clark Kent",
      requestType: "Address Change",
      details: "Moving from Smallville to Metropolis.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    },
    {
      _id: "req112",
      userName: "Peter Parker",
      requestType: "Phone Number Change",
      details: "Aunt May broke my phone. New number is 555-BUGG.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
  ];
  
  export const getRequests = (): Promise<Request[]> => {
    console.log("Fetching requests from dummy service...");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Dummy requests fetched:", dummyRequests);
        resolve([...dummyRequests].sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())); // Return a copy, sorted by most recent
      }, 2000 + Math.random() * 1000); // 2-3 seconds delay
    });
  };
  
  export const deleteRequest = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = dummyRequests.findIndex((req) => req._id === id);
        if (index !== -1) {
          // In a real app, you'd update backend. Here we simulate by removing from dummy array for subsequent "gets" if any.
          // For the component, it will filter its own state.
          // dummyRequests.splice(index, 1); //
          console.log(`Dummy delete for request ID: ${id} (simulated)`);
          resolve();
        } else {
          reject(new Error("Request not found for deletion"));
        }
      }, 1000);
    });
  };
  
  // Dummy Add/Update functions for completeness, can be expanded for modal interactions
  // These would typically interact with the `dummyRequests` array as well if fully implemented
  
  export const addRequestService = async (
    requestData: Omit<Request, "_id" | "requestedDate" | "status">
  ): Promise<Request> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: Request = {
          _id: `req${Date.now()}`,
          ...requestData,
          status: "Pending", // New requests are typically pending
          requestedDate: new Date().toISOString(),
        };
        dummyRequests.unshift(newRequest); // Add to the beginning of the list
        console.log("Dummy addRequestService:", newRequest);
        resolve(newRequest);
      }, 1500);
    });
  };
  
  export const updateRequestService = async (
    id: string,
    updates: Partial<Omit<Request, "_id" | "requestedDate">>
  ): Promise<Request> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = dummyRequests.findIndex((req) => req._id === id);
        if (index !== -1) {
          dummyRequests[index] = { ...dummyRequests[index], ...updates };
          console.log("Dummy updateRequestService:", dummyRequests[index]);
          resolve(dummyRequests[index]);
        } else {
          reject(new Error("Request not found for update"));
        }
      }, 1500);
    });
  };