import { Decimal } from "./decimal";

export const DECIMAL_ZERO = new Decimal(0);
export const DECIMAL_ONE = new Decimal(1);

export const U32_MAX = 4294967295;

export const decMultiply = (a: number, b: number) => {
  return new Decimal(a).mul(b).toNumber();
};

export const decDiv = (a: number, b: number) => {
  return new Decimal(a).div(b).toNumber();
};

export const decSub = (a: number, b: number) => {
  return new Decimal(a).sub(b).toNumber();
};

export const decAdd = (a: number, b: number) => {
  return new Decimal(a).add(b).toNumber();
};

/**
 *
 * @param data - data to be sampled
 * @param sampleIntervalInHours - interval in terms of hours to be sampled. Value of 1 means 1 data point for each hour.
 * @returns
 */
export function sampleData<T>(data: T[], sampleIntervalInHours = 1): T[] {
  const sampledData = data.filter(
    (_, index) => index % sampleIntervalInHours === 0
  );

  return sampledData;
}
