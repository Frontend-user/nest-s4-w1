import { TestManager } from './test-manager.spec';
import mongoose from 'mongoose';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { BlogsController } from '../blogs.controller';

describe('Blogs', () => {
  let app: INestApplication;
  // eslint-disable-next-line prefer-const
  let testManager: TestManager;

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
    testManager = new TestManager(app);
  });
  const mongoURI = process.env.MONGO_NEST_URL as string;
  beforeAll(async () => {
    await mongoose.connect(mongoURI);
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterAll(async () => {
    await app.close();
  });

  it('TEST DELETE ALL', async () => {
    await testManager.deleteBlog();
  });
  it(`CREATE BLOG`, async () => {
    await testManager.createBlog();
  });

  it(`GET BLOG`, async () => {
    await testManager.getBlog();
  });

  it(`CREATE POST BY BLOG ID`, async () => {
    await testManager.craetePostByBlogId();
  });
  it(`Get POSTs BY BLOG ID`, async () => {
    await testManager.getPostsByBlogId();
  });
  it(`GET POST`, async () => {
    await testManager.getPost();
  });

  it(`GET POSTs`, async () => {
    await testManager.getPosts();
  });
  // it(`DELETE ALL DATA`, async () => {
  //   await TestManager.deleteBlog();
  // });
});
