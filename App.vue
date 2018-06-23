
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"></router-link>
    <transition name="fade"> <router-view></router-view> </transition>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
/*.v-enter{*/
    /*opacity: 0;*/
  /*}*/
  /*.v-enter-to{*/
    /*opacity: 1;*/
  /*}*/
  /*.v-enter-active{*/
    /*transition:opacity 1s linear;*/
  /*}*/
   /*.v-leave{*/
    /*opacity: 1;*/
  /*}*/
  /*.v-leave-to{*/
    /*opacity: 0;*/
  /*}*/
  /*.v-leave-active{*/
    /*transition:opacity 1s linear;*/
  /*}*/

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
