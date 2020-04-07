import i18n from '@/assets/i18n/i18n';
import { resolve } from 'url';
const fb = require('@/firebaseConfig.js');

export const state = {};

export const mutations = {};

export const actions = {
  /**
   * Create a new installation
   */
  createInstallation({ commit, rootState }, payload) {
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompCustomerInstallationCollecRef = refrigCompRef.collection(
      'customerInstallations'
    );

    //Il est capital, pour des raisons de access rights en écriture que l'objetc qui est écrit en DB
    // ait une property compId qui soit celle du user. Les règles de sécurité (access rights)
    // vérifient que un certain user ne prus créer des objetcs que pour la company à laquelle il est attaché.

    const recordMetadata = {
      lastUpdate: fb.fv.serverTimestamp(),
      lastUpdateByName: rootState.userProfile.userName,
      lastUpdateById: rootState.userProfile.userId,
      compName: rootState.userProfile.compName,
      compId: rootState.userProfile.compId
    };

    const newInstallation = Object.assign(recordMetadata, payload);

    return new Promise((resolve, reject) => {
      refrigCompCustomerInstallationCollecRef
        .add(newInstallation)
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id);
          resolve(docRef.id);
        })
        .catch(error => {
          console.error('Error adding document: ', error);
          reject(erro);
        });
    });
  },
  /**
   * Edit existing installation
   */
  updateInstallation({ commit, rootState }, payload) {
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const customersDocRef = refrigCompRef
      .collection('customers')
      .doc(payload.customerId);

    //Il est capital, pour des raisons de access rights en écriture que l'objetc qui est écrit en DB
    // ait une property compId qui soit celle du user. Les règles de sécurité (access rights)
    // vérifient que un certain user ne prus créer des objetcs que pour la company à laquelle il est attaché.

    const recordMetadata = {
      lastUpdate: fb.fv.serverTimestamp(),
      lastUpdateByName: rootState.userProfile.userName,
      lastUpdateById: rootState.userProfile.userId,
      compName: rootState.userProfile.compName,
      compId: rootState.userProfile.compId
    };
    const updatedCustomer = Object.assign(
      recordMetadata,
      payload.updatedCustomer
    );

    return new Promise((resolve, reject) => {
      customersDocRef.set(updatedCustomer).then(function(error) {
        if (error) {
          console.error('Error updating document: ', error);
          reject(error);
        } else {
          resolve(payload.customerId);
          console.log('update successful');
        }
      });
    });
  },
  /**
   * Get a installation by ID
   */
  fetchInstallation({ commit, rootState }, payload) {
    //RW Permissions
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const installationDocRef = refrigCompRef
      .collection('customerInstallations')
      .doc(payload.installationId);

    return new Promise((resolve, reject) => {
      installationDocRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            let installation = doc.data();
            installation.id = doc.id;
            resolve(installation);
          } else {
            console.log('No such document!');
            resolve(null);
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
          reject(error);
        });
    });
  },
  /**
   * Get all installations
   */
  fetchInstallations({ commit, rootState }, payload) {
    //RW Permissions
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompCustomerInstallationsCollecRef = refrigCompRef.collection(
      'customerInstallations'
    );
    //Base Query
    let query = refrigCompCustomerInstallationsCollecRef.where(
      'compId',
      '==',
      compId
    );
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
  }
};
