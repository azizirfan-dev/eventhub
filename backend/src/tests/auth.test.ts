import request from "supertest";
import app from "../app";

describe("Auth Tests", () => {

  const email = `test${Date.now()}@mail.com`;

  it("should register successfully", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Test",
      email,
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.token).toBeDefined();
  });

  it("should login successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email,
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.token).toBeDefined();
  });
});
