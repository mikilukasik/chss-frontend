const dbName = "chss-db";
const version = 1;

type Indexes = { [key: string]: string[] };

type Stores = {
  [key: string]: {
    keyPath?: string;
    indexes?: Indexes;
  };
};

const stores: Stores = {
  users: {
    indexes: { id: ["id"], name: ["name"], idAndName: ["id", "name"] },
  },
  activeGames: {
    indexes: { id: ["id"], idAndPlayers: ["id", "wPlayer", "bPlayer"] },
  },
  activeGameFens: {
    indexes: { id: ["id"], idGameAndIndex: ["id", "game", "index"] },
  },
};

const defaultIndexes = { id: ["id"] } as Indexes;

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
  Object.keys(stores).forEach((storeName) => {
    const { keyPath = "id", indexes = defaultIndexes } = stores[storeName];

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
        stores[this.storeName].indexes || defaultIndexes
      ).find((indexKey) => {
        return Object.keys(condition).reduce(
          (p, conditionKey) =>
            p &&
            (stores[this.storeName].indexes || defaultIndexes)[
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
        (stores[this.storeName].indexes || defaultIndexes)[indexToUse].map(
          (key: string) => condition[key] || ""
        )
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

      const addRequest = objectStore.add(data);

      addRequest.onsuccess = (event) => {
        resolve(event);
      };

      addRequest.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}

export const localDb = Object.keys(stores).reduce((p, c) => {
  p[c] = new LocalDb({ storeName: c });
  return p;
}, {} as Record<string, LocalDb>);
