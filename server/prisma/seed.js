import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

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

  console.log("Database seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })