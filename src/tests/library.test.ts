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

  // More test to add
});
