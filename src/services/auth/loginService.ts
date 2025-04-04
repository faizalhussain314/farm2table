import axios from 'axios';

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    phoneNumber: string;
    role: string;
  };
  token: string;
}


const baseUrl = import.meta.env.VITE_API_BASE_URL;



export const login = async (phoneNumber: string, password: string): Promise<LoginResponse> => {


  try {
   
    console.log("base url", baseUrl);
    const loginUrl = `${baseUrl}/auth/login`;
    const response = await axios.post<LoginResponse>(loginUrl, { phoneNumber, password });
    const { token } = response.data;
   
    sessionStorage.setItem('authToken', token);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};
