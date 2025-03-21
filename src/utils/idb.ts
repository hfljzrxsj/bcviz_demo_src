const { error } = console;
export interface IndexedDBProps {
  readonly DBname: string;
  readonly version?: number;
  readonly storeName: string;
  readonly mode?: IDBTransactionMode;
  readonly keyPath?: IDBObjectStoreParameters['keyPath'];  //主键
}
interface IndexedDBCreateProps extends IndexedDBProps {
  readonly data?: unknown;
  readonly IDBValidKey?: IDBValidKey;
}
export interface IndexedDBGetProps extends IndexedDBProps {
  readonly query?: Parameters<IDBObjectStore['get']>[0];
}

const IDBDatabaseAddEventListener = (result: IDBDatabase) => {
  result.addEventListener('abort', (e) => {
    result.close();
    error('abort', e);
  });
  result.addEventListener('close', (e) => {
    result.close();
    error('close', e);
  });
  result.addEventListener('error', (e) => {
    result.close();
    error('error', e);
  });
  result.addEventListener('versionchange', (e) => {
    result.close();
    error('versionchange', e);
  });
  return result;
};
const IDBTransactionAddEventListener = (result: IDBDatabase, transaction: IDBTransaction) => {
  transaction.addEventListener('complete', () => {
    // transaction.commit();
    result.close();
  });
  transaction.addEventListener('abort', (e) => {
    transaction.abort();
    result.close();
    error('abort', e);
  });
  transaction.addEventListener('error', (e) => {
    transaction.abort();
    result.close();
    error('error', e);
  });
  return transaction;
};

const getIDBObjectStoreAsync = (args: IndexedDBProps) => new Promise<IDBObjectStore>(async (resolve, reject) => {
  const {
    DBname,
    version,
    storeName,
    keyPath,
    mode,
  } = args;
  // const oldVersion = await indexedDB.databases().then(databases => databases.filter(({ name }) => DBname === name)[0]?.version) ?? 0;
  const request = indexedDB.open(DBname, version);
  request.addEventListener('success', () => {
    const result = IDBDatabaseAddEventListener(request.result);
    if (result.objectStoreNames.contains(storeName)) {
      return resolve(IDBTransactionAddEventListener(result, result.transaction(storeName, mode, { 'durability': 'strict' })).objectStore(storeName));
    }
  });
  request.addEventListener('upgradeneeded', () => {
    /*
      新建createObjectStore有两种办法：
      1. 每次都操作都更新版本号
      2. 只在createObjectStore时，获取上一个版本，然后打开新版本数据库
    */
    const result = IDBDatabaseAddEventListener(request.result);
    if (result.objectStoreNames.contains(storeName)) {
      return;
    } else {
      return result.createObjectStore(storeName, {
        autoIncrement: true,
        ...(keyPath ? {
          keyPath
        } : null),
      });
    }
  });
  request.addEventListener('error', (e) => {
    reject(e);
    error('error', e, request);
  });
  request.addEventListener('blocked', (e) => {
    reject(e);
    error('blocked', e, request);
  });
}).catch(error);

const createOrAddIdb = (args: IndexedDBCreateProps) => {
  const {
    IDBValidKey,
    data
  } = args;
  return getIDBObjectStoreAsync({
    ...args,
    mode: 'readwrite',
  }).then(objectStore => {
    if (objectStore && data) {
      // const addRequest =
      objectStore.add(
        ...[
          data,
          ...(objectStore.keyPath
            ? []
            : [IDBValidKey])
        ]).addEventListener('error', error);
      // addRequest.addEventListener('success', () => {
      //   addRequest.source
      // });
      // addRequest.addEventListener('error', e => {
      //   error(e, addRequest);
      // });
    }
    return objectStore;
  }, error
  ).catch(error);
};

// (typeof args['keyPath']) extends undefined ? T[] : 
const getIdb = async <T = unknown> (args: IndexedDBGetProps): Promise<T | undefined> => new Promise((resolve, reject) => {
  const { query } = args;
  return getIDBObjectStoreAsync({
    ...args,
    mode: 'readonly',
  }).then(objectStore => {
    if (objectStore) {
      const getRequest = query ? objectStore.get(query) : objectStore.getAll();
      getRequest.addEventListener('success', () => {
        resolve(getRequest.result);
      });
      getRequest.addEventListener('error', e => {
        error(e, getRequest);
        reject(getRequest.error);
      });
    }
    return objectStore;
  }, reject
  ).catch(reject);
});
const delAllDB = () => indexedDB.databases().then(databases => databases.filter(({ name }) => name).map(({ name }) => name ? indexedDB.deleteDatabase(name) : new IDBOpenDBRequest()), error).catch(error);

export { createOrAddIdb, getIdb, delAllDB };

// const getIDBDatabase = (request: IDBOpenDBRequest) => {
//   const { result } = request;
//   return IDBDatabaseAddEventListener(result);
// };
// const getTransaction = (result: IDBDatabase, storeNames: Parameters<IDBDatabase['transaction']>[0] = (result.name || result.objectStoreNames)) => {
//   const transaction = result.transaction(storeNames, 'readwrite', { 'durability': 'strict' });
//   return IDBTransactionAddEventListener(result, transaction);
// };
// const getObjectStoreSync = (request: IDBOpenDBRequest, {
//   storeName,
//   keyPath,
// }: IndexedDBProps) => {
//   const result = IDBDatabaseAddEventListener(request.result);
//   if (result.objectStoreNames.contains(storeName)) {
//     return IDBTransactionAddEventListener(result, result.transaction(storeName, 'readwrite', { 'durability': 'strict' })).objectStore(storeName);
//   } else {
//     // console.log(request, result);
//     // indexedDB.databases().then(databases => databases.filter(result.name));
//     return result.createObjectStore(storeName, {
//       autoIncrement: true,
//       ...(keyPath ? {
//         keyPath
//       } : {}),
//     });
//   }
// };
// const getObjectStoreAsync = (request: IDBOpenDBRequest, args: IndexedDBProps) => new Promise<IDBObjectStore>(async (resolve, reject) => {
//   const {
//     DBname,
//     storeName,
//     keyPath,
//   } = args;
//   const result = IDBDatabaseAddEventListener(request.result);
//   const { objectStoreNames, version: newVersion } = result;
//   if (objectStoreNames.contains(storeName)) {
//     return resolve(IDBTransactionAddEventListener(result, result.transaction(storeName, 'readwrite', { 'durability': 'strict' })).objectStore(storeName));
//   } else {
//     // return indexedDB.databases().then(databases => databases.filter(({ name }) => DBname === name)[0]?.version).then((oldVersion = 0) => {
//     //   // console.log(request, oldVersion, newVersion);
//     //   // if (newVersion === oldVersion) {
//     //   //   result.close();
//     //   //   return getIDBObjectStoreAsync({ ...args, version: (oldVersion ?? newVersion) + 1 }).then(objectStore => objectStore ? resolve(objectStore) : reject(result), reject).catch(error);
//     //   // }
//     //   return resolve(result.createObjectStore(storeName, {
//     //     autoIncrement: true,
//     //     ...(keyPath ? {
//     //       keyPath
//     //     } : {}),
//     //   }));
//     // }, reject).catch(error);
//     return resolve(result.createObjectStore(storeName, {
//       autoIncrement: true,
//       ...(keyPath ? {
//         keyPath
//       } : {}),
//     }));
//   }
// });