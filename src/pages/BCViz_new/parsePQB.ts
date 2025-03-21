import { isUndefined } from "lodash";
import type { execTextType, getFromSTReturn } from "./api";
import { UVenum } from "../BCviz/utils";
const { isSafeInteger } = Number;
export function parseStringToObjArray (str: string): getFromSTReturn {
  const lines = str.split('\n');
  const objArray: execTextType[] = [];
  let i = 0;
  let allCount = undefined;
  const { length } = lines;
  while (i < length) {
    if (lines[i]?.startsWith('No.')) {
      i++;
      const sizeLine = lines[i++];
      const uLine = lines[i++];
      const vLine = lines[i++];
      let countLine: string | undefined;
      if (i < length && lines[i]?.startsWith('count:')) {
        countLine = lines[i++];
      }

      // 解析 size
      const sizeMatch = sizeLine?.match(/size=(\d+)/)?.[1];
      if (!sizeMatch) {
        throw new Error('Invalid size format');
      }
      const size = parseInt(sizeMatch, 10);
      if (!isSafeInteger(size) || size <= 0) {
        throw new Error('Size must be a positive integer');
      }

      // 解析 U
      const uMatch = uLine?.match(/U: (\d+(?: \d+)*)/);
      if (!uMatch) {
        throw new Error('Invalid U format');
      }
      const uValues = uMatch[1]?.split(' ').map(Number) ?? [];
      if (uValues?.some(isNaN) || uValues?.some(num => num <= 0)) {
        throw new Error('U values must be positive integers');
      }

      // 解析 V
      const vMatch = vLine?.match(/V: (\d+(?: \d+)*)/);
      if (!vMatch) {
        throw new Error('Invalid V format');
      }
      const vValues = vMatch[1]?.split(' ').map(Number) ?? [];
      if (vValues?.some(isNaN) || vValues?.some(num => num <= 0)) {
        throw new Error('V values must be positive integers');
      }

      // 解析 count
      let count: number | undefined;
      if (countLine) {
        const countMatch = countLine.match(/count: (\d+)/)?.[1];
        if (!countMatch) {
          throw new Error('Invalid count format');
        }
        count = parseInt(countMatch, 10);
        if (!isSafeInteger(count) || count <= 0) {
          throw new Error('Count must be a positive integer');
        }
      }

      const obj: execTextType = {
        size,
        [UVenum.U]: uValues,
        [UVenum.V]: vValues,
        label: `Rank ${objArray.length + 1}`,
        ...(count ? { count } : null)
      };
      objArray.push(obj);
    } else if (lines[i]?.startsWith('The number of ')) {
      const numLine = lines[i + 1];
      if (!numLine) {
        throw new Error('The number of (\\d,\\d)-bicliques not has next line');
      }
      const num = parseInt(numLine, 10);
      if (!isSafeInteger(num) || num <= 0) {
        throw new Error('The number of (\\d,\\d)-bicliques must be a positive integer');
      }
      allCount = num;
      // console.log(num);
      break;
    } else {
      i++;
    }
  }
  return {
    dataArr: objArray,
    //   .map((i, ind) => ({
    //   ...i,
    //   label: `Rank ${ind}`
    // })),
    ...(isUndefined(allCount) ? {} : { count: allCount })
  };
}

// const str = `No.1
// size=4
// U: 1 2
// V: 1 2
// count: 4
// No.2
// size=4
// U: 1
// V: 1 2 3 4
// count: 4
// No.3
// size=6
// U: 1 3 4
// V: 3 4
// count: 6
// No.4
// size=3
// U: 4
// V: 3 4 5
// count: 3
// No.5
// size=3
// U: 4 5 6
// V: 5
// count: 3
// No.6
// size=4
// U: 5 6
// V: 5 6
// No.7
// size=4
// U: 7 8
// V: 7 8
// count: 4
// The number of (1,1)-bicliques is:
// 28`;

// try {
//   const result = parseStringToObjArray(str);
//   console.log(result);
// } catch (error) {
//   if (error instanceof Error) {
//     console.error(error.message);
//   }
// }

