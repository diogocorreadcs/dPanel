import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Inserir Procurados (dBounty)
  await prisma.bountyActive.upsert({
    where: { target_uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5' },
    update: {},
    create: {
      target_uuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5',
      target_name: 'Notch',
      total_amount: 150000,
      created_at: BigInt(Date.now()),
    },
  });

  await prisma.bountyActive.upsert({
    where: { target_uuid: '8667ba71-b85a-4004-af54-457a9734eed7' },
    update: {},
    create: {
      target_uuid: '8667ba71-b85a-4004-af54-457a9734eed7',
      target_name: 'Steve',
      total_amount: 45000,
      created_at: BigInt(Date.now() - 3600000),
    },
  });

  // 2. Inserir Top Caçadores (dBounty)
  await prisma.bountyStats.upsert({
    where: { player_uuid: 'ec561538-f3fd-461d-aff5-086b22154bce' },
    update: {},
    create: {
      player_uuid: 'ec561538-f3fd-461d-aff5-086b22154bce',
      player_name: 'Alex',
      bounties_claimed: 18,
      total_earned: 420000,
    },
  });

  // 3. Inserir Clãs (dClanSystem)
  await prisma.clan.upsert({
    where: { name: 'Spartans' },
    update: {},
    create: {
      name: 'Spartans',
      tag: 'SPT',
      leader_uuid: 'ec561538-f3fd-461d-aff5-086b22154bce',
      activity_score: BigInt(1250),
      members: {
        create: [
          { player_uuid: 'ec561538-f3fd-461d-aff5-086b22154bce' },
          { player_uuid: '8667ba71-b85a-4004-af54-457a9734eed7' },
        ],
      },
    },
  });

  console.log('✅ Dados de teste inseridos com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());