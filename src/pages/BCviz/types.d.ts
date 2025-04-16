import type { SVGAttributes, Dispatch, SetStateAction, RefObject } from "react";
import { UVenum, clickCircleFn, doubleClickCircleFn, getCommonValueFromTableData, getGraphLineWithHighlightLevel, getSvgSize } from "./utils";
import { type Result } from 'ahooks/lib/useRequest/src/types';
import type { Datas, execTextType, getFromST } from "../BCViz_new/api";

export interface OriginDataObj {
  readonly k: UVenum;
  readonly kInd: number;
  readonly v: number;
}
export type dotNeighbor = Array<Omit<OriginDataObj, 'v'>>;
export interface OriginDataObjWithIndex extends OriginDataObj {
  readonly i: number;
}
export type OriginDataObjWithIndexArr = ReadonlyArray<OriginDataObjWithIndex>;
export interface PosDataObj extends OriginDataObjWithIndex {
  readonly x?: number;
  readonly y?: number;
  readonly graphX: number;
  readonly graphY: number;
  readonly isHighlight?: boolean;
  readonly isMoreHighlight?: boolean;
  readonly neighbor?: dotNeighbor;
  readonly color?: string;
  // readonly neighborCount?: number;
}

export type OriginDataObjArr = Array<OriginDataObj>;
export type OriginDataObjReadonlyArr = ReadonlyArray<OriginDataObj>;
export type typeOfGetCommonValueFromTableData = typeof getCommonValueFromTableData;
export type getCommonValueFromTableDataReturnType = ReturnType<typeOfGetCommonValueFromTableData>;
export type getCommonValueFromTableDataParamers = Parameters<typeOfGetCommonValueFromTableData>;
type OriginGraphData = Record<UVenum, OriginDataObj['kInd']>;
export type OriginGraphDataSuper = OriginGraphData & {
  readonly superWidth?: number;
};
export type OriginGraphDataSuperArr = Array<OriginGraphDataSuper>;
export type OriginGraphDataSuperReadonlyArr = ReadonlyArray<OriginGraphDataSuper>;
export type OriginGraphDataArr = (Record<UVenum, OriginDataObj['kInd']>)[];
export type OriginGraphDataReadonlyArr = Readonly<OriginGraphDataArr>;
export type kInd = OriginDataObj['kInd'];
type indexNeighbor = Record<kInd, dotNeighbor>;
export type GraphNeighbor = Record<UVenum, indexNeighbor>;
export type PosDataObjArr = ReadonlyArray<PosDataObj>;
type Pos = Readonly<[number, number]>;
export type drawLineData = Array<readonly [Pos, Pos]>;
export type pos = ReadonlyArray<[number, number]>;
export type SvgSize = ReturnType<ReturnType<typeof getSvgSize>>;
export interface UseGetFromST {
  readonly useGetFromST: Result<Datas, Parameters<typeof getFromST>>;
}
export interface SizeProps {
  readonly isEditX: boolean;
  readonly size: execTextType['size'];
}
export interface SetSizeProps {
  readonly setSize: (e: execTextType['size']) => void;
}
export type SizeAndSetProps = SizeProps & SetSizeProps;
export interface DataArrWithPos {
  readonly dataArrWithPos: PosDataObjArr;
}
export type HSSProps = SizeAndSetProps & DataArrWithPos;
export type SVGChartsProps = SizeProps & DataArrWithPos & {
  readonly commonValueFromTableData: getCommonValueFromTableDataReturnType;
};
export type ClickCircleProps = SVGChartsProps & {
  readonly colors?: ReadonlyArray<string>;
};
export interface CommonSVGProps extends SVGChartsProps {
  readonly viewBox?: SVGAttributes<SVGSVGElement>['viewBox'];
  readonly drawDotData: PosDataObjArr;
  // readonly setDrawDotData: Dispatch<SetStateAction<PosDataObjArr>>;
  readonly clickCircle: ReturnType<typeof clickCircleFn>;
  readonly doubleClickCircle: ({ dotData, v }: {
    readonly dotData?: PosDataObj;
    readonly v?: execTextType['size'];
  }) => () => void;
  readonly svgRef: RefObject<SVGSVGElement>;
  readonly svgSize: SvgSize;
  readonly graphLine: ReturnType<typeof getGraphLineWithHighlightLevel>;
  // readonly size?: MEBType['size'];
}
export interface GraphSVGProps extends CommonSVGProps {
}
export interface LineSVGProps extends CommonSVGProps {
}
export type SetStateType<T> = Dispatch<SetStateAction<T>>;
