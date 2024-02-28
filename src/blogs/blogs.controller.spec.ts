import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import mongoose from 'mongoose';
import { BlogsController } from './blogs.controller';
import { correctBlogData } from './tests/test-manager';

describe('Blogs', () => {
  let app: INestApplication;
  // const blogsService = { getBlogs: () => request('/blogs') };
  const mongoURI = process.env.MONGO_NEST_URL as string;

  beforeAll(async () => {
    /* Connecting to the database. */
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    /* Closing database connection after each test. */
    await mongoose.connection.close();
  });
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(BlogsController)
      .useValue({
        s: 'q',
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });
  // it(`/POST CREATE BLOG`, async () => {
  //   const createdBlog: any = await request(app.getHttpServer())
  //     .post('/blogs')
  //     .send(correctBlogData);
  //   expect(JSON.parse(createdBlog.text)).toEqual({
  //     id: expect.any(String),
  //     name: correctBlogData.name,
  //     description: correctBlogData.description,
  //     websiteUrl: correctBlogData.websiteUrl,
  //     isMembership: false,
  //     createdAt: expect.any(String),
  //     // _id: expect.any(String),
  //     // __v: expect.any(String),
  //   });
  // });
  //
  // it(`/GET catsnmmmmm`, async () => {
  //   const createdBlo2g = await request(app.getHttpServer()).get('/blogs');
  //   expect(JSON.parse(createdBlo2g.text)).toBe(['s']);
  //   // /.expect({
  //   // name: 'name',
  //   // description: 'description',
  //   // websiteUrl: 'https://TXOxcSX82DRX8sXEHAWm.ZFTe4',
  //   // isMembership: true,
  //   // });
  // });
  it(`/DELETE`, async () => {
    const createdBlo2g = await request(app.getHttpServer())
      .delete('/testing/all-data')
      .expect(204);

    // /.expect({
    // name: 'name',
    // description: 'description',
    // websiteUrl: 'https://TXOxcSX82DRX8sXEHAWm.ZFTe4',
    // isMembership: true,
    // });
  });
  afterAll(async () => {
    await app.close();
  });
});
