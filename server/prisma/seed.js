import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  // Create rooms
  await prisma.room.createMany({
    data: [
      {
        roomNumber: 101,
        description: "Single room with garden view",
        price: 80,
        capacity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 102,
        description: "Double room with sea view",
        price: 120,
        capacity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roomNumber: 201,
        description: "Luxury suite",
        price: 250,
        capacity: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
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