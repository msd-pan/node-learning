const AuthController = require("../controllers/auth");
const User = require("../models/user");

describe("Auth controller - Login", () => {
  test("should throw an error with code 500 if accessing the database fails", () => {
    jest.spyOn(User, "findOne");
    User.findOne.throws();

    expect(AuthController.login);

    User.findOne.mockRestore();
  });
});
