import axiosClient from "./axiosClient";

export const submissionApi = {
  createSubmission: async (payload) => {
    const response = await axiosClient.post("/submissions", payload);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await axiosClient.get("/submissions/my");
    return response.data;
  },
};