import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Seeding start...");

  const password = await bcrypt.hash("password123", 10);

  // Organizer
  const organizer = await prisma.user.create({
    data: {
      email: "eventorganizer@mail.com",
      password,
      name: "Organizer Test",
      role: "ORGANIZER",
      referralCode: "ORG123"
    }
  });

  // Organizer Profile
  await prisma.organizerProfile.create({
    data: {
      userId: organizer.id,
      bio: "Top Organizer",
      rating: 5
    }
  });

  // Customer
  const customer = await prisma.user.create({
    data: {
      email: "client@mail.com",
      password,
      name: "Customer Test",
      role: "CUSTOMER",
      points: 50000,
      referralCode: "CUS123"
    }
  });

  // Event
  const event = await prisma.event.create({
    data: {
      title: "Concert Test Event",
      description: "Demo seeded event",
      location: "Jakarta",
      startDate: new Date(Date.now() + 86400000), // besok
      endDate: new Date(Date.now() + 172800000), // lusa
      organizerId: organizer.id,
      category: "Music",
      totalSeats: 50,
      availableSeats: 50,
      price: 100000
    }
  });

  // Ticket Type
  const ticket = await prisma.ticketType.create({
    data: {
      eventId: event.id,
      name: "Regular",
      price: 100000,
      stock: 50
    }
  });

  // Promo (Event Specific)
  const promo = await prisma.promo.create({
    data: {
      code: "EVENT50",
      discount: 50,
      isPercent: true,
      isGlobal: false,
      eventId: event.id,
      organizerId: organizer.id,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000),
      usageLimit: 100
    }
  });

  // Promo Global
  const globalPromo = await prisma.promo.create({
    data: {
      code: "GLOBAL10K",
      discount: 10000,
      isPercent: false,
      isGlobal: true,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000),
      usageLimit: null
    }
  });

  console.log("🎉 Seed Completed!");
  console.log({
    organizer,
    customer,
    event,
    ticket,
    promo,
    globalPromo,
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
