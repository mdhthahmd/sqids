import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer()).get("/").expect(200).expect("Hello World!");
  });

  it("round-trips numbers through the Sqids API", async () => {
    const encoded = await request(app.getHttpServer())
      .post("/sqids/number/encode")
      .send({ numbers: [1, 2, 3] })
      .expect(200);

    expect(encoded.body.id).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .get(`/sqids/number/decode/${encoded.body.id}`)
      .expect(200)
      .expect({ numbers: [1, 2, 3] });
  });

  it("round-trips uint64 BigInts as JSON strings", async () => {
    const numbers = ["0", "9007199254740992", "18446744073709551615"];
    const encoded = await request(app.getHttpServer())
      .post("/sqids/bigint/encode")
      .send({ numbers })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/sqids/bigint/decode/${encoded.body.id}`)
      .expect(200)
      .expect({ numbers });
  });

  it("rejects malformed number requests", async () => {
    const response = await request(app.getHttpServer())
      .post("/sqids/number/encode")
      .send({ numbers: [1, "2", 3] })
      .expect(400);

    expect(response.body.message).toBe("Numbers must contain only numeric values");
  });

  it("rejects out-of-range BigInts", () => {
    return request(app.getHttpServer())
      .post("/sqids/bigint/encode")
      .send({ numbers: ["18446744073709551616"] })
      .expect(400);
  });

  it("rejects non-decimal BigInt strings", async () => {
    const response = await request(app.getHttpServer())
      .post("/sqids/bigint/encode")
      .send({ numbers: ["12.5"] })
      .expect(400);

    expect(response.body.message).toBe("Numbers must contain only decimal strings");
  });

  afterEach(async () => {
    await app.close();
  });
});
