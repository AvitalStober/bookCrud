import React, { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    showBooks();
  }, [books]);

  const showBooks = () => {
    fetch("http://localhost:3000/books")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const booksArray = await response.json();
        setBooks(booksArray);
        return booksArray;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const deleteBook = (id) => {

    fetch(`http://localhost:3000/book/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then(() => {
        const afterDelete = books.filter((book) => book.id !== id);
        setBooks(afterDelete);
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error
        );
      });
  };

  const sendNewBook = () => {
    const updatedBook = { title, author };

    !author || !title
      ? alert("update missing details")
      : fetch(`http://localhost:3000/book/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBook),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(() => {
            const myBooks = books.map((book) =>
              book.id !== id ? book : updatedBook
            );

            setBooks(myBooks);
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
    setTitle("");
    setAuthor("");
    setUpdating(false);
    setId(null);
  };
  const updateBook = (id) => {
    setUpdating(true);
    setId(id);
    const myBook = books.find((book) => book.id === id);

    setAuthor(myBook.author);
    setTitle(myBook.title);
  };
  const addBook = () => {
    const newBook = { title, author };

    author && title
      ? fetch("http://localhost:3000/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBook),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setBooks((prevBooks) => [...prevBooks, data]);
            setTitle("");
            setAuthor("");
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          })
      : alert("add missing details");
  };

  return (
    <div>
      <div className="">Books List</div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter book title"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Enter book author"
      />
      {!updating ? (
        <button onClick={addBook}>add book</button>
      ) : (
        <button onClick={sendNewBook}>update book</button>
      )}

      <ul>
        {books.map((book,index) => (
          <li key={`${book.id}-${index}`}>
            {`${book.title} by ${book.author}`}
            <button onClick={() => deleteBook(book.id)}>🗑️</button>
            <button onClick={() => updateBook(book.id)}>✏️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
