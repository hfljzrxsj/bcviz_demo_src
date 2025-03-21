import axios from "axios";
import type { ReadonlyBasicArray } from ".";

export const mockFetch = () => axios.get<ReadonlyBasicArray<[string, number]>>('./BCviz/1.json').then(({ data }) => data);