"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, FileText, Video, Calendar, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface MembrosClientProps {
    user: {
        email?: string;
    };
}

export default function MembrosClient({ user }: MembrosClientProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl shadow-sm border">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-foreground">Bem-vindo, Membro!</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                        <LogOut size={16} /> Sair
                    </Button>
                </div>

                <Separator className="bg-border/60" />

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard
                        icon={<FileText className="w-8 h-8 text-primary" />}
                        title="Boletim Semanal"
                        description="Acesse o boletim digital desta semana com todas as novidades."
                        actionLabel="Baixar PDF"
                        onAction={() => { }}
                    />

                    <DashboardCard
                        icon={<Video className="w-8 h-8 text-indigo-500" />}
                        title="Estudos Bíblicos"
                        description="Gravações exclusivas dos nossos estudos de aprofundamento."
                        actionLabel="Assistir Agora"
                        onAction={() => { }}
                    />

                    <DashboardCard
                        icon={<Calendar className="w-8 h-8 text-amber-500" />}
                        title="Escala de Ministérios"
                        description="Veja a escala de serviço para o próximo mês."
                        actionLabel="Visualizar"
                        onAction={() => { }}
                    />
                </div>
            </div>
        </div>
    );
}

interface DashboardCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
}

function DashboardCard({ icon, title, description, actionLabel, onAction }: DashboardCardProps) {
    return (
        <Card className="hover:shadow-md transition-all duration-300 border-muted-foreground/10 group">
            <CardHeader className="flex flex-col items-center text-center pb-2">
                <div className="p-4 rounded-full bg-muted mb-4 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <CardDescription className="text-base">
                    {description}
                </CardDescription>
                <Button variant="link" onClick={onAction} className="text-primary font-semibold p-0 h-auto hover:text-primary/80">
                    {actionLabel}
                </Button>
            </CardContent>
        </Card>
    );
}
