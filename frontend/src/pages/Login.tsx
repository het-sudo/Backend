import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function Login() {
  return (
    <div> <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Login</CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email"  />
          <Input type="password" placeholder="Password"  />

          <Button className="w-full">
            Login
          </Button>

          <p className="text-sm text-center">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </CardContent>
      </Card>
    </div></div>
  )
}

export default Login