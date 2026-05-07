import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function ForgetPassword() {
  return <div>    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Forgot Password</CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email"  />

          <Button className="w-full" >
            Send Reset Link
          </Button>
        </CardContent>
      </Card>
    </div></div>;
}

export default ForgetPassword;
