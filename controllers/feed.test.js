const mongoose = require("mongoose");

const FeedController = require("../controllers/feed");
const User = require("../models/user");

describe("Auth controller - Login", () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://xiaoka:kjnDrVAOaVXZdbQk@cluster0.0bsg4.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Cluster0"
      );
      const user = new User({
        email: "test@test.com",
        password: "tester",
        name: "Test",
        posts: [],
        _id: "67b684bc589ddafaca4907f1",
      });
      await user.save();
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  test("should add a created post to the posts of the creator", async () => {
    const req = {
      body: { title: "Test post", content: "A Test Post" },
      file: {
        path: "abc",
      },
      userId: "67b684bc589ddafaca4907f1",
    };
    const res = {
      status: function () {
        return this;
      },
      json: () => {},
    };

    const savedUser = await FeedController.createPost(req, res, () => {});
    expect(savedUser).toHaveProperty("posts");
    expect(savedUser.posts).toHaveLength(1);
  });
});
