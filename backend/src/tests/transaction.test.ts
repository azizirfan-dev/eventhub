import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";

let token: string;
let ticketTypeId: string;

beforeAll(async () => {
  // 1️⃣ Register user dulu
  const email = `test${Date.now()}@mail.com`;

  await request(app).post("/auth/register").send({
    name: "TestUser",
    email,
    password: "password123",
    role: "ORGANIZER"
  });

  // 2️⃣ Login untuk dapat token
  const login = await request(app).post("/auth/login").send({
    email,
    password: "password123",
  });

  token = login.body.data.token;
  expect(token).toBeDefined();

  // 3️⃣ Create event
  const event = await request(app)
    .post("/events")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Test Event",
      description: "desc",
      category: "Music",
      location: "Jakarta",
      startDate: new Date(),
      endDate: new Date(),
      totalSeats: 100,
      price: 50000,
      isPaid: true,
    });

  const eventId = event.body.data.id;
  expect(eventId).toBeDefined();

  // 4️⃣ Create ticket type
  const ticket = await request(app)
    .post(`/events/${eventId}/tickets`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "VIP",
      price: 50000,
      stock: 10,
    });

  ticketTypeId = ticket.body.data.id;
  expect(ticketTypeId).toBeDefined();
});

describe("Transaction Tests", () => {
  it("should lock stock when creating a transaction", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ ticketTypeId, quantity: 1 }],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transactionId).toBeDefined();
    expect(res.body.data.status).toBe("WAITING_PAYMENT");
  });
});

// 5️⃣ Penting untuk nutup prisma biar Jest clean exit
afterAll(async () => {
  await prisma.$disconnect();
});
