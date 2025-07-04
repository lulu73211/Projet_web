import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        firstName: 'Alice',
        lastName: 'Gogole',
        email: 'alice@email.com',
        password:
          '$2b$10$C4SeSzM1i9lWDRbOsB1Q/uEQWSMczylyn2M3.KXXl5OjnsMEC63Sy',
        username: 'Alice User',
      },
      {
        firstName: 'Bob',
        lastName: 'Bricolo',
        email: 'bob@email.com',
        password:
          '$2b$10$C4SeSzM1i9lWDRbOsB1Q/uEQWSMczylyn2M3.KXXl5OjnsMEC63Sy',
        username: 'BOB User',
      },
      {
        firstName: 'Charlie',
        lastName: 'Proute',
        email: 'charlie@email.com',
        password:
          '$2b$10$C4SeSzM1i9lWDRbOsB1Q/uEQWSMczylyn2M3.KXXl5OjnsMEC63Sy',
        username: 'CHarlie User',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
