import { useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendLink = async () => {
    await API.post("/auth/forgot_password", { email });
    alert("Reset link sent to email");
    navigate("/reset-password");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Forgot Password</CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button className="w-full" onClick={sendLink}>
            Send Reset Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;
