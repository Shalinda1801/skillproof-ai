import axiosClient from "./axiosClient";

export const skillApi = {
  getSkills: async () => {
    const response = await axiosClient.get("/skills");
    return response.data;
  },
};