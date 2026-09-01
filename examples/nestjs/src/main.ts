import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule, ObserveInstrument } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  const config = app.get(ConfigService);
  await app.listen(config.getOrThrow<number>("HTTP_PORT"));
}
await bootstrap();
