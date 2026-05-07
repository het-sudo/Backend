import { useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    await API.post("/auth/register", {
      name,
      email,
      password,
    });

    alert("Account created");
    navigate("/login");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Signup</CardHeader>

        <CardContent className="space-y-3">
          <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={signup}>
            Create Account
          </Button>
          <Button className="w-full">
            <Link to={"/login"}>Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
