import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@email.com" },
      { name: "Bob", email: "bob@email.com" },
      { name: "Charlie", email: "charlie@email.com" },
    ],
    skipDuplicates: true, // Évite les erreurs si tu relances le seed
  })
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
