import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { store } from './store/store';

//Error pages
import NotFound from './views/NotFound';
import Error from './views/Error';
import Deny from './views/Deny';

Vue.use(Router);

function loadView(view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);
}

const router = new Router({
    linkExactActiveClass: "selected",
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
      meta: {
        public: true
      }
    },
    {
      path: '/403',
      name: 'Deny',
      component: Deny,
      meta: {
        public: true
      }
    },
    {
      path: '/500',
      name: 'Error',
      component: Error,
      meta: {
        public: true
      }
    },
    {
      path: '/',
      redirect: {
        path: '/dashboard'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: loadView('Login')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: loadView('Dashboard'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/allTanks',
      name: 'AllTanks',
      component: loadView('AllTanks'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/availableTanks',
      name: 'AvailableTanks',
      component: loadView('AvailableTanks'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/toSupplierTanks',
      name: 'ToSupplierTanks',
      component: loadView('ToSupplierTanks'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/takenTanks',
      name: 'TakenTanks',
      component: loadView('TakenTanks'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/onSiteTanks',
      name: 'OnSiteTanks',
      component: loadView('OnSiteTanks'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tank/:id',
      name: 'Tank',
      component: loadView('Tank'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/interventions',
      name: 'Interventions',
      component: loadView('Interventions'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/intervention/:installationId/:id',
      name: 'Intervention',
      component: loadView('Intervention'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/installations',
      name: 'Installations',
      component: loadView('Installations'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/installation/:id',
      name: 'Installation',
      component: loadView('Installation'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/addInstallation',
      name: 'AddInstallation',
      component: loadView('AddInstallation'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/customers',
      name: 'Customers',
      component: loadView('Customers'),
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/customer/:id',
      name: 'Customer',
      component: loadView('Customer'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/addCustomer',
      name: 'AddCustomer',
      component: loadView('AddCustomer'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/editCustomer/:id',
      name: 'EditCustomer',
      component: loadView('EditCustomer'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/employees',
      name: 'Employees',
      component: loadView('Employees'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/employee/:id',
      name: 'Employee',
      component: loadView('Employee'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/gasAccountByTank',
      name: 'GasAccountByTank',
      component: loadView('GasAccountByTank'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/contactSupport',
      name: 'ContactSupport',
      component: loadView('ContactSupport'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/vehicles',
      name: 'Vehicles',
      component: loadView('Vehicles'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/adminActions',
      name: 'AdminActions',
      component: loadView('CreateUser'),
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;
  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
