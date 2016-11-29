const {App} = require('./app');

const app = new App({
  el: '#app'
});

window.app = app;

window.onload = () => {
  app.init();
};
