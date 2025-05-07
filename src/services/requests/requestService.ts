// src/services/requests/requestService.ts

export interface Request {
    _id: string;
    userName: string;
    requestType: string;
    details: string;
    status: "Pending" | "Approved" | "Rejected" | "In Progress";
    requestedDate: string; // ISO date string
  }
  
  // More diverse dummy data
  const dummyRequests: Request[] = [
    {
      _id: "req101",
      userName: "Arun Kumar",
      requestType: "change address",
      details:
        "Old address: 12, Gandhi Nagar, Madurai ‑ 625001. New address: 45, M.G. Road, Coimbatore ‑ 641001.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req102",
      userName: "Bhavani R",
      requestType: "mobile number",
      details:
        "Old mobile: +91 90030 11111. New mobile: +91 89030 22222.",
      status: "Approved",
      requestedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req103",
      userName: "Chitra Subramanian",
      requestType: "change address and mobile number",
      details:
        "Old address: 18, North Street, Tiruchirappalli ‑ 620018. New address: 7, Anna Salai, Chennai ‑ 600002. Old mobile: +91 94444 33333. New mobile: +91 98400 44444.",
      status: "In Progress",
      requestedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req104",
      userName: "Dhinesh K",
      requestType: "change address",
      details:
        "Old address: 6/27, Rajaji Street, Salem ‑ 636004. New address: 99, Kamarajar Road, Erode ‑ 638003.",
      status: "Rejected",
      requestedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req105",
      userName: "Eshwaran P",
      requestType: "mobile number",
      details:
        "Old mobile: +91 88700 55555. New mobile: +91 95000 66666.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      _id: "req106",
      userName: "Fathima Begum",
      requestType: "change address and mobile number",
      details:
        "Old address: 33, Beach Road, Thoothukudi ‑ 628001. New address: 12, V.O.C. Street, Tirunelveli ‑ 627002. Old mobile: +91 81220 77777. New mobile: +91 81220 88888.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      _id: "req107",
      userName: "Govindaraj",
      requestType: "mobile number",
      details:
        "Old mobile: +91 90900 12345. New mobile: +91 90900 67890.",
      status: "Approved",
      requestedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req108",
      userName: "Harini S",
      requestType: "change address",
      details:
        "Old address: 57, Lake View Road, Vellore ‑ 632004. New address: 21, Thillai Nagar, Cuddalore ‑ 607003.",
      status: "In Progress",
      requestedDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      _id: "req109",
      userName: "Ilango",
      requestType: "change address and mobile number",
      details:
        "Old address: 14, College Road, Nagercoil ‑ 629001. New address: 30, Ooty Main Road, Kotagiri ‑ 643217. Old mobile: +91 94420 99999. New mobile: +91 94420 00000.",
      status: "Pending",
      requestedDate: new Date().toISOString(),
    },
    {
      _id: "req110",
      userName: "Jayakumar",
      requestType: "mobile number",
      details:
        "Old mobile: +91 98840 11111. New mobile: +91 98840 22222.",
      status: "Approved",
      requestedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req111",
      userName: "Karthikeyan",
      requestType: "change address",
      details:
        "Old address: 120, Mela Street, Kanchipuram ‑ 631501. New address: 8/2, M.G. Nagar, Puducherry ‑ 605001.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "req112",
      userName: "Lakshmi Priya",
      requestType: "change address and mobile number",
      details:
        "Old address: 73, Market Lane, Dindigul ‑ 624001. New address: 5, Park Town, Chennai ‑ 600003. Old mobile: +91 96260 33333. New mobile: +91 96260 44444.",
      status: "Pending",
      requestedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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