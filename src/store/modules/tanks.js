import i18n from '@/assets/i18n/i18n';
const fb = require('@/firebaseConfig.js');

export const state = {};

export const mutations = {};

export const actions = {
  /**
   * Get tank by ID
   */
  fetchTank({ commit, rootState }, payload) {
    //RW Permissions
    // console.log(payload.tankId)
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const tanksDocRef = refrigCompRef.collection('tanksLive').doc(payload.tankId);

    return new Promise((resolve, reject) => {
      tanksDocRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            let tank = doc.data();
            tank.id = doc.id;
            resolve(tank);
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
   * Get all tanks
   */
  fetchMyTanks({ commit, rootState }, payload) {
    const compId = rootState.userProfile.refrigCompanyId;
    const userId = rootState.userProfile.userId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompTanksCollecRef = refrigCompRef.collection('tanksLive');
    // const tanksDocRef = refrigCompRef.collection('tanks').doc(tankId);

    //Base Query
    let query = refrigCompTanksCollecRef.where('refrigCompanyId', '==', compId);
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
          let tanksArray = [];
          querySnapshot.forEach(doc => {
            let tank = doc.data();
            tank.id = doc.id;
            tanksArray.push(tank);
          });
          resolve(tanksArray);
        })
        .catch(error => {
          console.log('Error getting documents: ', error);
          reject(error);
        });
    });
  },
  /**
   * Get tank events
   */
  fetchTankEvents({ commit, rootState }, payload) {
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const tankHistoryCollecRef = refrigCompRef.collection('tanksHistory');

    //Base Query
    let query = tankHistoryCollecRef.where('refrigCompanyId', '==', compId);
    //Building query from payload.query: [[field, operator, value]]
    if (payload.query) {
      payload.query.forEach(element => {
        const field = element[0];
        console.log(field,'field')
        const operator = element[1];
        console.log(operator,'operator')
        const value = element[2];
        console.log(value,'value')
        query = query.where(field, operator, value);
      });
    }
    return new Promise((resolve, reject) => {
      query
        .get()
        .then(querySnapshot => {
          let tankEventsArray = [];
          querySnapshot.forEach(doc => {
            let tankEvent = doc.data();
            tankEvent.id = doc.id;
            tankEventsArray.push(tankEvent);
          });
          console.log(tankEventsArray ,'tankEVENTS ARRAYYYYAYYAYAYAA')
          resolve(tankEventsArray);
        })
        .catch(error => {
          console.log('Error getting documents: ', error);
          reject(error);
        });
    });
  },
  releaseTanks({ rootState }, payload) {
    //The payload contains the tanks objects to be deleted

    const refrigCompRef = fb.db
      .collection('refrigCompanies')
      .doc(rootState.userProfile.refrigCompanyId);
    const refrigCompTanksCollecRef = refrigCompRef.collection('tanksLive');
    const refrigCompTankHistoryCollecRef = refrigCompRef.collection(
      'tanksHistory'
    );

    if (!Array.isArray(payload)) {
      return new Promise((resolve, reject) => {
        reject('Technical error. Please contact Mainteneo support');
      });
    } else {
      if (payload.length == 0) {
        return new Promise((resolve, reject) => {
          reject(i18n.t('views.tanks.toReturn.errors.noTankSelected'));
        });
      } else {
        let batch = fb.db.batch();

        payload.forEach(tank => {
          //We delete the tank doc
          batch.delete(refrigCompTanksCollecRef.doc(tank.id));
          //We create a new tankHistory doc
          const newTankHistoryDocRef = refrigCompTankHistoryCollecRef.doc();

          const newTankHistoryDoc = {
            tankId: tank.id,
            allTanksTankId: tank.allTanksTankId,
            sN: tank.sN,
            currentQr: tank.currentQr,
            refrigerant: tank.refrigerant,
            capacity: tank.capacity,
            quantity: tank.quantity,
            actionType: 5,
            actionDate: fb.fv.serverTimestamp(),
            actionById: rootState.userProfile.userId,
            actionByName: rootState.userProfile.userName,
            compName: rootState.userProfile.compName,
            compId: rootState.userProfile.compId
          };

          batch.set(newTankHistoryDocRef, newTankHistoryDoc);
        });

        return batch.commit();
      }
    }
  }
};
