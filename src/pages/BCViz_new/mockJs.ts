import { parseTableData, parseGraphDataSuper } from "../BCviz/FileUpload";

// import { } from 'mockjs';
export const mockText = () => `dataset path: xa
mple.txt
BCviz_file: D:xample_cohesion.txt
print a maximum biclique:
size=6
U: 0 2 3
V: 2 3`;

export const getSuperDataPromise = () => Promise.all([
  fetch('writer.supervertex'),
  fetch('writer.superedge'),
]).then(res => res.map(i => i.text())).then(arr => Promise.all(arr)).then(async ([tableData, graghData]) => {
  if (!tableData || !graghData) {
    return {};
  }
  return ({
    tableData: parseTableData(tableData),
    graphData: parseGraphDataSuper(graghData)
  });
});
export type SuperDataType = Awaited<ReturnType<typeof getSuperDataPromise>>;