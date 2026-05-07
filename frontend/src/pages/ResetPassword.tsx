import { useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get("token");

  const reset = async () => {
    await API.post("/auth/reset_password", {
      token,
      newPassword: password,
    });

    alert("Password reset successful");
    navigate("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Reset Password</CardHeader>

        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={reset}>
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
