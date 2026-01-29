export interface LocationInfo {
  name: string;
  description: string;
  address: string;
  features: string[];
  mapUrl: string;
  mapTitle: string;
}

export const locationData: LocationInfo = {
  name: "Casa na Baleia",
  description: "Próximo à escola José Maria da Silveira onde já realizamos alguns retiros.",
  address: "Endereço exato será informado em breve.",
  features: [
    "Acomodação",
    "Refeições completas (café, almoço, jantar)",
    "Atividades recreativas e espirituais",
    "Transporte (ida e volta)",
    "Material didático e de apoio para as palestras"
  ],
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.780120049794!2d-39.444456324116096!3d-3.152605396822774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c1a27cd222ff2d%3A0xe909b42e2426d531!2sAv.%20F%C3%A9lix%20Francisco%20Nascimento%2C%20324%20-%20Praia%20Da%20Baleia%2C%20Itapipoca%20-%20CE%2C%2062500-000!5e0!3m2!1spt-BR!2sbr!4v1768770539189!5m2!1spt-BR!2sbr",
  mapTitle: "Localização do Retiro - Praia da Baleia"
};