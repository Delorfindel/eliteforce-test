import "expo-sqlite/localStorage/install";

type StorageValue = string | null;

function createMemoryStorage() {
  const store = new Map<string, string>();

  return {
    getItem(key: string): StorageValue {
      return store.has(key) ? store.get(key) ?? null : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    }
  };
}

const fallbackStorage = createMemoryStorage();

const driver =
  typeof globalThis.localStorage !== "undefined"
    ? globalThis.localStorage
    : fallbackStorage;

export const uiStorage = {
  driver,
  getItem(key: string) {
    return driver.getItem(key);
  },
  setItem(key: string, value: string) {
    driver.setItem(key, value);
  },
  removeItem(key: string) {
    driver.removeItem(key);
  }
};
