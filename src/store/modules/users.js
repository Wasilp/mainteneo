import i18n from '@/assets/i18n/i18n';
const fb = require('@/firebaseConfig.js');

export const state = {};

export const mutations = {};

export const actions = {
  createUserCreationRequest({ rootState }, payload) {
    const requestsCollecRef = fb.db.collection('userCreationRequests');

    const recordMetadata = {
      requestCreationDate: fb.fv.serverTimestamp(),
      requesterName: rootState.userProfile.userName,
      requesterId: rootState.userProfile.userId
    };

    const newRequest = Object.assign(recordMetadata, payload);

    return requestsCollecRef.add(newRequest);
  },
  /**
   * Get user by ID
   */
  fetchUser({ commit, rootState }, payload) {
    //RW Permissions
    const compId = rootState.userProfile.compId;
    const userRef = fb.db.collection('users').doc(payload.userId);

    return new Promise((resolve, reject) => {
      userRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            let user = doc.data();
            user.id = doc.id;
            resolve(user);
          } else {
            console.log('No such document!');
            resolve(null);
          }
        })
        .catch(function(error) {
          reject(error);
          console.log('Error getting document:', error);
        });
    });
  },

  /**
   * Get all users
   */
  fetchUsers({ commit, rootState }, payload) {
    //RW Permissions
    const compId = rootState.userProfile.compId;
    const usersRef = fb.db.collection('users');
    //Base Query
    let query = usersRef.where('compId', '==', compId);
    //Building query from payload.query: [[field, operator, value]]
    if (payload.query) {
      payload.query.forEach(element => {
        const field = element[0];
        const operator = element[1];
        const value = element[2];
        query = query.where(field, operator, value);
      });
    }
    return new Promise((resolve, reject) => {
      query
        .get()
        .then(querySnapshot => {
          let usersArray = [];
          querySnapshot.forEach(doc => {
            let user = doc.data();
            user.id = doc.id;
            usersArray.push(user);
          });
          resolve(usersArray);
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
          resject(error);
        });
    });
  },
   
  /**
   * Web auth request
   */
  webAuthRequest(countryCode, phoneNumber) {
    var webAuthRequestFunction = fb.functions.httpsCallable('webAuthRequest');
    const data = {
      countryCode : countryCode,
      phoneNumber : phoneNumber
    }
    return new Promise((resolve, reject) => {
      webAuthRequestFunction(data)
      .then(function(result) {
        // Read result of the Cloud Function.
        resolve(result.data);
      }).catch(function(error) {
        // Getting the Error details.
        reject(error);
      });
    });
  }
};
