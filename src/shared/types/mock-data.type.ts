export type MockData = {
  articles: Article[];
  users: User[];
  comments: Comment[];
};

type Article = {
  title: string;
  description: string;
  body: string;
  tagList: string[];
  user: string;
};

type User = {
  email: string;
  username: string;
  password: string;
};

type Comment = {
  article: string;
  user: string;
  body: string;
};
