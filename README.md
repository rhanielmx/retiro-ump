# Retiro de Jovens UMP

Landing page para o Retiro de Jovens da Mocidade de Jovens (UMP) com sistema de inscrições online.

## 🎯 Sobre o Projeto

Este projeto é uma landing page completa para divulgar e gerenciar inscrições do Retiro de Jovens UMP. O retiro tem como tema **"Glorificando a Deus nos relacionamentos"** baseado em 1 Coríntios 10:31.

### ✨ Funcionalidades

- **Página inicial responsiva** com informações do retiro
- **Galeria de fotos** do retiro anterior
- **Mapa interativo** da localização (Praia da Baleia - CE)
- **Formulário de inscrição** completo com validação
- **Integração com banco de dados** PostgreSQL via Prisma ORM
- **Design moderno** com cores da igreja e UMP
- **Totalmente responsivo** para dispositivos móveis

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI modernos
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas

### Backend
- **Next.js API Routes** - API REST
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados (Neon)

### Infraestrutura
- **Vercel** - Deploy e hospedagem
- **Git** - Controle de versão

## 🎨 Paleta de Cores

### Igreja
- Preto: `#000000`
- Branco: `#FFFFFF`
- Verde principal: `#146844`
- Verde escuro: `#05321f`
- Bege: `#ce9768`
- Cinza: `#d9d9d9`

### Mocidade de Jovens (UMP)
- Branco: `#FFFFFF`
- Azul: `#0033A0`
- Vermelho: `#FF0000`

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou Neon para produção)
- Git

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/retiro-ump.git
cd retiro-ump
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados:**

   Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/retiro_ump"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

4. **Execute as migrações do Prisma:**
```bash
npx prisma db push
```

5. **Execute o projeto:**
```bash
npm run dev
```

6. **Acesse:** `http://localhost:3000`

## 📁 Estrutura do Projeto

```
retiro-ump/
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   └── seed.ts            # Dados iniciais
├── public/
│   ├── 1.jpeg a 6.jpeg    # Fotos da galeria
│   └── card_retiro.jpeg   # Card do retiro
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── register/
│   │   │       └── route.ts    # API de inscrição
│   │   ├── globals.css         # Estilos globais
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página inicial
│   ├── components/
│   │   ├── ui/                 # Componentes Shadcn/ui
│   │   └── registration-form.tsx # Formulário de inscrição
│   └── lib/
│       ├── prisma.ts           # Cliente Prisma
│       ├── env.ts             # Configurações de ambiente
│       └── utils.ts           # Utilitários
├── components.json             # Configuração Shadcn/ui
├── package.json               # Dependências
├── tailwind.config.ts         # Configuração Tailwind
└── next.config.ts             # Configuração Next.js
```

## 🗄️ Banco de Dados

### Modelos Principais

#### Participante (Participant)
- Dados pessoais (nome, email, telefone, idade)
- Informações de emergência
- Controle de inscrição e pagamento

#### Pagamento (Payment)
- Vinculação com participante
- Controle de pagamentos
- Status e comprovantes

#### Evento (Event)
- Informações do retiro
- Capacidade e preços

## 📋 Funcionalidades do Sistema

### ✅ Implementadas
- [x] Landing page responsiva
- [x] Galeria de fotos
- [x] Mapa interativo
- [x] Formulário de inscrição
- [x] Validação de dados
- [x] Integração com banco
- [x] Design system consistente

### 🔄 Próximas Implementações
- [ ] Sistema de pagamentos
- [ ] Painel administrativo
- [ ] Confirmação por email
- [ ] Relatórios de inscrições

## 🎨 Design System

### Componentes Principais
- **Hero Section** - Apresentação do retiro
- **About Section** - Informações detalhadas
- **Photo Gallery** - Galeria de fotos
- **Location Section** - Mapa e endereço
- **Registration Form** - Formulário de inscrição
- **Footer** - Informações de contato

### Responsividade
- **Mobile-first** approach
- Breakpoints otimizados
- Imagens responsivas
- Tipografia escalável

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório** no Vercel
2. **Configure as variáveis de ambiente:**
   - `DATABASE_URL`
   - `NEXT_PUBLIC_BASE_URL`
3. **O projeto já inclui configuração otimizada** para Vercel:
   - Build command: `prisma generate && next build`
   - Postinstall hook para gerar o cliente Prisma
   - Configuração de funções serverless
4. **Deploy automático** a cada push

### Outras Opções

O projeto pode ser facilmente deployado em:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🤝 Como Contribuir

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Padrões de Código
- Use TypeScript para tipagem
- Siga as convenções do Next.js
- Mantenha commits descritivos
- Teste suas mudanças

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **Igreja** pela oportunidade de servir
- **Mocidade de Jovens UMP** pela organização
- **Comunidade Next.js** pelos recursos
- **Shadcn/ui** pelos componentes incríveis

## 📞 Contato

Para dúvidas ou sugestões:
- **Email:** contato@ump.com.br
- **Instagram:** @ump_jovens
- **Telefone:** (00) 00000-0000

---

**Desenvolvido com ❤️ para a Mocidade de Jovens UMP**
