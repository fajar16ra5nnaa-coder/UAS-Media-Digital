import { describe, expect, it } from "vitest";
import {
  DivisionByZeroError,
  addRat,
  divRat,
  eqRat,
  formatRat,
  isIntegerRat,
  mulRat,
  rat,
  subRat,
  toNumber,
} from "@/lib/math/rational";

describe("rational exact arithmetic", () => {
  it("reduces fractions and normalizes negative denominators", () => {
    expect(rat(6, 4)).toEqual({ num: 3, den: 2 });
    expect(rat(2, -4)).toEqual({ num: -1, den: 2 });
    expect(rat(-6, -3)).toEqual({ num: 2, den: 1 });
    expect(rat(0, 5)).toEqual({ num: 0, den: 1 });
  });

  it("throws DivisionByZeroError when denominator is 0", () => {
    expect(() => rat(3, 0)).toThrow(DivisionByZeroError);
    expect(() => divRat(rat(4), rat(0))).toThrow(DivisionByZeroError);
  });

  it("performs exact add, sub, mul, div without floating point drift", () => {
    expect(addRat(rat(1, 3), rat(1, 6))).toEqual({ num: 1, den: 2 });
    expect(subRat(rat(5, 2), rat(3, 2))).toEqual({ num: 1, den: 1 });
    expect(mulRat(rat(2, 3), rat(-9, 4))).toEqual({ num: -3, den: 2 });
    expect(divRat(rat(3, 2), rat(3, 4))).toEqual({ num: 2, den: 1 });
    expect(eqRat(addRat(rat(1, 10), rat(2, 10)), rat(3, 10))).toBe(true);
  });

  it("formats integers and fractions cleanly", () => {
    expect(formatRat(rat(3, 1))).toBe("3");
    expect(formatRat(rat(-4, 1))).toBe("-4");
    expect(formatRat(rat(-3, 2))).toBe("-3/2");
    expect(isIntegerRat(rat(6, 3))).toBe(true);
    expect(isIntegerRat(rat(7, 2))).toBe(false);
    expect(toNumber(rat(7, 2))).toBe(3.5);
  });
});
