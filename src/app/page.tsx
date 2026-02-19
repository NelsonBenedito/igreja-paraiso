import { Calendar, Clock, MapPin, Users, BookOpen, ArrowRight, Heart, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/animations/FadeIn";
import LatestStream from "@/components/LatestStream";
import * as motion from "framer-motion/client";
import { StaggeredWords } from "@/components/animations/StaggeredText";
import PremiumButton from "@/components/buttons/PremiumButton";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section id="inicio" className="relative w-full py-24 md:py-32 flex items-center justify-center bg-primary/5 px-4 overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 z-0 opacity-10 pattern-grid-lg text-primary" />
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <FadeIn>
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-primary drop-shadow-sm flex flex-col items-center">
                <StaggeredWords text="Bem-vindo à" className="block text-2xl md:text-3xl lg:text-4xl mb-2 font-sans font-medium text-foreground/80 text-center" />
                <StaggeredWords text="Igreja Paraíso" delay={0.5} className="block mt-2" />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                Seja bem-vindo a nossa família para pertencer! Uma igreja em muitos lugares.
              </motion.p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PremiumButton href="#sobre" size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-primary-foreground">
                Conheça Nossa História
              </PremiumButton>
              <PremiumButton href="#programacao" variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-primary/10 hover:text-primary backdrop-blur-sm">
                Nossa Programação
              </PremiumButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pastoral Message Section */}
      <section id="sobre" className="max-w-4xl mx-auto px-4 sm:px-6 w-full py-12">
        <FadeIn>
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold text-primary">Uma Palavra Pastoral</h2>
            <Separator className="w-24 mx-auto bg-primary/30" />
            <blockquote className="text-xl md:text-3xl font-serif italic text-muted-foreground leading-relaxed">
              &quot;Participar de uma comunidade é um dos melhores caminhos para encorajar o crescimento espiritual.&quot;
            </blockquote>
          </div>
        </FadeIn>
      </section>

      {/* Programming Section */}
      <section id="programacao" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-muted/30 py-16 rounded-3xl">
        <FadeIn className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Programação Semanal</h2>
          <Separator className="w-24 mx-auto bg-primary/30" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Junte-se a nós para momentos de comunhão e crescimento.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <ServiceCard
            title="Campanha da Vitória"
            time="Quarta-feira às 20h"
            desc="Uma noite poderosa de oração e busca por milagres."
            icon={<Sparkles className="w-6 h-6 text-primary-foreground" />}
            delay={0.2}
          />
          <ServiceCard
            title="Juventude Eleve"
            time="Sábado às 19h"
            desc="Encontro vibrante para jovens, com muita música e palavra."
            icon={<Star className="w-6 h-6 text-primary-foreground" />}
            delay={0.4}
          />
          <ServiceCard
            title="Celebração Dominical"
            time="Domingo às 10h e 18h"
            desc="Nosso encontro principal da semana para celebrar a Jesus."
            icon={<Users className="w-6 h-6 text-primary-foreground" />}
            delay={0.6}
          />
        </div>
      </section>

      {/* Ministries Section - Placeholder for News/Ministries */}
      <section id="ministerios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FadeIn className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Nossos Ministérios</h2>
          <Separator className="w-24 mx-auto bg-primary/30" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MinistryCard title="Eleve" target="Jovens" color="bg-blue-500" />
          <MinistryCard title="Ignição" target="Crianças" color="bg-orange-500" />
          <MinistryCard title="Diamante" target="Mulheres" color="bg-pink-500" />
        </div>
      </section>

      {/* Latest Stream Section */}
      <section id="mensagens">
        <LatestStream />
      </section>

      {/* Volunteer / CTA Section */}
      <section id="voluntario" className="w-full py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid-lg opacity-10" />
        <FadeIn className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Faça Parte da Equipe</h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Deus tem um propósito especial para sua vida. Descubra como você pode servir e transformar vidas.
          </p>
          <div className="pt-4">
            <PremiumButton href="/contato" size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl border-none">
              Seja um Voluntário
            </PremiumButton>
          </div>
        </FadeIn>
      </section>

      {/* Location Map Teaser */}
      <section id="onde" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FadeIn className="bg-card rounded-3xl overflow-hidden shadow-sm border" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-primary/5">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
                  <MapPin className="text-primary" /> Onde Estamos
                </h2>
                <p className="text-muted-foreground text-lg">
                  Venha nos fazer uma visita.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-background p-2 rounded-full ring-1 ring-border">
                    <MapPin className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Endereço</h3>
                    <p className="text-muted-foreground">Rua Helmut Gums, 438 - Virada<br />Santa Maria de Jetibá - ES, 29645-000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-background p-2 rounded-full ring-1 ring-border">
                    <Clock className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Horários</h3>
                    <p className="text-muted-foreground">Aberto durante os horários de culto e expediente pastoral.</p>
                  </div>
                </div>
              </div>

              <PremiumButton href="https://maps.app.goo.gl/UsxnnZ69miAvFzvs6" variant="outline" className="w-fit" target="_blank" rel="noopener noreferrer">
                Ver no Google Maps
              </PremiumButton>
            </div>

            <div className="bg-muted min-h-[300px] flex items-center justify-center relative">
              {/* Decorative placeholder */}
              <div className="text-center p-6">
                <MapPin className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">Mapa Interativo</p>
                <p className="text-sm text-muted-foreground/70">(Integração futura)</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

function ServiceCard({ title, time, desc, icon, delay = 0 }: { title: string, time: string, desc: string, icon: React.ReactNode, delay?: number }) {
  return (
    <FadeIn delay={delay} className="h-full">
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="h-full"
      >
        <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
          <CardHeader>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm rotate-3 group-hover:rotate-6 transition-transform">
              {icon}
            </div>
            <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
            <div className="flex items-center gap-2 text-primary font-medium text-sm pt-1">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              {desc}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </FadeIn>
  );
}

function MinistryCard({ title, target, color }: { title: string, target: string, color: string }) {
  return (
    <FadeIn className="group relative overflow-hidden rounded-2xl aspect-video flex items-end p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer">
      <div className={`absolute inset-0 ${color} opacity-80 group-hover:opacity-90 transition-opacity`} />
      {/* Placeholder for future image */}
      <div className="absolute inset-0 bg-[url('/placeholder-texture.png')] opacity-20 mix-blend-overlay" />

      <div className="relative z-10 text-white">
        <span className="text-sm font-medium uppercase tracking-wider opacity-90 mb-1 block">{target}</span>
        <h3 className="text-3xl font-serif font-bold group-hover:translate-x-2 transition-transform">{title}</h3>
      </div>

      <motion.div
        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.1 }}
      >
        <ArrowRight className="text-white w-5 h-5" />
      </motion.div>
    </FadeIn>
  )
}
