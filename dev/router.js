import Vue from 'vue'
import VueRouter from 'vue-router'

import pages from './pages'

Vue.use(VueRouter)

function load (component) {
  return () => import(`./components/${component}.vue`)
}

function component (path) {
  return {
    path: '/' + path.slice(0, path.length - 4),
    component: () => import(`./components/${path}`)
  }
}

let routes = [
  {path: '/', component: load('index')},
  {
    path: '/lay',
    component: load('web-tests/layout'),
    children: [
      {path: 'a', component: load('web-tests/a')},
      {path: 'b', component: load('web-tests/b')},
      {path: 'c', component: load('web-tests/c')}
    ]
  },
  {
    path: '/layout-quick',
    component: load('new-layout/new-layout'),
    children: [
      {path: '', redirect: 'default'},
      {path: 'default', component: load('new-layout/pages/default')},
      {path: 'a', component: load('new-layout/pages/a')},
      {path: 'b', component: load('new-layout/pages/b')},
      {path: 'c', component: load('new-layout/pages/c')}
    ]
  }
]

pages.forEach(page => {
  routes.push(component(page))
})

routes.push({path: '*', component: load('error404')})

export default new VueRouter({
  // mode: 'history',
  routes // ,
  /*
  scrollBehavior (to, from, savedPosition) {
    let position = { x: 0, y: 0 }
    // Keep scroll position when using browser buttons
    if (savedPosition) {
      position = savedPosition
    }

    // Workaround for transitions scrolling to the top of the page
    // However, there are still some problems being fixed by the vue team
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(position)
      }, 1000)
    })
  }
  */
  /*
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      // Keep scroll position when using browser buttons
      return savedPosition
    }
    else {
      return { x: 0, y: 0 }
    }
  }
  */
})
