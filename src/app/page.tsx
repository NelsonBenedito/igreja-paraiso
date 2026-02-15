import { Calendar, Clock, MapPin, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center bg-primary/5 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 pattern-grid-lg text-primary" />
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-primary drop-shadow-sm">
              Bem-vindo à <span className="block mt-2">Igreja Paraíso</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Um lugar de fé, comunhão e esperança para você e sua família.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all">
              <Link href="/sobre">Conheça Nossa História</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-primary/5">
              <Link href="/eventos">Próximos Eventos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Nossos Encontros</h2>
          <Separator className="w-24 mx-auto bg-primary/30" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Junte-se a nós durante a semana para momentos de adoração e aprendizado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <ServiceCard
            title="Culto de Celebração"
            time="Domingo às 18:00"
            desc="Venha celebrar a Deus conosco. Adoração, palavra e comunhão."
            icon={<Users className="w-6 h-6 text-primary-foreground" />}
          />
          <ServiceCard
            title="Estudo Bíblico"
            time="Quarta às 19:30"
            desc="Aprofunde seu conhecimento na Palavra de Deus em nossos estudos semanais."
            icon={<BookOpen className="w-6 h-6 text-primary-foreground" />}
          />
          <ServiceCard
            title="Oração"
            time="Sexta às 06:00"
            desc="Comece o dia buscando a face de Deus em oração com a igreja."
            icon={<Clock className="w-6 h-6 text-primary-foreground" />}
          />
        </div>
      </section>

      {/* Verse of the Day */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <blockquote className="font-serif text-2xl md:text-4xl italic text-foreground leading-relaxed">
            "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
          </blockquote>
          <cite className="block text-primary font-bold not-italic text-lg tracking-wide">— João 3:16</cite>
        </div>
      </section>

      {/* Location Map Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-card rounded-3xl overflow-hidden shadow-sm border">
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
                    <p className="text-muted-foreground">Rua das Oliveiras, 123<br />Jardim Paraíso, São Paulo - SP</p>
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

              <Button className="w-fit" variant="outline" asChild>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="gap-2">
                  Ver no Google Maps <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
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
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, time, desc, icon }: { title: string, time: string, desc: string, icon: React.ReactNode }) {
  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm rotate-3 hover:rotate-6 transition-transform">
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
  );
}
