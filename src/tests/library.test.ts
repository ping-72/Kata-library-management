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
});
