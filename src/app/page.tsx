import Image from "next/image";
import Link from "next/link";
import { RegistrationForm } from "@/components/registration-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Trophy } from "lucide-react";
import { ScheduleSection } from "@/components/schedule";
import { ThemesSection } from "@/components/themes";
import { PhotosSection } from "@/components/photos";
import { LocationSection } from "@/components/location";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Retiro de Jovens - 1º IPB Itapipoca
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Glorificando a Deus nos relacionamentos
            </h2>
            <p className="text-lg opacity-80">
              Baseado em 1 Coríntios 10:31
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 text-sm sm:px-4">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">14-17 Jan 2025</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 text-sm sm:px-4">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Praia da Baleia</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 text-sm sm:px-4">
              <Users className="h-5 w-5" />
              <span className="text-xs sm:text-sm hidden sm:inline">Para jovens de 12-35 anos</span>
              <span className="text-xs sm:hidden">12-35 anos</span>
            </div>
          </div>
          <div className="text-lg">
            <p className="mb-4">Inscrições abertas!</p>
            <p className="text-sm opacity-75">Vagas limitadas - Garanta a sua!</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Sobre o Retiro
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                O Retiro de Jovens UMP é um evento anual organizado pela Mocidade de Jovens
                da nossa igreja, com o objetivo de proporcionar momentos de reflexão, comunhão
                e crescimento espiritual.
              </p>
              <p className="text-lg leading-relaxed">
                Durante quatro dias intensos, jovens de diferentes idades e origens se reúnem
                para compartilhar experiências, fortalecer a fé e criar laços de amizade que
                duram para toda a vida.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">4 Dias</h3>
                    <p className="text-sm text-muted-foreground">de imersão</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Comunhão</h3>
                    <p className="text-sm text-muted-foreground">entre jovens</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/card_retiro.jpeg"
                  alt="Card do Retiro UMP"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <ThemesSection />

      {/* Schedule Section */}
      <ScheduleSection />

      {/* Photos Section */}
      <PhotosSection />

      {/* Location Section */}
      <LocationSection />

      {/* Registration Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Faça sua Inscrição
          </h2>
          <div className="mb-8">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3">Informações Importantes:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Idade mínima: 12 anos</li>
                <li>• Vagas limitadas - inscrição por ordem de chegada</li>
                <li>• Taxa de inscrição: R$ 230,00 (confirmação mediante pagamento )</li>
                <li>• Prazo para confirmação: até 10 de fevereiro</li>
                <li>• Dúvidas: entre em contato conosco</li>
              </ul>
            </div>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* Votação Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Votação do Retiro
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Participe da votação para eleger os melhores momentos do retiro!
          </p>
          <Link href="/votacao">
            <Button size="lg" className="gap-2">
              <Trophy className="h-5 w-5" />
              Ir para Votação
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-semibold mb-2">UMP - Mocidade de Jovens</p>
          <p className="text-sm opacity-80">
            Construindo o futuro da igreja através dos nossos jovens
          </p>
          
          {/* <div className="mt-4 text-xs opacity-60">
            <p>© 2026 Retiro de Jovens UMP. Todos os direitos reservados.</p>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
