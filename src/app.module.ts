import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { Blog, BlogSchema } from './blogs/domain/blogs-schema';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';
import { BlogsRepository } from './blogs/blogs.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // BlogsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forRoot(process.env.MONGO_NEST_URL as string),
  ],
  controllers: [AppController, BlogsController],
  providers: [AppService, BlogsService, BlogsRepository],
})
export class AppModule {}
