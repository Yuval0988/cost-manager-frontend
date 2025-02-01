/**
 * IndexedDB wrapper library for cost management application
 * Provides Promise-based interface for database operations
 * @module idb
 */

/**
 * Opens or creates a costs database
 * @param {string} dbName - Name of the database
 * @param {number} version - Database version
 * @returns {Promise<Object>} Database interface object
 */
export const openCostsDB = async (dbName = 'costsdb', version = 1) => {
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
        // Create indexes for efficient querying
        store.createIndex('category', 'category');
        store.createIndex('date', 'date');
        store.createIndex('month', 'month');
        store.createIndex('year', 'year');
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve({
        /**
         * Adds a new cost item to the database
         * @param {Object} cost - Cost item details
         * @param {number} cost.sum - Amount spent
         * @param {string} cost.category - Cost category
         * @param {string} cost.description - Cost description
         * @param {string} [cost.date] - ISO date string (defaults to current date)
         * @returns {Promise<number>} ID of the new cost item
         */
        addCost: (cost) => {
          return new Promise((resolve, reject) => {
            const tx = db.transaction('costs', 'readwrite');
            const store = tx.objectStore('costs');

            // Add month and year for easier querying
            const date = new Date(cost.date || new Date());
            const item = {
              ...cost,
              date: date.toISOString(),
              month: date.getMonth() + 1,
              year: date.getFullYear()
            };

            const request = store.add(item);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);

            // Handle transaction completion
            tx.oncomplete = () => {
              console.log('Transaction completed: Cost added successfully');
            };
            tx.onerror = () => {
              console.error('Transaction error:', tx.error);
              reject(tx.error);
            };
          });
        },

        /**
         * Gets costs for a specific month and year
         * @param {number} month - Month (1-12)
         * @param {number} year - Year
         * @returns {Promise<Array>} Array of cost items
         */
        getCostsByMonth: (month, year) => {
          return new Promise((resolve, reject) => {
            const tx = db.transaction('costs', 'readonly');
            const store = tx.objectStore('costs');
            const request = store.openCursor();
            const costs = [];

            request.onsuccess = (event) => {
              const cursor = event.target.result;
              if (cursor) {
                const cost = cursor.value;
                if (cost.month === month && cost.year === year) {
                  costs.push(cost);
                }
                cursor.continue();
              } else {
                // Sort by date for consistent display
                costs.sort((a, b) => new Date(a.date) - new Date(b.date));
                resolve(costs);
              }
            };
            request.onerror = () => reject(request.error);
          });
        },

        /**
         * Gets costs grouped by category for a specific month and year
         * @param {number} month - Month (1-12)
         * @param {number} year - Year
         * @returns {Promise<Object>} Object with categories as keys and total sums as values
         */
        getCostsByCategory: async (month, year) => {
          try {
            const costs = await db.getCostsByMonth(month, year);
            return costs.reduce((acc, cost) => {
              acc[cost.category] = (acc[cost.category] || 0) + cost.sum;
              return acc;
            }, {});
          } catch (error) {
            console.error('Error getting costs by category:', error);
            throw error;
          }
        },

        /**
         * Gets all costs from the database
         * @returns {Promise<Array>} Array of all cost items
         */
        getAllCosts: () => {
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
};

// Export for use in React components
export default { openCostsDB };
