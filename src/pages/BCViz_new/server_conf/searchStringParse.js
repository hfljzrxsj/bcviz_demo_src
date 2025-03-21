//@ts-check
const initVertexs = ['0'];
/**
 * @param {string} vertexsStr 
 * @returns {ReadonlyArray<string>}
 */
const parseVertexs = (vertexsStr) => {
  /**@type {ReadonlyArray<[number,number]>} */
  const vertexsArr = JSON.parse(vertexsStr);
  if (!Array.isArray(vertexsArr) || vertexsArr.length === 0) {
    return initVertexs;
  }
  /**@type {ReadonlyArray<[number,number]>} */
  const vertexsArrWithType = vertexsArr;
  return [vertexsArrWithType.length, ...vertexsArrWithType.flat()].map(i => i.toString());
};
/**
 * @param {string} query 
 * @returns {ReadonlyArray<string>}
 */
const searchStringParse = (query) => {
  /**@type {ReadonlyArray<[string,string]>} */
  //@ts-expect-error
  const splitArr = query.split('&').map(i => i.split('='));
  const map = new Map(splitArr);
  const dataset = map.get('dataset');
  const BCviz_file = map.get('BCviz_file');
  const problem_type = map.get('problem_type');
  const s = map.get('s');
  const t = map.get('t');
  const vertexs = map.get('vertexs');
  if (!(dataset && BCviz_file && problem_type && s && t)) {
    return [];
  }
  const vertexsArr = vertexs ? parseVertexs(vertexs) : initVertexs;
  return [dataset, BCviz_file, problem_type, s, t, ...vertexsArr];
};
