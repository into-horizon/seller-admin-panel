import React from 'react'
import Summary from './views/finance/amouts/Summary'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/pages/profile/Profile'))
const AddProduct = React.lazy(() => import('./views/product/AddProduct'))
const Products = React.lazy(() => import('./views/product/Products'))
const UpdateProduct = React.lazy(() => import('./views/product/UpdateProducts'))
const Settings = React.lazy(() => import('./views/pages/settings/Settings'))
const PendingOrders = React.lazy(() => import('./views/orders/pending/PendingOrders'))
const OrdersOverview = React.lazy(() => import('./views/orders/overview/OrderOverView'))
const Pdf = React.lazy(() => import('./components/PdfView'))
const Statement = React.lazy(() => import('./views/finance/statement/Statement'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/product', name: 'Products', component: Products , exact: true},
  { path: '/product/add', name: 'addProduct', component: AddProduct , approved: true },
  { path: '/product/products', name: 'myProducts', component: Products , approved: true},
  { path: '/product/updateProduct', name: 'updateProduct', component: UpdateProduct , role: 'storeOwner', approved: true},
  { path: '/settings', name: 'Settings', component: Settings , exact: true},
  { path: '/order', name: 'Order', component: PendingOrders, exact: true},
  { path: '/order/pendingOrders', name: 'Pending Orders', component: PendingOrders},
  { path: '/order/overview', name: 'Orders Overview', component: OrdersOverview},
  { path: '/pdf', name: 'pdf', component: Pdf},
  { path: '/finance', name: 'Finance', component: Statement},
  { path: '/finance/statement', name: 'Statements', component: Statement},
  { path: '/finance/summary', name: 'Summary', component: Summary}
 

]

export default routes
