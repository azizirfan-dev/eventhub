import request from "supertest";
import app from "../app";

describe("Event Discovery Tests", () => {

  it("should return events with pagination format", async () => {
    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.events)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
  });
});
