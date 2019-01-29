import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NewPad from './views/NewPad.vue'
import Index from './views/Index.vue'
import Game from './views/Game.vue'
import Callback from './views/Callback.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: 'Chatto Pad - Home'
      }
    },
    {
      path: '/new',
      name: 'new',
      component: NewPad,
      meta: {
        title: 'Chatto Pad - New'
      }
    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
      meta: {
        title: 'Chatto Pad'
      }
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
      meta: {
        title: 'Chatto Pad'
      }
    },
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        title: 'Chatto Pad'
      }
    }
  ]
})
