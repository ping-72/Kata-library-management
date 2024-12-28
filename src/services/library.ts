import { error } from "console";
import { Book, User } from "../models/schemas";

export class Library {
  private books: Book[] = [];
  private users: User[] = [];

  addBook(book: Omit<Book, "isAvailable" | "borrowedBy">): void {
    const existingBook = this.books.find((b) => b.isbn === book.isbn);
    if (existingBook) {
      throw new Error("Book with this ISBN already exist in the library.");
    }
    this.books.push({ ...book, isAvailable: true, borrowedBy: "" });
  }

  updateBook(
    isbn: string,
    updates: Partial<Omit<Book, "isbn" | "borrowedBy">>
  ): void {
    const book = this.books.find((b) => b.isbn === isbn);
    if (!book) {
      throw new Error("Book not found.");
    }
    if (updates.title !== undefined) book.title = updates.title;
    if (updates.author !== undefined) book.author = updates.author;
    if (updates.publicationYear !== undefined)
      book.publicationYear = updates.publicationYear;
  }

  deleteBook(isbn: string): void {
    const initialLength = this.books.length;
    this.books = this.books.filter((b) => b.isbn !== isbn);
    if (this.books.length === initialLength) {
      throw new Error("Book not found.");
    }
  }

  registerUser(user: Omit<User, "id">): User {
    const existingUser = this.users.find((u) => u.email === user.email);
    if (existingUser) {
      throw new Error("User with this email already exist in the library.");
    }
    const newUser = { id: this.generateUserId(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  borrowBook(isbn: string, userId: string): void {
    const book = this.books.find((b) => b.isbn === isbn);
    if (!book) {
      throw new Error("Book not found.");
    }
    if (!book.isAvailable) {
      throw new Error("Book is not available for borrowing.");
    }

    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error("User not found.");
    }
    book.isAvailable = false;
    book.borrowedBy = userId;
  }

  returnBook(isbn: string, userId: string): void {
    const book = this.books.find((b) => b.isbn === isbn);
    if (!book) {
      throw new Error("Book not found.");
    }
    if (book.isAvailable) {
      throw new Error("Book was not borrowed.");
    }
    if (book.borrowedBy !== userId) {
      throw new Error("Book was not borrowed by this user.");
    }
    book.isAvailable = true;
    book.borrowedBy = "";
  }

  viewAvailableBooks(): Book[] {
    return this.books.filter((book) => book.isAvailable);
  }

  viewBorrowedBooks(userId: string): Book[] {
    return this.books.filter((book) => book.borrowedBy === userId);
  }

  private generateUserId(): string {
    return `user-${Math.random().toString(36).substring(2, 9)}`;
  }
}
