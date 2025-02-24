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

  test("shoule yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer ahdsjklmcdpijcopdjk";
      },
    };
    authMiddleware(req, {}, () => {});

    expect(req).toHaveProperty("userId");
  });
});
