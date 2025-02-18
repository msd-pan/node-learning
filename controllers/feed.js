const { validationResult } = require("express-validator");

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;

  //   create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toString(),
      title,
      content,
      creator: {
        name: "xiaoka",
      },
      createdAt: new Date(),
    },
  });
};
