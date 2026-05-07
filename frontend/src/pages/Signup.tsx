import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function Signup() {
  return <div>   <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>Signup</CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name"  />
          <Input placeholder="Email"  />
          <Input type="password" placeholder="Password" />

          <Button className="w-full">
            Create Account
          </Button>
        
        </CardContent>
      </Card>
    </div></div>;
}

export default Signup;
