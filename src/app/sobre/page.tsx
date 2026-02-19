
import Image from "next/image";
import { Instagram, GraduationCap, Heart, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
            {/* Header Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Sobre a Igreja Paraíso</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    "Casa de Deus, minha família."
                </p>
            </div>

            {/* Senior Pastor Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 md:order-1 space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
                            Presidente
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            Pr. Evandro Menezes
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Líder visionário e dedicado ao ministério pastoral, o Pr. Evandro tem servido a esta geração com paixão pelo Evangelho e amor pelas pessoas.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Card className="border-none shadow-sm bg-muted/50">
                            <CardContent className="p-4 flex items-start gap-4">
                                <GraduationCap className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Formação Acadêmica</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Mestre em Teologia pela <strong>Eastern University</strong> (Pensilvânia - EUA).
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-muted/50">
                            <CardContent className="p-4 flex items-start gap-4">
                                <Heart className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground">Família</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Casado com <strong>Ricelle Menezes Gonçalves</strong>, sua parceira de vida e ministério.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-2">
                        <Button variant="outline" className="gap-2" asChild>
                            <a
                                href="https://www.instagram.com/prevandromenezes/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram className="w-4 h-4" />
                                Siga no Instagram
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="order-1 md:order-2">
                    <div className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50 rotate-3 transition-transform hover:rotate-0 duration-500">
                        <Image
                            src="/pastor.jpg"
                            alt="Pr. Evandro Menezes"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Missions/Branch Churches Section */}
            <div className="space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Nossos Pastores e Missões</h2>
                    <p className="text-muted-foreground text-lg">
                        Conheça os líderes que cuidam das nossas igrejas filiais e missões.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MissionCard
                        name="Pr. Clétson Barros"
                        role="Pastor Auxiliar - Sede"
                        location="Santa Maria de Jetibá - ES"
                        image="/prCletsonB.jpg"
                    />
                    <MissionCard
                        name="Pr. Leandro Hins de Brito"
                        role="Pastor Auxiliar - Sede"
                        location="Santa Maria de Jetibá - ES"
                        image="/prLeandroB.jpg"
                    />
                    <MissionCard
                        name="Pr. Robson Jose Maria"
                        role="Pastor Local"
                        location="Itaguaçu - ES"
                        image="/prRobsonJ.jpg"
                    />
                    <MissionCard
                        name="Pr. Tiago Pio"
                        role="Pastor Local"
                        location="Santa Teresa - ES"
                        image="/pastorTiagoP.jpg"
                    />
                    <MissionCard
                        name="Pr. Jheferson Marlo Marcal Rosa"
                        role="Pastor Local"
                        location="Rio Possmoser - ES"
                        image="/prJhefersonM.jpg"
                    />
                    <MissionCard
                        name="Pr. Herbert Neiva"
                        role="Pastor Local"
                        location="Aracruz - ES"
                        image="/prHerbertN.jpg"
                    />
                    <MissionCard
                        name="Pr. Cloves Souza"
                        role="Pastor Local"
                        location="Anchieta - ES"
                        image="/prClovesS.jpg"
                    />
                </div>
            </div>
        </div>
    );
}

function MissionCard({ name, role, location, image }: { name: string, role: string, location: string, image: string }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-none shadow-sm h-full flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <CardContent className="p-6 flex flex-col gap-2 flex-grow bg-card relative">
                <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1" title={name}>{name}</h3>
                    <p className="text-sm text-primary font-medium">{role}</p>
                </div>
                <div className="mt-auto pt-4 flex items-center gap-2 text-muted-foreground text-sm border-t border-border/40">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{location}</span>
                </div>
            </CardContent>
        </Card>
    );
}
