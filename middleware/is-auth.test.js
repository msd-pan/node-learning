const jwt = require("jsonwebtoken");

// import authMiddleware from "./is-auth";
const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", () => {
  test("should throw an error if no authorization header is present", () => {
    const req = {
      get: (headerName) => {
        return null;
      },
    };

    expect(() => {
      authMiddleware(req, {}, () => {});
    }).toThrow("Not authenticated.");
  });

  test("shoule throw an error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xyz";
      },
    };

    expect(() => {
      authMiddleware(req, {}, () => {}).toThrow();
    });
  });

  test("shoule yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer ahdsjklmcdpijcopdjk";
      },
    };

    jest.spyOn(jwt, "verify").mockReturnValue({ userId: "abc" });

    authMiddleware(req, {}, () => {});

    expect(req).toHaveProperty("userId");
    expect(req).toHaveProperty("userId", "abc");
    expect(jwt.verify).toHaveBeenCalled();
    jwt.verify.mockRestore();
  });

  test("shoule throw an error if the token cannot be varified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz";
      },
    };

    expect(() => {
      authMiddleware(req, {}, () => {}).toThrow();
    });
  });
});
