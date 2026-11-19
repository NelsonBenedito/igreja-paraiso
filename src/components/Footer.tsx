'use client';

import React from 'react';
import { NAV_ITEMS } from '../constants';
import { usePathname } from 'next/navigation';
import type { SiteContact } from '@/lib/site-content/types';

interface FooterProps {
    contact: SiteContact;
}

const LABEL = 'mb-5 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted';
const LINK = 'transition-colors hover:text-detail';

const Footer: React.FC<FooterProps> = ({ contact }) => {
    const pathname = usePathname();
    if (pathname === '/login' || pathname?.startsWith('/membros')) return null;

    const socialLinks = [
        { href: contact.youtubeUrl, label: 'YouTube' },
        { href: contact.instagramUrl, label: 'Instagram' },
        { href: contact.facebookUrl, label: 'Facebook' },
    ].filter((s) => s.href.trim());

    return (
        <footer className="border-t border-ink bg-paper text-ink font-display">
            <div className="mx-auto max-w-[82rem] px-5 pt-20 pb-10 md:px-16 md:pt-24">
                <div className="flex flex-wrap gap-12 pb-16 md:pb-[72px]">
                    {contact.tagline.trim() ? (
                        <p className="m-0 max-w-[520px] flex-[2_1_360px] text-[22px] font-light leading-[1.45] tracking-[-0.01em]">
                            {contact.tagline}
                        </p>
                    ) : null}

                    <div className="flex-[1_1_180px]">
                        <h4 className={LABEL}>Navegar</h4>
                        <ul className="flex flex-col gap-2.5 text-[15px]">
                            {NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className={LINK}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex-[1_1_240px]">
                        <h4 className={LABEL}>Contato</h4>
                        <ul className="flex flex-col gap-2.5 text-[15px]">
                            {contact.phone.trim() ? (
                                <li>{contact.phone}</li>
                            ) : null}
                            {contact.email.trim() ? (
                                <li>
                                    <a href={`mailto:${contact.email}`} className={LINK}>{contact.email}</a>
                                </li>
                            ) : null}
                            {contact.address.trim() ? (
                                <li className="whitespace-pre-line">{contact.address}</li>
                            ) : null}
                            {socialLinks.length > 0 ? (
                                <li className="mt-2 flex flex-wrap gap-4">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="border-b border-current pb-0.5 transition-colors hover:text-detail"
                                        >
                                            {social.label}
                                        </a>
                                    ))}
                                </li>
                            ) : null}
                        </ul>
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className="mb-10 -ml-[0.04em] overflow-hidden whitespace-nowrap text-[17vw] font-semibold leading-[0.8] tracking-[-0.06em] select-none"
                >
                    Paraíso<span className="text-detail">.</span>
                </div>

                <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-hairline pt-6 text-[13px] text-ink-muted">
                    {contact.copyright.trim() ? <span>{contact.copyright}</span> : null}
                    <span>Casa de Deus. Minha família.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
