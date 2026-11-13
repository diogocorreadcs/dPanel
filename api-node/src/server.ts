import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const app = Fastify({ logger: true });
const prisma = new PrismaClient();
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
});

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

app.get('/api/health', async () => {
  return { status: 'online', service: 'dPanel API' };
});

app.get('/api/bounties', async () => {
  const bounties = await prisma.bountyActive.findMany({
    orderBy: { total_amount: 'desc' },
  });

  const contributors = await prisma.bountyContributor.groupBy({
    by: ['target_uuid'],
    _count: { contributor_uuid: true },
  });

  const contribMap = new Map(
    contributors.map((c) => [c.target_uuid, c._count.contributor_uuid])
  );

  return bounties.map((b) => ({
    ...b,
    contributors_count: contribMap.get(b.target_uuid) || 0,
  }));
});

app.get('/api/bounties/top-hunters', async () => {
  return prisma.bountyStats.findMany({
    orderBy: { total_earned: 'desc' },
    take: 20,
  });
});

app.delete<{ Params: { uuid: string } }>('/api/bounties/:uuid', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return reply.status(401).send({ error: 'Não autorizado.' });
  }

  const { uuid } = request.params;

  await prisma.$transaction([
    prisma.bountyContributor.deleteMany({ where: { target_uuid: uuid } }),
    prisma.bountyActive.delete({ where: { target_uuid: uuid } }),
  ]);

  return reply.send({ message: 'Recompensa removida com sucesso.' });
});

app.get('/api/clans', async () => {
  const clans = await prisma.clan.findMany({
    orderBy: { activity_score: 'desc' },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  return clans.map((c) => ({
    name: c.name,
    tag: c.tag,
    leader_uuid: c.leader_uuid,
    activity_score: c.activity_score,
    members_count: c._count.members,
    updated_at: c.updated_at,
  }));
});

app.get<{ Params: { name: string } }>('/api/clans/:name', async (request, reply) => {
  const { name } = request.params;

  const clan = await prisma.clan.findUnique({
    where: { name },
    include: {
      members: true,
      logs: {
        orderBy: { timestamp: 'desc' },
        take: 50,
      },
    },
  });

  if (!clan) {
    return reply.status(404).send({ error: 'Clã não encontrado.' });
  }

  return clan;
});

app.post('/api/sync/clan', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
    return reply.status(401).send({ error: 'Não autorizado.' });
  }

  const body = request.body as {
    name: string;
    tag: string;
    leader_uuid: string;
    activity_score: number;
    members: string[];
    logs: { timestamp: number; action: string; player_uuid: string; actor_uuid?: string | null }[];
  };

  await prisma.$transaction([
    prisma.clan.upsert({
      where: { name: body.name },
      update: {
        tag: body.tag,
        leader_uuid: body.leader_uuid,
        activity_score: BigInt(body.activity_score),
      },
      create: {
        name: body.name,
        tag: body.tag,
        leader_uuid: body.leader_uuid,
        activity_score: BigInt(body.activity_score),
      },
    }),
    prisma.clanMember.deleteMany({ where: { clan_name: body.name } }),
    prisma.clanMember.createMany({
      data: body.members.map((uuid) => ({
        player_uuid: uuid,
        clan_name: body.name,
      })),
    }),
    prisma.clanLog.deleteMany({ where: { clan_name: body.name } }),
    prisma.clanLog.createMany({
      data: body.logs.map((log) => ({
        clan_name: body.name,
        timestamp: BigInt(log.timestamp),
        action: log.action,
        player_uuid: log.player_uuid,
        actor_uuid: log.actor_uuid || null,
      })),
    }),
  ]);

  return reply.send({ status: 'synced' });
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`dPanel API rodando em http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();