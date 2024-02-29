import request from 'supertest';
import { INestApplication } from '@nestjs/common';

export const correctBlogData = {
  name: 'name',
  description: 'description',
  websiteUrl: 'https://TXOxcSX82Olmsdf8sXEHAWm.ZFTe4',
};

export const correctPostDataCREATEPOSTINBLOGS = {
  title: 'string',
  shortDescription: 'string',
  content: 'string',
};

export class TestManager {
  private blog_1: any;
  private blog_1_id: string;
  private post_1: any;
  private post_1_id: string;
  private static app: INestApplication;

  constructor(protected readonly app: INestApplication) {}

  async getBlog(blogId: string) {
    this.blog_1_id = JSON.parse(this.blog_1.text)['id'];
    const getOneBlog = await request(this.app.getHttpServer()).get(`/blogs/${blogId}`);
    expect(JSON.parse(getOneBlog.text)).toEqual({
      id: expect.any(String),
      name: correctBlogData.name,
      description: correctBlogData.description,
      websiteUrl: correctBlogData.websiteUrl,
      isMembership: false,
      createdAt: expect.any(String),
    });
    return JSON.parse(getOneBlog.text);
  }

  async getPostsByBlogId(blogId: string) {
    const response = await request(this.app.getHttpServer()).get(`/blogs/${blogId}/posts`);
    expect(JSON.parse(response.text)).toEqual('fsdfdssdf');
  }

  async getBlogs(searchNameTerm?: string, sortBy?: string, sortDirection?: string) {
    const response = await request(this.app.getHttpServer()).get(
      `/blogs?searchNameTerm=${searchNameTerm}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
    );
    return JSON.parse(response.text);
  }

  async craetePostByBlogId(blogId: string) {
    // correctPostDataCREATEPOSTINBLOGS.blogId = this.blog_1_id;
    this.post_1 = await request(this.app.getHttpServer())
      .post(`/blogs/${blogId}/posts`)
      .send(correctPostDataCREATEPOSTINBLOGS);
    expect(JSON.parse(this.post_1.text)).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: this.blog_1_id,
      blogName: correctBlogData.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [
          // {
          //   addedAt: '2024-02-28T17:02:42.877Z',
          //   userId: 'string',
          //   login: 'string',
          // },
        ],
      },
    });
    this.post_1_id = JSON.parse(this.post_1.text)['id'];
    return JSON.parse(this.post_1.text);
  }

  async getPost(postId: string) {
    this.post_1_id = JSON.parse(this.post_1.text)['id'];
    const getOnePost = await request(this.app.getHttpServer()).get(`/posts/${postId}`);
    expect(JSON.parse(getOnePost.text)).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      shortDescription: expect.any(String),
      content: expect.any(String),
      blogId: this.blog_1_id,
      blogName: correctBlogData.name,
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [
          // {
          //   addedAt: '2024-02-28T17:02:42.877Z',
          //   userId: 'string',
          //   login: 'string',
          // },
        ],
      },
    });
    return JSON.parse(getOnePost.text);
  }

  async getPosts() {
    const getOnePost = await request(this.app.getHttpServer()).get(`/posts`);
    expect(JSON.parse(getOnePost.text)).toEqual([]);
  }

  async deleteBlog() {
    await request(this.app.getHttpServer()).delete('/testing/all-data').expect(204);
  }

  async createBlog(name: string = 'string') {
    this.blog_1 = await request(this.app.getHttpServer())
      .post('/blogs')
      .send({ ...correctBlogData, name });
    expect(JSON.parse(this.blog_1.text)).toEqual({
      id: expect.any(String),
      name: correctBlogData.name,
      description: correctBlogData.description,
      websiteUrl: correctBlogData.websiteUrl,
      isMembership: false,
      createdAt: expect.any(String),
    });
    return JSON.parse(this.blog_1.text);
  }
}
