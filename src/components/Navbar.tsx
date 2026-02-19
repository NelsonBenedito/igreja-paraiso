"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const navLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#programacao", label: "Programação" },
    { href: "#mensagens", label: "Mensagens" },
    { href: "#onde", label: "Onde estamos" },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/IgrejaParaiso.webp"
                alt="Igreja Paraíso"
                width={180}
                height={50}
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="#voluntario">Seja um Voluntário</Link>
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col justify-between bg-background/95 backdrop-blur-xl border-l-primary/10">
                <div className="flex flex-col h-full">
                  <SheetHeader className="mb-8 items-center text-center">
                    <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                    <div className="relative w-40 h-16 mb-2">
                      <Image
                        src="/IgrejaParaiso.webp"
                        alt="Igreja Paraíso"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </SheetHeader>

                  <nav className="flex flex-col gap-6 flex-1 px-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between text-lg font-medium text-foreground/80 hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/5 group border-b border-transparent hover:border-border"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                          {/* Optional: Add an icon or arrow here if desired */}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="flex flex-col gap-4 mt-auto pb-8 px-2">
                    <div className="w-full h-px bg-border my-2 opacity-50" />
                    <SheetClose asChild>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md h-12 text-base">
                        <Link href="#voluntario">Seja um Voluntário</Link>
                      </Button>
                    </SheetClose>

                    <div className="flex items-center justify-center gap-4 py-2 text-sm text-muted-foreground">
                      <span>Tema:</span>
                      <ModeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
