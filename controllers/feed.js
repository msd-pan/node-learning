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

exports.postPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  //   create post in db
  res.status(201).json({
    message: "Post created successfully!",
    posts: [
      {
        id: new Date().toString(),
        title,
        content,
      },
    ],
  });
};
