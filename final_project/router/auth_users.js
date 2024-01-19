const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter((user) => {
    return user.username === username
  });

  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: ""});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = books[isbn]['reviews'];
    if (Object.keys(reviews).length > 0) {
        books[isbn]['reviews'][username] = {review: req.query.reviews}; 
        res.send(`Updated ${book['title']}'s review by ${username}`);
    } else {
      books[isbn]['reviews'][username] = {review: req.query.reviews}; 
      res.send(`Created ${book['title']}'s review by ${username}`);
    }    
  } else {
    res.send("Unable to find book!");
  }
});

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      const reviews = books[isbn]['reviews'];
      if (Object.keys(reviews).length > 0) {
        delete books[isbn]['reviews'][username]
        res.send(`Deleted ${book['title']}'s review by ${username}`);
      } else {
        res.send(`Review does not exist!`);
      }    
    } else {
      res.send("Unable to find book!");
    }
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
