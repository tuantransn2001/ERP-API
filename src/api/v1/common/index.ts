import randomstring from "randomstring";
import { Falsy } from "../ts/types/app_type";
import { ObjectDynamicKeyWithValue } from "../ts/interfaces/global_interfaces";
export const isEmpty = (
  target: ObjectDynamicKeyWithValue | Array<any>
): boolean => {
  return target instanceof Array
    ? target.length === 0
    : target === undefined || target === null
    ? true
    : Object.keys(target).length === 0;
};

export const handleGetFirstNameFromFullName = (fullName: string) => {
  let targetIndex: number | undefined;
  for (let index = fullName.length - 1; index >= 0; index--) {
    if (fullName[index] === " ") {
      targetIndex = index + 1;
      break;
    }
  }

  return fullName.slice(targetIndex);
};

export const handleFormatUpdateDataByValidValue = (
  targetObj: ObjectDynamicKeyWithValue,
  defaultValue: any
) => {
  return Object.keys(targetObj).reduce(
    (result, key) => {
      if (defaultValue.hasOwnProperty(key) && targetObj[key] !== undefined) {
        result = { ...result, [key]: targetObj[key] };
      }

      return result;
    },
    { ...defaultValue, updatedAt: new Date() }
  );
};

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomStringByCharsetAndLength = (
  charset: string,
  length: number,
  isUppercase: boolean
): string => {
  return randomstring.generate({
    charset: charset,
    length: length,
    capitalization: isUppercase ? "uppercase" : "lowercase",
  });
};

export const cartesian = (...a: Array<any>) =>
  a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

export const handleGenerateVariantBaseOnProperties = (
  properties: Array<any>
) => {
  const { keys, combineValues } = properties.reduce(
    (res: any, property: any) => {
      const { key, values }: any = property;
      res.keys.push(key);
      res.combineValues.push(values);
      return res;
    },
    {
      keys: [],
      combineValues: [],
    }
  );

  return { keys, productVariants: cartesian(...combineValues) };
};

export const checkMissPropertyInObjectBaseOnValueCondition = (
  baseObject: ObjectDynamicKeyWithValue,
  valueCondition: Falsy
): Array<string> => {
  const arrMissArray: Array<string> = Object.keys(baseObject).reduce(
    (res: any, key: string) => {
      if (
        baseObject.hasOwnProperty(key) &&
        baseObject[key] === valueCondition
      ) {
        res.push(key);
      }
      return res;
    },
    []
  );

  return arrMissArray;
};

export const isAcceptUpdateTag = (tags: Array<string>) => {
  return typeof tags !== undefined && !isEmpty(tags);
};
