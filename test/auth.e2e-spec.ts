import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("handles a signup request", async () => {
    const email = "test@mail.com";

    const { body } = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: "test@mail.com", password: "1234" })
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });

  it("signup as a new user then get the currently logged in user", async () => {
    const email = "test@mail.com";

    const res = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email, password: "1234" })
      .expect(201);

    const cookie = res.get("Set-Cookie");

    const { body } = await request(app.getHttpServer())
      .get("/auth/profile")
      .set("Cookie", cookie)
      .expect(200);

    expect(body.id).toBeDefined();
    expect(body.email).toEqual(email);
  });
});
