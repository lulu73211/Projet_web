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
import { Link } from "react-router"
import { useState } from "react";
import { useUserStore } from '../store/userStore.ts'

export default function Login() {
    const setUser = useUserStore((state) => state.setUser)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setUser({id: 1, name: "", email: email, jwt: "Salut"})
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Connection à votre compte</CardTitle>
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
                    <form id={"login"} onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
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
                                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" form={"login"}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
