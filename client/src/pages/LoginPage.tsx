import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import Login from "../components/Login"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Login>
        {({ email, password, error, onEmailChange, onPasswordChange, onSubmit }) => (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Connexion à votre compte</CardTitle>
              <CardDescription>
                Entrez vos informations pour vous connecter
              </CardDescription>
              <CardAction>
                <Link to="/signup">
                  <Button variant="link">Inscription</Button>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form id="login" onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={onEmailChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={onPasswordChange}
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" form="login">
                Login
              </Button>
            </CardFooter>
          </Card>
        )}
      </Login>
    </div>
  )
}

