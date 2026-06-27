import axiosClient from "./axiosClient";

export const challengeApi = {
  getChallenges: async () => {
    const response = await axiosClient.get("/challenges");
    return response.data;
  },

  requestPersonalizedChallenge: async (payload) => {
    const response = await axiosClient.post("/challenges/ai-requests", payload);
    return response.data;
  },

  getMyPersonalizedChallengeRequests: async () => {
    const response = await axiosClient.get("/challenges/ai-requests/my");
    return response.data;
  },

  getPersonalizedChallengeRequestsForAdmin: async () => {
    const response = await axiosClient.get("/challenges/ai-requests/admin");
    return response.data;
  },

  approvePersonalizedChallengeRequest: async (requestId, payload = {}) => {
    const response = await axiosClient.patch(
      `/challenges/ai-requests/${requestId}/approve`,
      payload
    );

    return response.data;
  },

  rejectPersonalizedChallengeRequest: async (requestId, payload = {}) => {
    const response = await axiosClient.patch(
      `/challenges/ai-requests/${requestId}/reject`,
      payload
    );

    return response.data;
  },
};