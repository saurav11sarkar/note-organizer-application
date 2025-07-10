// types.ts
export interface Category {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  image: string[];
  category: Category;
  user: User;
  createdAt: string;
  updatedAt: string;
}
