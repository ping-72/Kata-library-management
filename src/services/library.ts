interface Book {
  isbn: string; // unique id for the book
  title: string;
  author: string;
  publicationYear: number;
  isAvailable: boolean;
}

export class Library {
  private books: Book[] = [];

  addBook(book: Omit<Book, "isAvailable">): void {
    const existingBook = this.books.find((b) => b.isbn === book.isbn);
    if (existingBook) {
      throw new Error("Book with this ISBN already exist in the library.");
    }
    this.books.push({ ...book, isAvailable: true });
  }

  viewAvailableBooks(): Book[] {
    return this.books.filter((book) => book.isAvailable);
  }
}