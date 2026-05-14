
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-serif font-bold text-primary">Fale Conosco</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Entre em contato conosco para pedidos de oração, dúvidas ou para saber mais sobre nossa igreja.
                    Estamos aqui para servir você.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <MapPin className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Endereço</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Rua Helmut Gums, 438 - Virada<br />
                                    Santa Maria de Jetibá - ES, 29645-000
                                </p>
                                <Button variant="link" className="p-0 h-auto mt-2" asChild>
                                    <a
                                        href="https://maps.app.goo.gl/UsxnnZ69miAvFzvs6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver no Google Maps
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Phone className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Telefone</h3>
                                <a
                                    href="tel:+5527998757008"
                                    className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                                >
                                    (27) 99875-7008
                                </a>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Disponível em horário comercial
                                </p>
                            </div>
                        </CardContent>
                    </Card>


                    <Card>
                        <CardContent className="p-6 flex items-start space-x-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Clock className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Horários de Culto</h3>
                                <ul className="text-muted-foreground text-sm space-y-1">
                                    <li>Domingo: 18:00 - Culto de Celebração</li>
                                    <li>Quinta: 19:30 - Culto Maná</li>
                                    <li>Sexta: 06:00 - Oração</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map or Decoration */}
                <div className="min-h-[400px] bg-muted rounded-2xl flex items-center justify-center p-8 relative overflow-hidden group">
                    {/* Placeholder for map iframe or image */}
                    <div className="absolute inset-0 bg-secondary/10 flex flex-col items-center justify-center text-center p-6">
                        <MapPin className="w-16 h-16 text-primary/40 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-bold text-primary mb-2">Venha nos visitar</h3>
                        <p className="text-muted-foreground mb-6">
                            Clique no botão abaixo para abrir a localização exata no Google Maps.
                        </p>
                        <Button size="lg" className="rounded-full shadow-lg" asChild>
                            <a
                                href="https://maps.app.goo.gl/UsxnnZ69miAvFzvs6"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Abrir GPS
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
