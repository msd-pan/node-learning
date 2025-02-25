const mongoose = require("mongoose");

const AuthController = require("../controllers/auth");
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

  test("should throw an error with code 500 if accessing the database fails", async () => {
    jest.spyOn(User, "findOne").mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    try {
      await AuthController.login(req, {}, () => {});
    } catch (error) {
      expect(error).toBeInstanceOf(Error); // 确保是 Error 实例
      expect(error).toHaveProperty("statusCode", 500);
    }

    User.findOne.mockRestore();
  });

  test("should send a response with a valid user status for an existing user", async () => {
    try {
      const req = { userId: "67b684bc589ddafaca4907f1" };
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.userStatus = data.status;
        },
      };
      await AuthController.getUserStatus(req, res, () => {});
      expect(res.statusCode).toEqual(200);
      expect(res.userStatus).toEqual("I am new!");
    } catch (err) {
      console.log(err);
    }
  });
});
