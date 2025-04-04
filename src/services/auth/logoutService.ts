import axiosInstance from '../../utils/axiosInstance';

export const logoutRequest = async () => {
  await axiosInstance.post('/auth/logout');
};
