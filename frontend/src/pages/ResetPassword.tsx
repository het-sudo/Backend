import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function ResetPassword() {
  return <div><div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Reset Password</CardHeader>

        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="New Password"
          />

          <Button className="w-full" >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </div></div>;
}

export default ResetPassword;
