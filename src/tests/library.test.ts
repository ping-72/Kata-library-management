import { exec } from "child_process";
import { Library } from "../services/library";

describe("Library Management System", () => {
  let library: Library;

  beforeEach(() => {
    library = new Library();
  });

  test("should add a new book to the library", () => {
    const book = {
      isbn: "123-456-789",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publicationYear: 1925,
    };

    library.addBook(book);

    const availableBooks = library.viewAvailableBooks();
    expect(availableBooks).toContainEqual({ ...book, isAvailable: true });
  });

  test("should borrow an available book", () => {
    const book = {
      isbn: "987-654-321",
      title: "1984",
      author: "George Orwell",
      publicationYear: 1949,
    };

    library.addBook(book);
    library.borrowBook(book.isbn);

    expect(() => {
      library.borrowBook(book.isbn);
    }).toThrow("Book is not available for borrowing");
  });

  test("should not return a book that is not borrowed", () => {
    const book = {
      isbn: "999-888-777",
      title: "Moby Dick",
      author: "Herman Melville",
      publicationYear: 1851,
    };

    library.addBook(book);

    expect(() => {
      library.returnBook(book.isbn);
    }).toThrow("Book was not borrowed.");
  });

  test("should return a borrowed book", () => {
    const books = [
      {
        isbn: "111-222-333",
        title: "War and Peace",
        author: "Leo Tolstoy",
        publicationYear: 1869,
      },
      {
        isbn: "444-555-666",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        publicationYear: 1951,
      },
    ];

    books.forEach((book) => library.addBook(book));
    library.borrowBook(books[0].isbn);
    library.returnBook(books[0].isbn);

    const availableBooks = library.viewAvailableBooks();
    expect(availableBooks).toEqual(
      expect.arrayContaining([
        { ...books[0], isAvailable: true },
        { ...books[1], isAvailable: true },
      ])
    );
  });

  test("should show all the available books", () => {
    const books = [
      {
        isbn: "111-222-333",
        title: "War and Peace",
        author: "Leo Tolstoy",
        publicationYear: 1869,
      },
      {
        isbn: "444-555-666",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        publicationYear: 1951,
      },
    ];

    books.forEach((book) => library.addBook(book));

    const availableBooks = library.viewAvailableBooks();
    expect(availableBooks).toEqual(
      expect.arrayContaining([
        { ...books[0], isAvailable: true },
        { ...books[1], isAvailable: true },
      ])
    );
    library.borrowBook(books[0].isbn);

    const updatedAvailableBooks = library.viewAvailableBooks();
    expect(updatedAvailableBooks.length).toBe(1);
    expect(updatedAvailableBooks).toEqual(
      expect.arrayContaining([{ ...books[1], isAvailable: true }])
    );
  });

  // More test to add
});
