import axiosClient from "./axiosClient";

export const challengeApi = {
  getChallenges: async () => {
    const response = await axiosClient.get("/challenges");
    return response.data;
  },
};