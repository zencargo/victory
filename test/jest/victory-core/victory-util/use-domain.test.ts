/* eslint-disable max-nested-callbacks */
import { Hooks } from "victory-core";
import { renderHook } from "@testing-library/react-hooks";

describe("useDomain", () => {
  it("gets the domain from props", () => {
    const props = {
      domain: [0, 1]
    };
    const { result } = renderHook(() => Hooks.useDomain(props, "x"));
    expect(result.current).toEqual([0, 1]);
  });

  it("gets the domain from props for x and y", () => {
    const props = {
      domain: { x: [0, 1] }
    };
    const { result } = renderHook(() => Hooks.useDomain(props, "x"));
    expect(result.current).toEqual([0, 1]);
  });

  it("gets the domain from data if props don't exist for a particular axis", () => {
    const props = {
      domain: { y: [1, 2] },
      data: [
        { x: 1, y: 3 },
        { x: 3, y: 5 }
      ]
    };
    const { result } = renderHook(() => Hooks.useDomain(props, "x"));
    expect(result.current).toEqual([1, 3]);
  });

  it("gets the domain from data with dates", () => {
    const props = {
      domain: { y: [1, 2] },
      data: [
        { x: new Date(2022, 0, 10), y: 1 },
        { x: new Date(2022, 0, 1), y: 2 }
      ]
    };
    const { result } = renderHook(() => Hooks.useDomain(props, "x"));
    expect(result.current).toEqual([
      new Date(2022, 0, 1),
      new Date(2022, 0, 10)
    ]);
  });

  it("returns a domain from minDomain and maxDomain if both are defined", () => {
    const props = { minDomain: 1, maxDomain: 10 };
    const { result } = renderHook(() => Hooks.useDomain(props, "x"));
    expect(result.current).toEqual([1, 10]);
  });

  it("returns a domain from minDoman and maxDomain if both are defined for x and y", () => {
    const props = {
      minDomain: { x: 1, y: 2 },
      maxDomain: { x: 10, y: 20 }
    };
    const { result } = renderHook(() => Hooks.useDomain(props, "x"));
    expect(result.current).toEqual([1, 10]);
  });

  describe("with zero", () => {
    it("ensures that the domain includes zero for the dependent axis", () => {
      const props = {
        data: [
          { x: 1, y: 3 },
          { x: 3, y: 5 }
        ]
      };
      const { result } = renderHook(() => Hooks.useDomain(props, "y", true));
      expect(result.current).toEqual([0, 5]);
    });

    it("allows minimum domain values less than zero", () => {
      const props = {
        data: [
          { x: 1, y: -3 },
          { x: 3, y: 5 }
        ]
      };
      const { result } = renderHook(() => Hooks.useDomain(props, "y", true));
      expect(result.current).toEqual([-3, 5]);
    });

    // TODO: Investigate this more
    // Why is y0 different for each x/y value? Could minDomain be used instead?
    it.skip("allows explicit y0 values in props.data to set the minimum domain", () => {
      const props = {
        data: [
          { x: 1, y: 3, y0: 2 },
          { x: 3, y: 5, y0: 3 }
        ]
      };
      const { result } = renderHook(() => Hooks.useDomain(props, "y", true));
      expect(result.current).toEqual([2, 5]);
    });
  });
});
