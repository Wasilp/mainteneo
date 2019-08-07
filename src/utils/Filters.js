import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm');
  }
});

Vue.filter('formatDateDaysOnly', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY');
  }
});

Vue.filter('formatTimeStamp', function(value) {
  if (value) {
    return moment(value).format('DD/MM/YYYY HH:mm');
  }
});
