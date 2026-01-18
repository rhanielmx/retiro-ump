import Image from "next/image";
import { RegistrationForm } from "@/components/registration-form";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Retiro de Jovens - UMP Itapipoca
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
              Glorificando a Deus nos relacionamentos
            </h2>
            <p className="text-lg opacity-80">
              Baseado em 1 Coríntios 10:31
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Calendar className="h-5 w-5" />
              <span>14-17 de Janeiro 2025</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <MapPin className="h-5 w-5" />
              <span>Praia da Baleia</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="h-5 w-5" />
              <span>Para jovens de 13-35 anos</span>
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

      {/* Photos Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Local do Retiro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={`/${i}.jpeg`}
                    alt={`Momento do Retiro ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6">
            Momentos especiais do nosso retiro - experiências que transformam vidas!
          </p>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Localização
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Casa na Baleia</h3>
                  <p className="text-muted-foreground">
                    Próximo à escola José Maria da Silveira onde já realizamos alguns retiros.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Endereço exato será informado em breve.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">O que oferecemos:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Acomodação</li>
                  <li>• Refeições completas (café, almoço, jantar)</li>
                  <li>• Atividades recreativas e espirituais</li>
                  <li>• Transporte (ida e volta)</li>
                  <li>• Material didático e de apoio para as palestras</li>
                </ul>
              </div>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.780120049794!2d-39.444456324116096!3d-3.152605396822774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c1a27cd222ff2d%3A0xe909b42e2426d531!2sAv.%20F%C3%A9lix%20Francisco%20Nascimento%2C%20324%20-%20Praia%20Da%20Baleia%2C%20Itapipoca%20-%20CE%2C%2062500-000!5e0!3m2!1spt-BR!2sbr!4v1768770539189!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Retiro - Praia da Baleia"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

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
                <li>• Idade mínima: 13 anos</li>
                <li>• Vagas limitadas - inscrição por ordem de chegada</li>
                <li>• Taxa de inscrição: R$ 230,00 (pagamento após confirmação)</li>
                <li>• Prazo para confirmação: até 10 de fevereiro</li>
                <li>• Dúvidas: entre em contato conosco</li>
              </ul>
            </div>
          </div>
          <RegistrationForm />
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
