const { validationResult } = require("express-validator");

const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first product",
        content: "this is the first post!",
        imageUrl: "images/orange-tabby-cat.jpg",
        creator: {
          name: "xiaoka",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }

    const { title, content } = req.body;
    const post = new Post({
      title,
      imageUrl: "images/cat.jpg",
      content,
      creator: {
        name: "xiaoka",
      },
    });
    const result = await post.save();
    console.log(result);

    //   create post in db
    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
