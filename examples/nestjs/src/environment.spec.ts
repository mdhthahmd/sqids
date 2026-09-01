import { validateEnvironment } from "./environment";

describe("environment validation", () => {
  it("uses port 3000 by default", () => {
    expect(validateEnvironment({})).toEqual({ HTTP_PORT: 3000 });
  });

  it("coerces HTTP_PORT from an environment string", () => {
    expect(validateEnvironment({ HTTP_PORT: "4000" })).toEqual({
      HTTP_PORT: 4000,
    });
  });

  it.each(["0", "65536", "not-a-port"])("rejects invalid HTTP_PORT %s", (port) => {
    expect(() => validateEnvironment({ HTTP_PORT: port })).toThrow();
  });
});
