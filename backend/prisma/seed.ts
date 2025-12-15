import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const categories = ["Music", "Education", "Sports", "Technology", "Art", "Business"];
const locations = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta"];

const bannerMap: Record<string, string> = {
  Music: "concert",
  Education: "seminar",
  Sports: "sports-event",
  Technology: "technology-conference",
  Art: "art-exhibition",
  Business: "business-meeting",
};

const CLOUDINARY_BASE =
  "https://res.cloudinary.com/" +
  process.env.CLOUDINARY_CLOUD_NAME +
  "/image/upload";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🔥 Seeding with banners...");

  const password = await bcrypt.hash("password123", 10);

  // Organizer
  const organizer = await prisma.user.upsert({
    where: { email: "eventorganizer@mail.com" },
    update: {},
    create: {
      email: "eventorganizer@mail.com",
      password,
      name: "Organizer Test",
      role: "ORGANIZER",
      referralCode: "ORG123",
    },
  });

  await prisma.organizerProfile.upsert({
    where: { userId: organizer.id },
    update: {},
    create: {
      userId: organizer.id,
      bio: "Top Organizer",
      rating: 4.7,
    },
  });

  // Customer
  await prisma.user.upsert({
    where: { email: "client@mail.com" },
    update: {},
    create: {
      email: "client@mail.com",
      password,
      name: "Customer Test",
      role: "CUSTOMER",
      points: 50000,
      referralCode: "CUS123",
    },
  });

  // EVENTS
  for (let i = 1; i <= 30; i++) {
    const category = randomFrom(categories);
    const isPaid = Math.random() > 0.3;
    const price = isPaid ? (Math.floor(Math.random() * 5) + 1) * 50000 : 0;

    const startDate = new Date(Date.now() + i * 86400000);
    const endDate = new Date(startDate.getTime() + 2 * 86400000);

    const bannerKeyword = bannerMap[category];
    const bannerUrl = `${CLOUDINARY_BASE}/${bannerKeyword}.jpg`;

    const event = await prisma.event.create({
      data: {
        title: `${category} Event ${i}`,
        description: `This is a ${category.toLowerCase()} event for EventHub.`,
        location: randomFrom(locations),
        category,
        startDate,
        endDate,
        organizerId: organizer.id,
        totalSeats: 100,
        availableSeats: 100,
        price,
        isPaid,
        bannerUrl, // 🔥 CLOUDINARY BANNER
      },
    });

    await prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Regular",
        price,
        stock: 100,
      },
    });
  }

  console.log("🎉 Seed completed with Cloudinary banners!");
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
