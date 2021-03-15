import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '../views/SellerPage'
import TrendPage from '@/views/TrendPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/seller-page',
    component: SellerPage
  }, {
    path: '/trend-page',
    component: TrendPage
  }
]

const router = new VueRouter({
  routes
})

export default router
