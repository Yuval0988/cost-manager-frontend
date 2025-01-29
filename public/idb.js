const idb = {
  openCostsDB: async function(dbName, version) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onerror = () => {
        reject(request.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('costs')) {
          const store = db.createObjectStore('costs', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          store.createIndex('category', 'category');
          store.createIndex('date', 'date');
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        resolve({
          addCost: function(cost) {
            return new Promise((resolve, reject) => {
              const tx = db.transaction('costs', 'readwrite');
              const store = tx.objectStore('costs');

              const item = {
                ...cost,
                date: new Date().toISOString()
              };

              const addRequest = store.add(item);

              addRequest.onsuccess = () => resolve(addRequest.result);
              addRequest.onerror = () => reject(addRequest.error);
            });
          }
        });
      };
    });
  }
};
