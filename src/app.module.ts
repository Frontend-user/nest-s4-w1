import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    BlogsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_NEST_URL as string),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
