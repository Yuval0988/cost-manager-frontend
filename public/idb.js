/**
 * IndexedDB wrapper library for cost management application (Vanilla JS Version)
 * Global object for direct browser usage
 */

const idb = {
  /**
   * Opens or creates a costs database
   * @param {string} dbName - Name of the database
   * @param {number} version - Database version
   * @returns {Promise<Object>} Database interface object
   */
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
          /**
           * Adds a new cost item to the database
           * @param {Object} cost - Cost item with sum, category, and description
           * @returns {Promise<number>} ID of the new cost item
           */
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
          },

          /**
           * Gets all costs from the database
           * @returns {Promise<Array>} Array of cost items
           */
          getAllCosts: function() {
            return new Promise((resolve, reject) => {
              const tx = db.transaction('costs', 'readonly');
              const store = tx.objectStore('costs');
              const request = store.getAll();

              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
          }
        });
      };
    });
  }
};

// Make available globally for vanilla JS usage
if (typeof window !== 'undefined') {
  window.idb = idb;
}
