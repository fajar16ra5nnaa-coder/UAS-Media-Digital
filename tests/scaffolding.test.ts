import { describe, expect, it } from "vitest";
import { createEquation } from "@/lib/math/plsv-engine";
import {
  getContingentScaffolding,
  getFadingConfig,
} from "@/lib/pedagogy/scaffolding";

describe("adaptive 3-level scaffolding engine (Anghileri + van de Pol)", () => {
  it("provides contingent guidance tailored to each error pattern without leaking final answer", () => {
    const eq = createEquation(2, 3, 0, 11); // x = 4

    const singleSide = getContingentScaffolding("SINGLE_SIDE_OP", eq, 1);
    expect(singleSide.pattern).toBe("SINGLE_SIDE_OP");
    expect(singleSide.levels).toHaveLength(1);
    expect(singleSide.levels[0].title).toContain("Level 1");
    expect(singleSide.levels[0].body).not.toContain("x = 4");

    const divZero = getContingentScaffolding("DIVIDE_BY_ZERO", eq, 2);
    expect(divZero.levels).toHaveLength(2);
    expect(divZero.levels[0].body.toLowerCase()).toContain("nol");

    const frac = getContingentScaffolding("PRODUCES_FRACTION", eq, 3);
    expect(frac.levels).toHaveLength(3);
    expect(frac.levels[2].body.toLowerCase()).toContain("contoh");
    expect(frac.levels[2].body).not.toContain("2x + 3 = 11");
  });

  it("adapts hints dynamically to equation structure (variables on both sides vs constant)", () => {
    const bothX = createEquation(3, 2, 1, 8); // 3x + 2 = x + 8
    const hint = getContingentScaffolding("GENERAL_STUCK", bothX, 2);
    expect(hint.focusTarget).toBe("variable_both_sides");
    expect(hint.levels[1].body.toLowerCase()).toContain("variabel");

    const negConst = createEquation(2, -5, 0, 9); // 2x - 5 = 9
    const hint2 = getContingentScaffolding("GENERAL_STUCK", negConst, 2);
    expect(hint2.focusTarget).toBe("clear_constant");
    expect(hint2.levels[1].body).toContain("-5");
  });

  it("implements progressive fading across LKPD stages 1 to 4", () => {
    expect(getFadingConfig(1).showVisualByDefault).toBe(true);
    expect(getFadingConfig(1).maxHintLevel).toBe(3);

    expect(getFadingConfig(2).showVisualByDefault).toBe(true);
    expect(getFadingConfig(2).maxHintLevel).toBe(3);

    expect(getFadingConfig(3).showVisualByDefault).toBe(false);
    expect(getFadingConfig(3).maxHintLevel).toBe(2);

    expect(getFadingConfig(4).showVisualByDefault).toBe(false);
    expect(getFadingConfig(4).maxHintLevel).toBe(1);
  });
});
