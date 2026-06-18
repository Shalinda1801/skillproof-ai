import axiosClient from "./axiosClient";

export const adminApi = {
  getAllSubmissions: async () => {
    const response = await axiosClient.get("/submissions");
    return response.data;
  },

  updateSubmissionStatus: async (submissionId, payload) => {
    const response = await axiosClient.patch(
      `/submissions/${submissionId}/status`,
      payload
    );
    return response.data;
  },

  runAiAssessment: async (submissionId) => {
    const response = await axiosClient.post(`/ai/assess/${submissionId}`);
    return response.data;
  },

  generateCertificate: async (submissionId) => {
    const response = await axiosClient.post(
      `/certificates/generate/${submissionId}`
    );
    return response.data;
  },

  getAllCertificates: async () => {
    const response = await axiosClient.get("/certificates/admin");
    return response.data;
  },
};