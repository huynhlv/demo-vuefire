// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import VueLoading from 'vuejs-loading-plugin'

Vue.use(VueLoading)

Vue.config.productionTip = false

let app;
var config = {
  apiKey: "AIzaSyB4NlFaJMJSl5XAQ4YqhjM51dBwGrUy4gU",
  authDomain: "fir-firebase-cbb03.firebaseapp.com",
  databaseURL: "https://fir-firebase-cbb03.firebaseio.com",
  projectId: "fir-firebase-cbb03",
  storageBucket: "fir-firebase-cbb03.appspot.com",
  messagingSenderId: "581892390565",
  appId: "1:581892390565:web:be67a3e06e2124ab02974c"
};

firebase.initializeApp(config);

window.firebase=firebase;

/* eslint-disable no-new */
firebase.auth().onAuthStateChanged((user)=>{
  if(!app){
    app= new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    });
  }
});
