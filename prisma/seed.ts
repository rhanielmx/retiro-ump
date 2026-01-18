import { prisma } from '../src/lib/prisma';

async function main() {
  // Create the event
  const event = await prisma.event.create({
    data: {
      name: 'Retiro de Carnaval 2026',
      date: new Date('2026-02-14'),
      location: 'Praia da Baleia',
      description: 'Retiro espiritual durante o Carnaval',
      maxParticipants: 50,
      price: 230.00,
    },
  });

  console.log('Event created:', event);

  // Create 10 random participants
  const participantsData = [
    {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '(85) 99999-0001',
      age: 28,
      church: 'Igreja Central',
      emergencyContact: 'Maria Silva',
      emergencyPhone: '(85) 99999-1001',
      foodRestrictions: null,
      observations: null,
      confirmed: true,
      paid: true,
      paidAmount: 230.00,
    },
    {
      name: 'Ana Santos',
      email: 'ana.santos@example.com',
      phone: '(85) 99999-0002',
      age: 32,
      church: 'Igreja Central',
      emergencyContact: 'Carlos Santos',
      emergencyPhone: '(85) 99999-1002',
      foodRestrictions: 'Alergia a amendoim',
      observations: null,
      confirmed: true,
      paid: true,
      paidAmount: 230.00,
    },
    {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@example.com',
      phone: '(85) 99999-0003',
      age: 25,
      church: 'Igreja do Centro',
      emergencyContact: 'Sofia Oliveira',
      emergencyPhone: '(85) 99999-1003',
      foodRestrictions: null,
      observations: 'Vegetariano',
      confirmed: false,
      paid: false,
      paidAmount: 0,
    },
    {
      name: 'Mariana Costa',
      email: 'mariana.costa@example.com',
      phone: '(85) 99999-0004',
      age: 30,
      church: 'Igreja Central',
      emergencyContact: 'Roberto Costa',
      emergencyPhone: '(85) 99999-1004',
      foodRestrictions: null,
      observations: null,
      confirmed: true,
      paid: true,
      paidAmount: 230.00,
    },
    {
      name: 'Lucas Pereira',
      email: 'lucas.pereira@example.com',
      phone: '(85) 99999-0005',
      age: 27,
      church: 'Igreja Central',
      emergencyContact: 'Fernanda Pereira',
      emergencyPhone: '(85) 99999-1005',
      foodRestrictions: 'Intolerante à lactose',
      observations: null,
      confirmed: true,
      paid: false,
      paidAmount: 0,
    },
    {
      name: 'Carla Rodrigues',
      email: 'carla.rodrigues@example.com',
      phone: '(85) 99999-0006',
      age: 35,
      church: 'Igreja do Sul',
      emergencyContact: 'Miguel Rodrigues',
      emergencyPhone: '(85) 99999-1006',
      foodRestrictions: null,
      observations: 'Precisa de cadeira de rodas',
      confirmed: false,
      paid: false,
      paidAmount: 0,
    },
    {
      name: 'Rafael Almeida',
      email: 'rafael.almeida@example.com',
      phone: '(85) 99999-0007',
      age: 24,
      church: 'Igreja Central',
      emergencyContact: 'Beatriz Almeida',
      emergencyPhone: '(85) 99999-1007',
      foodRestrictions: null,
      observations: null,
      confirmed: true,
      paid: true,
      paidAmount: 230.00,
    },
    {
      name: 'Juliana Ferreira',
      email: 'juliana.ferreira@example.com',
      phone: '(85) 99999-0008',
      age: 29,
      church: 'Igreja Central',
      emergencyContact: 'Antônio Ferreira',
      emergencyPhone: '(85) 99999-1008',
      foodRestrictions: 'Vegana',
      observations: null,
      confirmed: true,
      paid: true,
      paidAmount: 230.00,
    },
    {
      name: 'Gabriel Lima',
      email: 'gabriel.lima@example.com',
      phone: '(85) 99999-0009',
      age: 26,
      church: 'Igreja Central',
      emergencyContact: 'Patrícia Lima',
      emergencyPhone: '(85) 99999-1009',
      foodRestrictions: null,
      observations: null,
      confirmed: false,
      paid: false,
      paidAmount: 0,
    },
    {
      name: 'Amanda Souza',
      email: 'amanda.souza@example.com',
      phone: '(85) 99999-0010',
      age: 31,
      church: 'Igreja do Norte',
      emergencyContact: 'Ricardo Souza',
      emergencyPhone: '(85) 99999-1010',
      foodRestrictions: null,
      observations: 'Alergia a camarão',
      confirmed: true,
      paid: true,
      paidAmount: 230.00,
    },
  ];

  for (const data of participantsData) {
    const participant = await prisma.participant.create({
      data: {
        ...data,
        paidAt: data.paid ? new Date() : null,
      },
    });

    console.log('Participant created:', participant.name);

    // Create payment if paid
    if (data.paid) {
      const payment = await prisma.payment.create({
        data: {
          participantId: participant.id,
          amount: 230.00,
          method: 'PIX', // Random methods: PIX, Cartão, Dinheiro
          status: 'confirmed',
          paidAt: new Date(),
          confirmedAt: new Date(),
          receipt: null,
          notes: 'Pagamento confirmado',
        },
      });

      console.log('Payment created for:', participant.name);
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
