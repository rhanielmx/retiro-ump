import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { PaymentType, PaymentStatus } from '../src/generated/prisma/enums';

async function main() {
  // Clear existing data
  await prisma.payment.deleteMany({});
  await prisma.participant.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await bcrypt.hash('ump2026@ipb269', 10);
  const adminUser = await prisma.user.create({
    data: {
      username: 'ump1itapipoca',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', adminUser.username);

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

  // Create 10 random participants with different payment types
  const participantsData = [
    {
      name: 'João Silva',
      phone: '(85) 99999-0001',
      age: 28,
      church: 'Igreja Central',
      emergencyContact: 'Maria Silva',
      emergencyPhone: '(85) 99999-1001',
      foodRestrictions: null,
      medications: null,
      observations: null,
      confirmed: true,
      paymentType: PaymentType.FULL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 0,
      totalAmount: 230.00,
      paidAmount: 230.00,
      status: PaymentStatus.PAID,
    },
    {
      name: 'Ana Santos',
      phone: '(85) 99999-0002',
      age: 32,
      church: 'Igreja Central',
      emergencyContact: 'Carlos Santos',
      emergencyPhone: '(85) 99999-1002',
      foodRestrictions: 'Alergia a amendoim',
      medications: 'Anti-histamínico',
      observations: null,
      confirmed: true,
      paymentType: PaymentType.FULL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 0,
      totalAmount: 230.00,
      paidAmount: 230.00,
      status: PaymentStatus.PAID,
    },
    {
      name: 'Pedro Oliveira',
      phone: '(85) 99999-0003',
      age: 25,
      church: 'Igreja do Centro',
      emergencyContact: 'Sofia Oliveira',
      emergencyPhone: '(85) 99999-1003',
      foodRestrictions: null,
      medications: null,
      observations: 'Vegetariano',
      confirmed: false,
      paymentType: PaymentType.FULL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 0,
      totalAmount: 230.00,
      paidAmount: 0,
      status: PaymentStatus.PENDING,
    },
    {
      name: 'Mariana Costa',
      phone: '(85) 99999-0004',
      age: 30,
      church: 'Igreja Central',
      emergencyContact: 'Roberto Costa',
      emergencyPhone: '(85) 99999-1004',
      foodRestrictions: null,
      medications: 'Anticoncepcional',
      observations: null,
      confirmed: true,
      paymentType: PaymentType.FULL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 0,
      totalAmount: 230.00,
      paidAmount: 100.00,
      status: PaymentStatus.PARTIAL,
    },
    {
      name: 'Lucas Pereira',
      phone: '(85) 99999-0005',
      age: 27,
      church: 'Igreja Central',
      emergencyContact: 'Fernanda Pereira',
      emergencyPhone: '(85) 99999-1005',
      foodRestrictions: 'Intolerante à lactose',
      medications: 'Lactase',
      observations: null,
      confirmed: true,
      paymentType: PaymentType.DAILY,
      fullPrice: null,
      dailyRate: 50.00,
      daysStayed: 2,
      discount: 0,
      totalAmount: 100.00,
      paidAmount: 100.00,
      status: PaymentStatus.PAID,
    },
    {
      name: 'Carla Rodrigues',
      phone: '(85) 99999-0006',
      age: 35,
      church: 'Igreja do Sul',
      emergencyContact: 'Miguel Rodrigues',
      emergencyPhone: '(85) 99999-1006',
      foodRestrictions: null,
      medications: 'Analgésico',
      observations: 'Precisa de cadeira de rodas',
      confirmed: false,
      paymentType: PaymentType.DAILY,
      fullPrice: null,
      dailyRate: 50.00,
      daysStayed: 3,
      discount: 0,
      totalAmount: 150.00,
      paidAmount: 0,
      status: PaymentStatus.PENDING,
    },
    {
      name: 'Rafael Almeida',
      phone: '(85) 99999-0007',
      age: 24,
      church: 'Igreja Central',
      emergencyContact: 'Beatriz Almeida',
      emergencyPhone: '(85) 99999-1007',
      foodRestrictions: null,
      medications: null,
      observations: null,
      confirmed: true,
      paymentType: PaymentType.PARTIAL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 30.00,
      totalAmount: 200.00,
      paidAmount: 150.00,
      status: PaymentStatus.PARTIAL,
    },
    {
      name: 'Juliana Ferreira',
      phone: '(85) 99999-0008',
      age: 29,
      church: 'Igreja Central',
      emergencyContact: 'Antônio Ferreira',
      emergencyPhone: '(85) 99999-1008',
      foodRestrictions: 'Vegana',
      medications: null,
      observations: null,
      confirmed: true,
      paymentType: PaymentType.FULL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 50.00,
      totalAmount: 180.00,
      paidAmount: 180.00,
      status: PaymentStatus.PAID,
    },
    {
      name: 'Gabriel Lima',
      phone: '(85) 99999-0009',
      age: 26,
      church: 'Igreja Central',
      emergencyContact: 'Patrícia Lima',
      emergencyPhone: '(85) 99999-1009',
      foodRestrictions: null,
      medications: 'Vitamina D',
      observations: null,
      confirmed: false,
      paymentType: PaymentType.DAILY,
      fullPrice: null,
      dailyRate: 50.00,
      daysStayed: 1,
      discount: 0,
      totalAmount: 50.00,
      paidAmount: 0,
      status: PaymentStatus.PENDING,
    },
    {
      name: 'Amanda Souza',
      phone: '(85) 99999-0010',
      age: 31,
      church: 'Igreja do Norte',
      emergencyContact: 'Ricardo Souza',
      emergencyPhone: '(85) 99999-1010',
      foodRestrictions: null,
      medications: 'Antialérgico',
      observations: 'Alergia a camarão',
      confirmed: true,
      paymentType: PaymentType.FULL,
      fullPrice: 230.00,
      dailyRate: null,
      daysStayed: null,
      discount: 0,
      totalAmount: 230.00,
      paidAmount: 230.00,
      status: PaymentStatus.PAID,
    },
  ];

  for (const data of participantsData) {
    const participant = await prisma.participant.create({
      data: {
        ...data,
        paidAt: data.status === 'PAID' ? new Date() : null,
      },
    });

    console.log('Participant created:', participant.name);

    // Create payment records based on payment type and status
    if (data.status === 'PAID' && data.paidAmount > 0) {
      const payment = await prisma.payment.create({
        data: {
          participantId: participant.id,
          amount: data.paidAmount,
          method: 'PIX',
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          confirmedAt: new Date(),
          receipt: null,
          notes: 'Pagamento total',
        },
      });
      console.log('Payment created for:', participant.name);
    } else if (data.status === 'PARTIAL' && data.paidAmount > 0) {
      const payment = await prisma.payment.create({
        data: {
          participantId: participant.id,
          amount: data.paidAmount,
          method: 'DINHEIRO',
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          confirmedAt: new Date(),
          receipt: null,
          notes: 'Pagamento parcial',
        },
      });
      console.log('Partial payment created for:', participant.name);
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
