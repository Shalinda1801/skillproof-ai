import axiosClient from "./axiosClient";

export const paymentApi = {
  createCertificatePayment: async (certificateId) => {
    const response = await axiosClient.post("/payments/certificate", {
      certificateId,
    });

    return response.data;
  },

  getMyPayments: async () => {
    const response = await axiosClient.get("/payments/my");
    return response.data;
  },

  getPaymentByOrderId: async (orderId) => {
    const response = await axiosClient.get(`/payments/order/${orderId}`);
    return response.data;
  },
};