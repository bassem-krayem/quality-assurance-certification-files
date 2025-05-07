/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../models/bookModel");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      try {
        const books = await Book.find();
        // console.log(books);
        res.json(books);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      try {
        if (!title) {
          return res.send("missing required field title");
        }
        const book = await Book.create({ title });

        // console.log(book);
        res.json(book);
      } catch (err) {
        console.error(err);
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (err) {
        console.error(err);
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid);

        if (!book) {
          return res.send("no book exists");
        }
        res.json(book);
      } catch (err) {
        console.error(err);
      }
    })

    .post(async function (req, res) {
      const bookId = req.params.id;
      const comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }

      try {
        const book = await Book.findById(bookId);

        if (!book) {
          return res.send("no book exists");
        }

        book.comments.push(comment); // Add comment to array
        await book.save();

        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments,
        });
      } catch (err) {
        console.error(err);
      }
    })
    .delete(async function (req, res) {
      const bookId = req.params.id;

      try {
        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
          return res.send("no book exists");
        }

        res.send("delete successful");
      } catch (err) {
        console.error(err);
      }
    });
};
