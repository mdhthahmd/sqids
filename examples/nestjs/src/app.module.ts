import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { createObserveModule } from "@nestjs/observe";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SqidsController } from "./sqids.controller";
import { SqidsService } from "./sqids.service";
import { validateEnvironment } from "./environment";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: "B2M!^SHZ%6NRwr9v",
      appSecret: "%yBrc6&SUtaGWQ%mh5T^Zr%eb^MIamv!M3TeY!!WXnWB4",
      serviceId: "sqids-api",
    }),
  ],
  controllers: [AppController, SqidsController],
  providers: [AppService, SqidsService],
})
export class AppModule {}
