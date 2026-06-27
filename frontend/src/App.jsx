import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CertificateView from "./pages/CertificateView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import VerifyCertificate from "./pages/VerifyCertificate";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

const App = () => {
  return (
    <Routes>
    

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
         <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        <Route path="/verify" element={<VerifyCertificate />} />
<Route
  path="/certificate/:certificateId"
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <CertificateView />
    </ProtectedRoute>
  }
/>      <Route path="/pricing" element={<Pricing />} />
      <Route path="/checkout/:planId" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;