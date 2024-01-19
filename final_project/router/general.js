const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (callback)
function getAllBooks() {
  return new Promise((resolve, reject) => {
    const formattedBooks = JSON.stringify(books, null, 3);
    resolve(formattedBooks);
  });
} 
// Get book details based on isbn (callback)
function getBookDetailsISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    resolve(book);
  });
}

// Get book details based on author (callback)
function getBookDetailsAuthor(author) {
  return new Promise((resolve, reject) => {
    const filtered_key = Object.entries(books).map(([key, value]) => {
      if (value.author === author) {
        return key;
      }
    }).filter((key) => key);
    resolve(filtered_key);
  });
}

// Get book details based on author (callback)
function getBookDetailsTitle(title) {
  return new Promise((resolve, reject) => {
    const filtered_key = Object.entries(books).map(([key, value]) => {
      if (value.title === title) {
        return key;
      }
    }).filter((key) => key);
    resolve(filtered_key);
  });
}

// Get book reviews based on isbn (callback)
function getBookReviews(isbn) {
  return new Promise((resolve, reject) => {
    const reviews = books[isbn]['reviews'];
    resolve(reviews);
  })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getAllBooks().then((formattedBooks) => {
    res.send(formattedBooks);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookDetailsISBN(isbn).then((book) => {
    res.send(book);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBookDetailsAuthor(author).then((filtered_key) => {
    res.send(books[filtered_key]);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBookDetailsTitle(title).then((filtered_key) => {
    res.send(books[filtered_key]);
  })
});

//  Get book reviews based on isbn
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookReviews(isbn).then((reviews) => {
    res.send(reviews);
  })
});

module.exports.general = public_users;
