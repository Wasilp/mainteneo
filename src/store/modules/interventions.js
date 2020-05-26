import i18n from '@/assets/i18n/i18n';
import UTIL from '@/utils/Utils.js';
const fb = require('@/firebaseConfig.js');

export const state = {};

export const mutations = {};

export const actions = {
  /**
   * Get all interventions from a refrigerant company
   */
  fetchCustomerInstallationHistory({ commit, rootState }, payload) {
    //RW Permissions
    const compId = rootState.userProfile.refrigCompanyId;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
    const refrigCompCustomerInstallationHistoryCollecRef = refrigCompRef.collection('interventions');

    //Base Query
    let query = refrigCompCustomerInstallationHistoryCollecRef.where('createdByrefrigCompanyId','==',compId);
    let groupByKey;
    //Building query from payload.query: [[field, operator, value]]

    // NEED TO FIX WHERE CONDITIONS

    // if (payload.query) {
    //   payload.query.forEach(element => {
    //     const field = element[0];
    //     if (field == 'groupBy') {
    //       groupByKey = element[1];
    //     } else {
    //       const operator = element[1];
    //       const value = element[2];
    //       query = query.where(field, operator, value);
    //     }
    //   });
    // }
    return new Promise((resolve, reject) => {
      query
        .get()
        .then(querySnapshot => {
          let customerInstallationHistoryArray = [];
          querySnapshot.forEach(doc => {

            let customerInstallationHistory = doc.data();
            customerInstallationHistory.id = doc.id;
            customerInstallationHistoryArray.push(customerInstallationHistory);
          });
          // if (groupByKey) {
          //   let arrayNew = UTIL.groupBy(
          //     customerInstallationHistoryArray,
          //     groupByKey
          //   );
          //   resolve(arrayNew);
          // } else {

            resolve(customerInstallationHistoryArray);
          // }
        })
        .catch(function(error) {
          console.log('Error getting documents: ', error);
          reject(error);
        });
    });
  },
  uploadFile({ rootState }, payload) {
    //payload is an object with the following properties:
    //file
    //interventionId
    const compId = rootState.userProfile.refrigCompanyId;
    const compName = rootState.userProfile.refrigCompanyName;
    const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);

    const refrigCompInterventionFilesCollection = refrigCompRef.collection(
      'interventionsFile'
    );

    const interventionId = payload.interventionId;
    const file = payload.file;
    const fileName = file.name;

    const storageRef = fb.storage.ref();
    const fileRef = storageRef.child(
      compId + '/' + interventionId + '/' + fileName
    );

    return fileRef
      .put(file)
      .then(uploadTaskSnapshot => {
        return uploadTaskSnapshot.ref.getDownloadURL();
        //return compId + '/' + interventionId + '/' + fileName;
      })
      .then(downloadURL => {
        return refrigCompInterventionFilesCollection.add({
          downloadURL: downloadURL,
          fileName: fileName,
          fileExtension: fileName.split('.').pop(),
          interventionId: interventionId,
          uploadDate: fb.fv.serverTimestamp(),
          uploadedByName: rootState.userProfile.userName,
          uploadedById: rootState.userProfile.userId,
          compName: compName,
          compId: compId
        });
      })
      .catch(error => {
        console.log(error.code);
      });
  }
};
