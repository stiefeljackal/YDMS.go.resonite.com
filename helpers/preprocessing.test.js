import { expect, test } from "vitest";
import { preProcessName } from "./preprocessing.js";

test("parses color tags with conformant color names from Resonite to span tags", () => {
  const validColors = ["white", "gray", "black", "red", "green", "blue", "yellow", "cyan", "magenta", "orange", "purple", "lime", "pink", "brown"];

  validColors.forEach((validColor) => {
    expect(preProcessName(`<color=${validColor}>Title</color>`))
      .toBe(`<span style="color: ${validColor}">Title</span>`);
    expect(preProcessName(`<color="${validColor}">Title</color>`))
      .toBe(`<span style="color: ${validColor}">Title</span>`);
    expect(preProcessName(`<color "${validColor}">Title</color>`))
      .toBe(`<span style="color: ${validColor}">Title</span>`);
    expect(preProcessName(`<color ${validColor}>Title</color>`))
      .toBe(`<span style="color: ${validColor}">Title</span>`);
    expect(preProcessName(`<color="${validColor}">[Tag] <color=${validColor}>Title</color></color>`))
      .toBe(`<span style="color: ${validColor}">[Tag] <span style="color: ${validColor}">Title</span></span>`);
  })
});

test("parses color tags with 'clear' value from Resonite to span tags", () => {
  expect(preProcessName(`<color=clear>Title</color>`))
    .toBe(`<span style="color: transparent">Title</span>`);
  expect(preProcessName(`<color="clear">Title</color>`))
    .toBe(`<span style="color: transparent">Title</span>`);
  expect(preProcessName(`<color clear>Title</color>`))
    .toBe(`<span style="color: transparent">Title</span>`);
  expect(preProcessName(`<color "clear">Title</color>`))
    .toBe(`<span style="color: transparent">Title</span>`);
  expect(preProcessName(`<color="clear">[Tag] <color=clear>Title</color></color>`))
    .toBe(`<span style="color: transparent">[Tag] <span style="color: transparent">Title</span></span>`);
});

test("parses color tags with platform color value from Resonite to span tags", () => {
  const validColors = ["yellow", "green", "red", "purple", "cyan", "orange"];
  const validPalettes = ["hero", "mid", "sub", "dark"];

  validColors.forEach((validColor) => {
    validPalettes.forEach((validPalette) => {
      expect(preProcessName(`<color=${validPalette}.${validColor}>Title</color>`))
        .toBe(`<span style="color: var(--color-${validPalette}-${validColor})">Title</span>`);
      expect(preProcessName(`<color="${validPalette}.${validColor}">Title</color>`))
        .toBe(`<span style="color: var(--color-${validPalette}-${validColor})">Title</span>`);
      expect(preProcessName(`<color ${validPalette}.${validColor}>Title</color>`))
        .toBe(`<span style="color: var(--color-${validPalette}-${validColor})">Title</span>`);
      expect(preProcessName(`<color "${validPalette}.${validColor}">Title</color>`))
        .toBe(`<span style="color: var(--color-${validPalette}-${validColor})">Title</span>`);
      expect(preProcessName(`<color="${validPalette}.${validColor}">[Tag] <color=${validPalette}.${validColor}>Title</color></color>`))
        .toBe(`<span style="color: var(--color-${validPalette}-${validColor})">[Tag] <span style="color: var(--color-${validPalette}-${validColor})">Title</span></span>`);
    })
  })
});

test("parses color tags with supported hex value from Resonite to span tags", () => {
  expect(preProcessName(`<color=#abc>Title</color>`))
    .toBe(`<span style="color: #abc">Title</span>`);
  expect(preProcessName(`<color #abc>Title</color>`))
    .toBe(`<span style="color: #abc">Title</span>`);

  expect(preProcessName(`<color=#abcd>Title</color>`))
    .toBe(`<span style="color: #abcd">Title</span>`);
  expect(preProcessName(`<color #abcd>Title</color>`))
    .toBe(`<span style="color: #abcd">Title</span>`);

  expect(preProcessName(`<color=#abc123>Title</color>`))
    .toBe(`<span style="color: #abc123">Title</span>`);
  expect(preProcessName(`<color #abc123>Title</color>`))
    .toBe(`<span style="color: #abc123">Title</span>`);

  expect(preProcessName(`<color=#abc1230b>Title</color>`))
    .toBe(`<span style="color: #abc1230b">Title</span>`);
  expect(preProcessName(`<color #abc1230b>Title</color>`))
    .toBe(`<span style="color: #abc1230b">Title</span>`);
})

test("parses different casing for color value", () => {
  expect(preProcessName(`<color=CLeAr>Title</color>`))
    .toBe(`<span style="color: transparent">Title</span>`);
  expect(preProcessName(`<color="GReEN">Title</color>`))
    .toBe(`<span style="color: green">Title</span>`);
  expect(preProcessName(`<color miD.PurPLE>Title</color>`))
    .toBe(`<span style="color: var(--color-mid-purple)">Title</span>`);
  expect(preProcessName(`<color "SUB.GREEN">Title</color>`))
    .toBe(`<span style="color: var(--color-sub-green)">Title</span>`);
  expect(preProcessName(`<color="HEro.ORanGe">[Tag] <color #aaBbCCdD>Title</color></color>`))
    .toBe(`<span style="color: var(--color-hero-orange)">[Tag] <span style="color: #aabbccdd">Title</span></span>`);
})

test('closes missing color end tag with span end tag', () => {
  expect(preProcessName(`<color=red>Title`))
    .toBe(`<span style="color: red">Title</span>`);
  expect(preProcessName(`<color=red>Title<color green> Test`))
    .toBe(`<span style="color: red">Title<span style="color: green"> Test</span></span>`);
  expect(preProcessName(`<color=red>Title<color green> Test    </color>`))
    .toBe(`<span style="color: red">Title<span style="color: green"> Test    </span></span>`);
})