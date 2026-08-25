import { Module } from "@nestjs/common";
import { SqidsController } from "./sqids.controller";
import { SqidsService } from "./sqids.service";

@Module({
	controllers: [SqidsController],
	providers: [SqidsService],
})
export class AppModule {}
