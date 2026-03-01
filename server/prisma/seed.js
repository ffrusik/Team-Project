import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';
dotenv.config();

// Create a connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {

  // Create rooms
  await prisma.room.createMany({
    data: [
      {
        roomNumber: 101,
        description: "Single room with garden view",
        price: 80,
        capacity: 1,
      },
      {
        roomNumber: 102,
        description: "Double room with sea view",
        price: 120,
        capacity: 2,
      },
      {
        roomNumber: 201,
        description: "Luxury suite",
        price: 250,
        capacity: 4,
      }
    ],
    skipDuplicates: true
  })

  // Create extras (to do)

  console.log("Database seeded successfully")

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;

  const hashedPassword = await bcrypt.hash(adminPasswordPlain, 10);

  await prisma.guest.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      guestName: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      phoneNumber: "+353 85 123 4567",
      eirCode: "F92 7777",
      role: "ADMIN",
      // town, county optional
    },
  });

  console.log(`Admin user created/updated: ${adminEmail} / password: ${adminPasswordPlain}`);
  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })