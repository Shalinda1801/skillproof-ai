import axiosClient from "./axiosClient";

export const aiApi = {
  getAssessmentBySubmission: async (submissionId) => {
    const response = await axiosClient.get(`/ai/assessment/${submissionId}`);
    return response.data;
  },
};