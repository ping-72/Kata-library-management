export interface Book {
  isbn: string;
  title: string;
  author: string;
  publicationYear: number;
  isAvailable: boolean;
  borrowedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
