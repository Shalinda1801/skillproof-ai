import axiosClient from "./axiosClient";

export const certificateApi = {
  getMyCertificates: async () => {
    const response = await axiosClient.get("/certificates/my");
    return response.data;
  },

  verifyCertificate: async (certificateId) => {
    const response = await axiosClient.get(`/certificates/verify/${certificateId}`);
    return response.data;
  },
};