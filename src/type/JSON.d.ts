type Arr = ReadonlyArray<Arr> | ReadonlyArray<number> | ReadonlyArray<string> | ReadonlyArray<boolean> | ReadonlyArray<Obj>;
type Obj = { readonly [x in string]: Obj | number | string | boolean | Arr };
export declare type Json = Arr | Obj;
type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue; };
