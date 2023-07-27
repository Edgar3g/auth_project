import {
  Injectable,
  INestApplication,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    const exitHandler = async () => {
      try {
        await app.close();
        await this.$disconnect();
      } catch (err) {
        process.exit(1);
      }
    };

    // Enable graceful shutdown when the Node.js process receives a signal to terminate
    process.on('SIGINT', exitHandler);
    process.on('SIGTERM', exitHandler);
  }
}
