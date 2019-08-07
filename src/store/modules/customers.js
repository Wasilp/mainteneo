import i18n from '@/assets/i18n/i18n';
const fb = require('@/firebaseConfig.js');

export const state = {};

export const mutations = {};

export const actions = {
  /**
   * Create a new customer
   */
  createCustomer({ rootState }, payload) {
    const compId = rootState.userProfile.compId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompCustomersCollecRef = refrigCompRef.collection('customers');

    const recordMetadata = {
      lastUpdate: fb.fv.serverTimestamp(),
      lastUpdateByName: rootState.userProfile.userName,
      lastUpdateById: rootState.userProfile.userId,
      compName: rootState.userProfile.compName,
      compId: compId
    };

    const newCustomer = Object.assign(recordMetadata, payload);

    return refrigCompCustomersCollecRef.add(newCustomer);
  },
  /**
   * Edit existing customer
   */
  updateCustomer({ rootState }, payload) {
    const compId = rootState.userProfile.compId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const customersDocRef = refrigCompRef
      .collection('customers')
      .doc(payload.customerId);

    const recordMetadata = {
      lastUpdate: fb.fv.serverTimestamp(),
      lastUpdateByName: rootState.userProfile.userName,
      lastUpdateById: rootState.userProfile.userId,
      compName: rootState.userProfile.compName,
      compId: rootState.userProfile.compId
    };

    const updatedCustomer = Object.assign(
      {},
      payload.updatedCustomer,
      recordMetadata
    );

    return customersDocRef.update(updatedCustomer);
  },
  /**
   * Get a customer by ID
   */
  fetchCustomer({ rootState }, payload) {
    const compId = rootState.userProfile.compId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const customersDocRef = refrigCompRef
      .collection('customers')
      .doc(payload.customerId);

    return customersDocRef.get();
  },
  /**
   * Get all customers from a refrigerant company
   */
  fetchCustomers({ commit, rootState }, payload) {
    //RW Permissions
    const compId = rootState.userProfile.compId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompCustomersCollecRef = refrigCompRef.collection('customers');
    //Base Query
    let query = refrigCompCustomersCollecRef.where('compId', '==', compId);
    //Building query from payload.query: [[field, operator, value]]
    if (payload.query) {
      payload.query.forEach(element => {
        const field = element[0];
        const operator = element[1];
        const value = element[2];
        query = query.where(field, operator, value);
      });
    }
    return query.get();
  },
  fetchGroups({ rootState }) {
    const compId = rootState.userProfile.compId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompGroupDocRef = refrigCompRef
      .collection('customerGroups')
      .doc('groups');

    return refrigCompGroupDocRef.get();
  },
  updateGroups({ rootState }, payload) {
    const compId = rootState.userProfile.compId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompGroupDocRef = refrigCompRef
      .collection('customerGroups')
      .doc('groups');

    return refrigCompGroupDocRef.set({ groupNames: payload }, { merge: true });
  }
};