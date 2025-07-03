import { useState } from "react"
import { useRegisterMutation  } from "@/generated/graphql"
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

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    })

    const [signup, { data, loading, error }] = useRegisterMutation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await signup({
                variables: {
                    registerInput: {
                        username: formData.username,
                        lastName: formData.lastName,
                        firstName: formData.firstName,
                        email: formData.email,
                        password: formData.password,
                    },
                },
            })
            console.log("Signup success:", res.data)
            // Redirection ou message de succès ici
        } catch (err) {
            console.error("Signup error:", err)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Créer ton compte</CardTitle>
                    <CardDescription>
                        Entre tes informations pour créer ton compte
                    </CardDescription>
                    <CardAction>
                        <Link to="/login">
                            <Button variant="link">Connexion</Button>
                        </Link>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Nom</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">Prénom</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Pseudo</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mot de passe</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <CardFooter className="flex-col gap-2 mt-6">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Création en cours..." : "Inscription"}
                            </Button>
                            {error && <p className="text-red-500 text-sm">Erreur: {error.message}</p>}
                            {data?.register?.user && (
                                <p className="text-green-600 text-sm">
                                    Compte créé pour {data.register.user.email}
                                </p>
                            )}
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
