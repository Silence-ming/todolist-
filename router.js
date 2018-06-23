import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import aa from './views/aa.vue'
import login from '@/components/login.vue'
import reg from '@/components/reg.vue'
 import todo from '@/components/todolist'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'aa',
      component: aa,
      children:[{
          path: '/todo/:uid/:id',
          name: 'todo',
          component: todo
      }],
      beforeEnter(to,from,next){
        if(!sessionStorage['uname']){
          next('/login')
        }else{
          next()
        }
      }
    },
      {
      path: '/login',
      name: 'login',
      component: login
    },
      {
      path: '/reg',
      name: 'reg',
      component: reg
    }
  ]
})
