import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Toaster position="top-right" richColors />

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<RegisterForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
