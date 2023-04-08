const dbName = "chss-db";
const version = 5;

type Indexes = { [key: string]: string[] };

type Stores = {
  [key: string]: {
    keyPath?: string;
    indexes?: Indexes;
  };
};

const stores: Stores = {
  users: {
    indexes: { name: ["name"] },
  },
  games: {
    indexes: { players: ["wPlayer", "bPlayer"] },
  },
  fens: {
    indexes: { gameAndIndex: ["game", "index"] },
  },
};

const defaultIndexes = {
  id: ["id"],
  updateId: ["updateId"],
} as Indexes;
const defaultKeyPath = "id";

const expandedStores: Stores = Object.keys(stores).reduce((p, key) => {
  p[key] = {
    indexes: { ...defaultIndexes, ...stores[key].indexes },
  };
  return p;
}, {} as Stores);

let db: IDBDatabase;
const dbAwaiters = [] as ((db: IDBDatabase) => void)[];

const getDb: () => Promise<IDBDatabase> = () =>
  new Promise((r) => {
    if (db) return r(db);
    dbAwaiters.push(r);
  });

const request = indexedDB.open(dbName, version);

request.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;
  Object.keys(expandedStores).forEach((storeName) => {
    if (db.objectStoreNames.contains(storeName)) {
      db.deleteObjectStore(storeName);
    }

    const { keyPath = defaultKeyPath, indexes = defaultIndexes } =
      expandedStores[storeName];

    const store = db.createObjectStore(storeName, { keyPath });

    Object.keys(indexes).forEach((indexKey: string) => {
      store.createIndex(indexKey, indexes[indexKey]);
    });
  });
};

request.onsuccess = (event) => {
  db = (event.target as IDBOpenDBRequest).result;
  while (dbAwaiters.length) (dbAwaiters.pop() as (db: IDBDatabase) => void)(db);
};

request.onerror = (event) => {
  console.error(
    "Error opening database",
    (event.target as IDBOpenDBRequest).error
  );
};

class LocalDb {
  public storeName;
  constructor({ storeName }: { storeName: string }) {
    this.storeName = storeName;
  }

  public findAll(condition: Record<string, unknown>): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const transaction = (await getDb()).transaction(
        [this.storeName],
        "readonly"
      );

      const store = transaction.objectStore(this.storeName);

      const indexToUse = Object.keys(
        expandedStores[this.storeName].indexes || defaultIndexes
      ).find((indexKey) => {
        return Object.keys(condition).reduce(
          (p, conditionKey) =>
            p &&
            (expandedStores[this.storeName].indexes || defaultIndexes)[
              indexKey
            ].includes(conditionKey),
          true
        );
      });

      if (!indexToUse)
        throw new Error(
          `couldn't find suitable index in ${
            this.storeName
          } for condition ${JSON.stringify(condition)}`
        );

      const index = store.index(indexToUse);
      const range = IDBKeyRange.only(
        (expandedStores[this.storeName].indexes || defaultIndexes)[
          indexToUse
        ].map((key: string) => condition[key] || "")
      );

      const getRequest = index.openCursor(range);

      const results: unknown[] = [];

      getRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest)
          .result as IDBCursorWithValue;

        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          // Filter the results further if necessary
          const filteredResults = results.filter((result) =>
            Object.keys(condition).reduce(
              (p, key) =>
                p && condition[key] === (result as Record<string, any>)[key],
              true
            )
          );

          resolve(filteredResults);
        }
      };

      getRequest.onerror = (e) => reject(e);
    });
  }

  public insert(data: Record<string, unknown>) {
    return new Promise(async (resolve, reject) => {
      const transaction = (await getDb()).transaction(
        [this.storeName],
        "readwrite"
      );
      const objectStore = transaction.objectStore(this.storeName);

      const addRequest = objectStore.add({ ...data, updateId: "pending" });

      addRequest.onsuccess = (event) => {
        resolve(event);
      };

      addRequest.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error(
          `Error writing to ${this.storeName} indexedDB store.`,
          error,
          { data }
        );
        reject(error);
      };
    });
  }

  public update(data: Record<string, unknown>) {
    return new Promise(async (resolve, reject) => {
      const transaction = (await getDb()).transaction(
        [this.storeName],
        "readwrite"
      );
      const objectStore = transaction.objectStore(this.storeName);

      const addRequest = objectStore.put(data);

      addRequest.onsuccess = (event) => {
        resolve(event);
      };

      addRequest.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        console.error(
          `Error processing update in ${this.storeName} indexedDB store.`,
          error,
          { data }
        );
        reject(error);
      };
    });
  }
}

type DbUpdate = Record<string, { add: Record<string, any>[] }>;

export const localDb = Object.keys(expandedStores).reduce((p, c) => {
  p[c] = new LocalDb({ storeName: c });
  return p;
}, {} as Record<string, LocalDb>);

export const getDbUpdate = async (): Promise<DbUpdate> => {
  const dataToPush = {} as DbUpdate;

  for (const storeName of Object.keys(localDb)) {
    const rowsToAdd = await localDb[storeName].findAll({ updateId: "pending" });

    if (rowsToAdd && rowsToAdd.length) {
      dataToPush[storeName] = { add: rowsToAdd };
    }
  }

  return dataToPush;
};

export const processDbUpdateResult = async ({
  dbUpdate,
  updateResult,
}: {
  dbUpdate: DbUpdate;
  updateResult: { updateIds: Record<string, number> };
}) => {
  if (!dbUpdate || !updateResult) return;

  const { updateIds } = updateResult;

  for (const tableName of Object.keys(updateIds)) {
    for (const addedData of dbUpdate[tableName].add) {
      await localDb[tableName].update({
        ...addedData,
        updateId: updateIds[tableName],
      });
    }
  }
};
