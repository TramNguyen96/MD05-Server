import { Module } from "@nestjs/common";
import { BoxchatGateWay } from "./boxchat.gateway";


@Module({
    providers: [BoxchatGateWay]
})
export class GatewayModule {}