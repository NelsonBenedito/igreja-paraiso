'use client';

import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { SOCIAL_LINKS, NAV_ITEMS } from '../constants';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
    const pathname = usePathname();
    if (pathname === '/login' || pathname?.startsWith('/membros')) return null;

    return (
        <footer className="bg-paraiso-blue-dark text-white py-24">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                    {/* Brand */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <img src="/LogoParaisoW.svg" alt="Logo" className="w-42 object-contain" />
                        </div>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Um lugar de refúgio e renovo espiritual. Existimos para amar a Deus, servir ao próximo e levar a mensagem de restauração a todos.
                        </p>
                        <div className="flex gap-5">
                            {SOCIAL_LINKS.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-paraiso-green transition-all transform hover:scale-110"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-8 text-paraiso-green uppercase tracking-widest text-sm">Links Úteis</h4>
                        <ul className="space-y-4">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-0 h-px bg-paraiso-green transition-all group-hover:w-4"></span>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-8 text-paraiso-green uppercase tracking-widest text-sm">Contato</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                                <Phone className="w-6 h-6 text-paraiso-green shrink-0" />
                                <span className="text-lg">(27) 99875-7008</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                                <MapPin className="w-6 h-6 text-paraiso-green shrink-0" />
                                <span className="text-lg">Rua Helmut Gums, 438 - Virada, Santa Maria de Jetibá - ES</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
                    <p>© 2026 Igreja Paraíso. Feitos para a Eternidade.</p>
                    <div className="flex gap-8 text-sm">
                        <a href="#" className="hover:text-paraiso-green transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-paraiso-green transition-colors">Termos</a>
                        <a href="#" className="hover:text-paraiso-green transition-colors">Contribuição</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
