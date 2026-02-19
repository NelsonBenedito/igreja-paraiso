
import Link from "next/link"
import { signup } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/50 px-4 py-12">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold font-serif text-center">Criar Conta</CardTitle>
                    <CardDescription className="text-center">
                        Preencha seus dados para se cadastrar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={signup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input id="name" name="name" type="text" placeholder="Seu nome" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                        </div>
                        <Button type="submit" className="w-full">
                            Cadastrar
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t pt-6 text-sm text-center text-muted-foreground">
                    <div>
                        Já tem uma conta?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Faça Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
