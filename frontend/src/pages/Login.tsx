import { useState } from "react";
import API from "@/lib/api";
import { setAccessToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    setAccessToken(res.data.accessToken);
    alert("Login successful");
    navigate("/change-password");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Login</CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={login}>
            Login
          </Button>

          <a href="/forgot-password" className="text-sm text-center block">
            Forgot Password?
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
