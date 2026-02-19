import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted text-foreground">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4 text-primary">Igreja Paraíso</h3>
                        <p className="text-muted-foreground mb-4 max-w-xs italic text-lg font-serif">
                            "Casa de Deus, minha família."
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="hidden text-muted-foreground hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </Link>
                            <a href="https://www.instagram.com/paraisoigreja_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 text-primary">Links Rápidos</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/sobre" className="hover:text-primary transition-colors">Quem Somos</Link></li>
                            <li><Link href="/eventos" className="hover:text-primary transition-colors">Eventos</Link></li>
                            <li><Link href="/membros" className="hover:text-primary transition-colors">Área de Membros</Link></li>
                            <li><Link href="/contato" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 text-primary">Contato</h3>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                                <a
                                    href="https://maps.app.goo.gl/UsxnnZ69miAvFzvs6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    Rua Helmut Gums, 438 - Virada<br />
                                    Santa Maria de Jetibá - ES, 29645-000
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary flex-shrink-0" size={18} />
                                <a href="tel:+5527998757008" className="hover:text-primary transition-colors">
                                    (27) 99875-7008
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary flex-shrink-0" size={18} />
                                <span>contato@igrejaparaiso.com.br</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-border/50" />

                <div className="text-center text-muted-foreground text-sm">
                    <p>&copy; {currentYear} Igreja Paraíso. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
