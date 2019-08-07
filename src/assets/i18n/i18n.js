import Vue from 'vue';
import VueI18n from 'vue-i18n';

import en from './versions/en';
import fr from './versions/fr';
import nl from './versions/nl';

Vue.use(VueI18n);

const messages = {
	en: en,
	fr: fr,
	nl: nl
};

let lng;
if (localStorage.getItem('mainteneo-userProfile') !== null) {
	const userProfileFromLocalStorage = JSON.parse(
		localStorage.getItem('mainteneo-userProfile')
	);
	lng = userProfileFromLocalStorage.lng || 'en';
} else {
	lng = 'en';
}

const i18n = new VueI18n({
	locale: lng,
	fallbackLocale: 'en',
	messages
});

export default i18n;
