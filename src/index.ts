import express, { Request, Response } from "express";
import { Book, User } from "./models/schemas";
import { Library } from "./services/library";

const app = express();
app.use(express.json());

const library = new Library();

let books: Book[] = [];
let currentId = 1;

app.get("/books", (req: Request, res: Response) => {
  const books = library.viewAvailableBooks();
  res.json(books);
});

app.get("/books/:isbn", (req: Request, res: Response) => {
  const isbn = req.params.isbn;
  const book = library.viewAvailableBooks().find((b) => b.isbn === isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found or not available" });
  }
});

app.post("/books", (req: Request, res: Response) => {
  const { title, author, isbn, publicationYear } = req.body;
  try {
    const newBook: Omit<Book, "isAvailable" | "borrowedBy"> = {
      title,
      author,
      isbn,
      publicationYear,
    };
    library.addBook(newBook);
    res.status(201).json({ ...newBook, isAvailable: true, borrowedBy: "" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/books/:isbn", (req: Request, res: Response) => {
  const isbn = req.params.isbn;
  const { title, author, publicationYear } = req.body;
  try {
    library.updateBook(isbn, { title, author, publicationYear });
    const updateBook = library
      .viewAvailableBooks()
      .find((b) => b.isbn === isbn);
    res.json(updateBook);
  } catch (error: any) {
    if (error.message === "Book not found.") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

app.delete("/books/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    library.deleteBook(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

app.post("/users", (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = library.registerUser({ name, email });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/borrow", (req: Request, res: Response) => {
  const { isbn, userId } = req.body;
  try {
    library.borrowBook(isbn, userId);
    res.status(200).json({ message: "Book borrowed successfully." });
  } catch (error: any) {
    if (
      error.message === "Book not found." ||
      error.message === "User not found."
    ) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

app.post("/return", (req: Request, res: Response) => {
  const { isbn, userId } = req.body;
  try {
    library.returnBook(isbn, userId);
    res.status(200).json({ message: "Book returned successfully." });
  } catch (error: any) {
    if (error.message === "Book not found.") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

app.get("/users/:userId/borrowed-books", (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const borrowedBooks = library.viewBorrowedBooks(userId);
    res.json(borrowedBooks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
