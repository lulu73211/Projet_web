import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'Alice',
        email: 'alice@email.com',
        password: 'test',
        username: 'Alice User',
      },
      {
        fullName: 'Bob',
        email: 'bob@email.com',
        password: 'test',
        username: 'BOB User',
      },
      {
        fullName: 'Charlie',
        email: 'charlie@email.com',
        password: 'test',
        username: 'CHarlie User',
      },
    ],
    skipDuplicates: true, // Évite les erreurs si tu relances le seed
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
