import Vue from 'vue';
import Vuex from 'vuex';
import i18n from '@/assets/i18n/i18n';
import * as tanks from '@/store/modules/tanks.js';
import * as customers from '@/store/modules/customers.js';
import * as users from '@/store/modules/users.js';
import * as installations from '@/store/modules/installations.js';
import * as interventions from '@/store/modules/interventions.js';

const fb = require('../firebaseConfig');

Vue.use(Vuex);

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if (user) {
    console.log('[Store.js] Auth Changed: '+user.email)
    store.commit('SET_CURRENT_USER', user);
    store.dispatch('fetchUserProfile');
  }
  else 
    console.log('[Store.js] Auth changed user null')
});

export const store = new Vuex.Store({
  modules: {
    tanks,
    customers,
    users,
    installations,
    interventions
  },
  state: {
    drawer: null,
    currentUser: null,
    userProfile: {}
  },
  getters: {
    drawer: state => state.drawer
  },
  actions: {
    fetchUserProfile({ commit, state }) {
      const userId = state.currentUser.uid;
      let getUserProfileFromLocalStorage = true;
      if (localStorage.getItem('mainteneo-userProfile') === null) {
        getUserProfileFromLocalStorage = false;
      } else {
        const userProfileFromLocalStorage = JSON.parse(
          localStorage.getItem('mainteneo-userProfile')
        );
        if (userId === userProfileFromLocalStorage.userId) {
          commit('SET_USER_PROFILE', userProfileFromLocalStorage);
        } else {
          getUserProfileFromLocalStorage = false;
        }
      }
      if (!getUserProfileFromLocalStorage) {
        fb.usersCollection
          .doc(state.currentUser.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              const userProfileObj = Object.assign(doc.data(), {
                userId: doc.id
              });
              const userProfileParsed = JSON.stringify(userProfileObj);
              localStorage.setItem('mainteneo-userProfile', userProfileParsed);
              commit('SET_USER_PROFILE', userProfileObj);
            } else {
              //TODO: treat error
              console.log('No such document!');
            }
          })
          .catch(err => {
            //TODO: treat error
            console.log(err);
          });
      }
    },
    fetchVehicles({ rootState }) {
      const compId = rootState.userProfile.compId;
      const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
      const refrigCompVehicleDocRef = refrigCompRef
        .collection('vehicles')
        .doc('vehicleNames');

      return refrigCompVehicleDocRef.get();
    },
    updateVehicles({ rootState }, payload) {
      const compId = rootState.userProfile.compId;
      const refrigCompRef = fb.db.collection('refrigCompanies').doc(compId);
      const refrigCompVehicleDocRef = refrigCompRef
        .collection('vehicles')
        .doc('vehicleNames');

      return refrigCompVehicleDocRef.update({
        names: payload
      });
    }
  },
  mutations: {
    SET_DRAWER(state, val) {
      state.drawer = val;
    },
    SET_CURRENT_USER(state, val) {
      state.currentUser = val;
    },
    SET_USER_PROFILE(state, val) {
      state.userProfile = val;
      i18n.locale = val.lng;
    }
  }
});
