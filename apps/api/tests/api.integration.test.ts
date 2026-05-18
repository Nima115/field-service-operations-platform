import request from "supertest";
import { describe, expect, it } from "@jest/globals";
import { createApp } from "../src/app.js";

describe("api", () => {
  it("returns health status", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", service: "serviceflow-api" });
  });
});
