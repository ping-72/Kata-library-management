import { exec } from "child_process";
import { Library } from "../services/library";
import testData from "./testData/testData.json";
import { User, Book } from "../models/schemas";

describe("Library Management System", () => {
  let library: Library;
  let users: User[];

  beforeAll(() => {
    library = new Library();

    users = testData.users.map((userData) => library.registerUser(userData));
  });

  beforeEach(() => {
    library = new Library();
    users = testData.users.map((userData) => library.registerUser(userData));

    testData.books.forEach((bookData) => library.addBook(bookData));
  });

  test("should add a new book to the library", () => {
    const newBook: Omit<Book, "isAvailable" | "borrowedBy"> = {
      isbn: "123-456-789",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      publicationYear: 1925,
    };

    library.addBook(newBook);

    const availableBooks = library.viewAvailableBooks();
    const bookFound = availableBooks.filter(
      (book) => book.isbn === newBook.isbn
    );
    expect(bookFound.length).toBe(1);
  });

  test("should register a new user", () => {
    const newUser: Omit<User, "id"> = {
      name: "Prince Kumar",
      email: "xyz123@example.com",
    };

    const registeredUser = library.registerUser(newUser);
    expect(registeredUser).toHaveProperty("id");
    expect(registeredUser.name).toBe(newUser.name);
    expect(registeredUser.email).toBe(newUser.email);
  });

  test("should not register an existing user", () => {
    const existingUser: Omit<User, "id"> = {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
    };

    expect(() => {
      library.registerUser(existingUser);
    }).toThrow("User with this email already exist in the library.");
  });

  test("should borrow an available book by registered user", () => {
    const user = users[0];
    const book_isbn = "111-222-333";

    library.borrowBook(book_isbn, user.id);

    const availableBooks = library.viewAvailableBooks();

    expect(
      availableBooks.find((book) => book.isbn === book_isbn)
    ).toBeUndefined();
  });

  test("should not return a book that is not borrowed", () => {
    const user1 = users[0];
    const user2 = users[1];
    const book_isbn = "111-222-333";

    library.borrowBook(book_isbn, user1.id);
    expect(() => {
      library.borrowBook(book_isbn, user2.id);
    }).toThrow("Book is not available for borrowing.");
  });

  test("should not return a book that is not borrowed", () => {
    const user = users[0];
    const book_isbn = "111-222-333";

    expect(() => {
      library.returnBook(book_isbn, user.id);
    }).toThrow("Book was not borrowed.");
  });

  test("should not return a book that is not borrowed by the user", () => {
    const user1 = users[0];
    const user2 = users[1];
    const book_isbn = "111-222-333";

    library.borrowBook(book_isbn, user1.id);
    expect(() => {
      library.returnBook(book_isbn, user2.id);
    }).toThrow("Book was not borrowed by this user.");
  });

  test("should show all the available books", () => {
    const availableBooks = library.viewAvailableBooks();
    expect(availableBooks.length).toBe(testData.books.length);
  });

  test("should view borrowed books by a specific user", () => {
    const user = users[0];
    const book_isbn1 = "111-222-333";
    const book_isbn2 = "444-555-666";

    library.borrowBook(book_isbn1, user.id);
    const borrowedBooks = library.viewBorrowedBooks(user.id);
    expect(borrowedBooks.length).toBe(1);
    expect(borrowedBooks[0].isbn).toBe(book_isbn1);

    library.borrowBook(book_isbn2, user.id);
    const updatedBorrowedBooks = library.viewBorrowedBooks(user.id);
    expect(updatedBorrowedBooks.length).toBe(2);
    expect(updatedBorrowedBooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ isbn: book_isbn1 }),
        expect.objectContaining({ isbn: book_isbn2 }),
      ])
    );
  });
  // More test to add
});
