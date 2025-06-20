// src/pages/LoginPage.tsx
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
import type { User } from "../types"
import Login from "../components/Login"
import { useState } from "react";
import { usersMock } from "@/mock/user.ts";

export default function LoginPage() {
  const [users] = useState<User[]>(usersMock);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Login users={users}>
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
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={onEmailChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Mot de passe</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Mot de passe oublié?
                      </a>
                    </div>
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
