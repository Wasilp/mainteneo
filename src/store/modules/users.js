import i18n from '@/assets/i18n/i18n';
import UTIL from "@/utils/Utils.js";
const fb = require('@/firebaseConfig.js');

const USERS_COLLECTON = 'users';
const PENDINGWEBAUTHREQUESTS_COLLECTION = 'pendingWebAuthRequests'

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
    const userRef = fb.db.collection(USERS_COLLECTON).doc(payload.userId);

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
    const usersRef = fb.db.collection(USERS_COLLECTON);
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
    const requestUniqueKey = UTIL.getUniqueID();
    const data = {
      requestUniqueKey : requestUniqueKey,
      countryCode : countryCode,
      phoneNumber : phoneNumber
    }
    return new Promise((resolve, reject) => {
      webAuthRequestFunction(data)
      .then(function(result) {
        //listen for change
        // Read result of the Cloud Function.
        const requestId = result.data.requestId;
        var unsubscribe = fb.db.collection(PENDINGWEBAUTHREQUESTS_COLLECTION).doc(requestId)
          .onSnapshot((doc) => {
            let pendingWebAuthRequest = doc.data();
            if(pendingWebAuthRequest)
              if(pendingWebAuthRequest.authorized === true){
                if(pendingWebAuthRequest.token){
                  resolve({status:'success', message: 'Successfully authenticate', token: pendingWebAuthRequest.token})
                  unsubscribe();
                }else{
                  resolve({status:'error', message: 'Something failed please try again'})  
                  unsubscribe();
                  return;
                }
              }else if(pendingWebAuthRequest.authorized === false){                            
                resolve({status:'error', message: 'You are not authorized to login with this number'})
                unsubscribe();
                return;
              }
          }, (error) => {
            reject(error);
            unsubscribe();
          });
      }).catch(function(error) {
        // Getting the Error details.
        reject(error);
        unsubscribe();
      });
    });
  }
};
