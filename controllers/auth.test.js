const AuthController = require("../controllers/auth");
const User = require("../models/user");

describe("Auth controller - Login", () => {
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
});
