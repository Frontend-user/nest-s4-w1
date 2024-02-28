export class TestManager {
  createBlog() {}
}

export const correctBlogData = {
  name: 'name',
  description: 'description',
  websiteUrl: 'https://TXOxcSX82Olmsdf8sXEHAWm.ZFTe4',
};

export const expectCorrectBlogData = {
  name: 'name',
  description: 'description',
  websiteUrl: 'https://TXOxcSX82Olmsdf8sXEHAWm.ZFTe4',
  isMembership: true,
  createdAt: expect(String),
  _id: expect(String),
  __v: expect(Number),
};
