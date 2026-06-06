import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findFirst();
  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: 1,
        name: "Budi Kondektur",
        email: "budi@kai.id",
        password: "hashedpassword",
        role: "CONDUCTOR",
      },
    });
    console.log("Seeded default user: Budi Kondektur (ID: 1)");
  } else {
    console.log("User already exists, skipping seed.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
