<template>
  <div id="app">
    <router-view></router-view>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
.content-title {
  color: #5071b6;
  font-family: "Roboto", sans-serif;
  font-size: 38px;
  font-style: normal;
  font-weight: 900;
  line-height: 60px;
  border-left-color: #00afc5;
  border-left-width: 8px;
  border-left-style: solid;
  padding-left: 12px;
}

.content-small-title {
  color: #5071b6;
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  font-weight: 300;
  letter-spacing: normal;
  line-height: 36px;
  font-style: normal;
  border-left-color: #00afc5;
  border-left-width: 6px;
  border-left-style: solid;
  padding-left: 8px;
  margin-bottom: 26px;
}

.datatable-topbar-button {
  padding-top: 2px;
  padding-bottom: 14px;
}

.selected {
  background-color: blue;
  cursor: pointer;
}
</style>
