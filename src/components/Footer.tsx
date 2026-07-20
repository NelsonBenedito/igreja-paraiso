'use client';

import React from 'react';
import { Youtube, Instagram, Facebook, Phone, MapPin, Mail } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { usePathname } from 'next/navigation';
import type { SiteContact } from '@/lib/site-content/types';

interface FooterProps {
    contact: SiteContact;
}

const Footer: React.FC<FooterProps> = ({ contact }) => {
    const pathname = usePathname();
    if (pathname === '/login' || pathname?.startsWith('/membros')) return null;

    const socialLinks = [
        { icon: Youtube, href: contact.youtubeUrl, label: 'YouTube' },
        { icon: Instagram, href: contact.instagramUrl, label: 'Instagram' },
        { icon: Facebook, href: contact.facebookUrl, label: 'Facebook' },
    ].filter((s) => s.href.trim());

    return (
        <footer className="bg-paraiso-blue-dark text-white py-24">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                    {/* Brand */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <img src="/LogoParaisoW.svg" alt="Logo" className="w-42 object-contain" />
                        </div>
                        {contact.tagline.trim() ? (
                            <p className="text-slate-400 leading-relaxed text-lg">
                                {contact.tagline}
                            </p>
                        ) : null}
                        <div className="flex gap-5">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-paraiso-green transition-all transform hover:scale-110"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
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
                            {contact.phone.trim() ? (
                                <li className="flex items-start gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                                    <Phone className="w-6 h-6 text-paraiso-green shrink-0" />
                                    <span className="text-lg">{contact.phone}</span>
                                </li>
                            ) : null}
                            {contact.email.trim() ? (
                                <li className="flex items-start gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                                    <Mail className="w-6 h-6 text-paraiso-green shrink-0" />
                                    <a href={`mailto:${contact.email}`} className="text-lg">{contact.email}</a>
                                </li>
                            ) : null}
                            {contact.address.trim() ? (
                                <li className="flex items-start gap-4 text-slate-400 group cursor-pointer hover:text-white transition-colors">
                                    <MapPin className="w-6 h-6 text-paraiso-green shrink-0" />
                                    <span className="text-lg">{contact.address}</span>
                                </li>
                            ) : null}
                        </ul>
                    </div>

                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
                    <p>{contact.copyright}</p>
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
