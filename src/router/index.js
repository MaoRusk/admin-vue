import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import i18next from '@/i18n'
import DefaultLayout from '@/layouts/DefaultLayout'

import { ROUTE_NAMES } from './routeNames'
import { AUTH_TOKEN } from '../constants'

import EmployeeDetalle from '../views/operacion/employees/EmployeeDetalle.vue'
import PolizaDetalle from '../views/operacion/polizas/PolizaDetalle.vue'
import PendingApprovals from '../views/operacion/buildings/PendingApprovals.vue'
import Buildings from '@/views/operacion/buildings/Buildings.vue'
import Login from '../views/pages/Login.vue'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        meta: { requiresAuth: true },
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/views/dashboard/Dashboard.vue'),
      },
      {
        path: '/operacion',
        name: ROUTE_NAMES.OPERATIONS,
        meta: { requiresAuth: true },
        children: [
          {
            path: '/operacion/polizas',
            name: 'Polizas',
            component: () => import('@/views/operacion/polizas/Polizas.vue'),
          },
          {
            path: '/operacion/poliza/:id', // Nueva ruta para PolizaDetalle
            name: 'PolizaDetalle',
            component: PolizaDetalle,
            props: true, // Permitir pasar parámetros como props
          },

          {
            path: '/operacion/empresas',
            name: 'Empresas',
            component: () => import('@/views/operacion/empresas/Empresas.vue'),
          },
          {
            path: '/operacion/empresa/:id',
            name: 'Empresa Detalle',
            component: () => import('@/views/operacion/empresas/EmpresaDetalle.vue'),
            props: true,
          },

          {
            path: '/operacion/employees',
            name: 'Employees',
            component: () => import('@/views/operacion/employees/Employees.vue'),
          },
          {
            path: '/operacion/employee/:id',
            name: 'EmployeeDetalle',
            component: EmployeeDetalle,
            props: true,
          },
          {
            path: '/operacion/buildings',
            name: ROUTE_NAMES.BUILDINGS,
            component: Buildings,
          },
          {
            path: '/operacion/building/create',
            name: ROUTE_NAMES.BUILDINGS_CREATE,
            component: () => import('@/views/operacion/buildings/BuildingDetalle.vue'),
          },
          {
            path: '/operacion/building/:buildingId/edit',
            name: ROUTE_NAMES.BUILDINGS_UPDATE,
            component: () => import('@/views/operacion/buildings/BuildingDetalle.vue'),
          },
          {
            path: 'buildings/pending-approvals',
            name: 'PendingApprovals',
            component: PendingApprovals,
          },
          {
            path: '/operacion/industries',
            name: 'Industries',
            component: () => import('../views/operacion/industries/Industries.vue'),
            meta: {
              requiresAuth: true
            }
          },
          {
            path: '/operacion/industries/:id',
            name: 'IndustryDetail',
            component: () => import('../views/operacion/industries/IndustryDetail.vue'),
            meta: {
              requiresAuth: true
            }
          },
        ],
      },
      {
        path: '/theme',
        meta: { requiresAuth: true },
        name: () => i18next.t('theme'),
        redirect: '/theme/typography',
      },
      {
        path: '/theme/colors',
        meta: { requiresAuth: true },
        name: () => i18next.t('colors'),
        component: () => import('@/views/theme/Colors.vue'),
      },
      {
        path: '/theme/typography',
        meta: { requiresAuth: true },
        name: () => i18next.t('typography'),
        component: () => import('@/views/theme/Typography.vue'),
      },
      {
        path: '/base',
        meta: { requiresAuth: true },
        name: () => i18next.t('base'),
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/base/breadcrumbs',
        children: [
          {
            path: '/base/accordion',
            meta: { requiresAuth: true },
            name: 'Accordion',
            component: () => import('@/views/base/Accordion.vue'),
          },
          {
            path: '/base/breadcrumbs',
            meta: { requiresAuth: true },
            name: 'Breadcrumbs',
            component: () => import('@/views/base/Breadcrumbs.vue'),
          },
          {
            path: '/base/cards',
            meta: { requiresAuth: true },
            name: 'Cards',
            component: () => import('@/views/base/Cards.vue'),
          },
          {
            path: '/base/carousels',
            meta: { requiresAuth: true },
            name: 'Carousels',
            component: () => import('@/views/base/Carousels.vue'),
          },
          {
            path: '/base/collapses',
            meta: { requiresAuth: true },
            name: 'Collapses',
            component: () => import('@/views/base/Collapses.vue'),
          },
          {
            path: '/base/list-groups',
            meta: { requiresAuth: true },
            name: 'List Groups',
            component: () => import('@/views/base/ListGroups.vue'),
          },
          {
            path: '/base/navs',
            meta: { requiresAuth: true },
            name: 'Navs',
            component: () => import('@/views/base/Navs.vue'),
          },
          {
            path: '/base/paginations',
            meta: { requiresAuth: true },
            name: 'Paginations',
            component: () => import('@/views/base/Paginations.vue'),
          },
          {
            path: '/base/placeholders',
            meta: { requiresAuth: true },
            name: 'Placeholders',
            component: () => import('@/views/base/Placeholders.vue'),
          },
          {
            path: '/base/popovers',
            meta: { requiresAuth: true },
            name: 'Popovers',
            component: () => import('@/views/base/Popovers.vue'),
          },
          {
            path: '/base/progress',
            name: 'Progress',
            component: () => import('@/views/base/Progress.vue'),
          },
          {
            path: '/base/spinners',
            name: 'Spinners',
            component: () => import('@/views/base/Spinners.vue'),
          },
          {
            path: '/base/tables',
            name: 'Tables',
            component: () => import('@/views/base/Tables.vue'),
          },
          {
            path: '/base/tooltips',
            name: 'Tooltips',
            component: () => import('@/views/base/Tooltips.vue'),
          },
        ],
      },
      {
        path: '/buttons',
        name: () => i18next.t('buttons'),
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/buttons/standard-buttons',
        children: [
          {
            path: '/buttons/standard-buttons',
            name: 'Buttons',
            component: () => import('@/views/buttons/Buttons.vue'),
          },
          {
            path: '/buttons/dropdowns',
            name: 'Dropdowns',
            component: () => import('@/views/buttons/Dropdowns.vue'),
          },
          {
            path: '/buttons/button-groups',
            name: 'Button Groups',
            component: () => import('@/views/buttons/ButtonGroups.vue'),
          },
        ],
      },
      {
        path: '/forms',
        name: () => i18next.t('forms'),
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/forms/form-control',
        children: [
          {
            path: '/forms/form-control',
            name: 'Form Control',
            component: () => import('@/views/forms/FormControl.vue'),
          },
          {
            path: '/forms/select',
            name: 'Select',
            component: () => import('@/views/forms/Select.vue'),
          },
          {
            path: '/forms/multi-select',
            name: 'Multi Select',
            component: () => import('@/views/forms/MultiSelect.vue'),
          },
          {
            path: '/forms/checks-radios',
            name: 'Checks & Radios',
            component: () => import('@/views/forms/ChecksRadios.vue'),
          },
          {
            path: '/forms/range',
            name: 'Range',
            component: () => import('@/views/forms/Range.vue'),
          },
          {
            path: '/forms/input-group',
            name: 'Input Group',
            component: () => import('@/views/forms/InputGroup.vue'),
          },
          {
            path: '/forms/floating-labels',
            name: 'Floating Labels',
            component: () => import('@/views/forms/FloatingLabels.vue'),
          },
          {
            path: '/forms/date-picker',
            name: 'Date Picker',
            component: () => import('@/views/forms/DatePicker.vue'),
          },
          {
            path: '/forms/date-range-picker',
            name: 'Date Range Picker',
            component: () => import('@/views/forms/DateRangePicker.vue'),
          },
          {
            path: '/forms/time-picker',
            name: 'Time Picker',
            component: () => import('@/views/forms/TimePicker.vue'),
          },
          {
            path: '/forms/layout',
            name: 'Layout',
            component: () => import('@/views/forms/Layout.vue'),
          },
          {
            path: '/forms/validation',
            name: 'Validation',
            component: () => import('@/views/forms/Validation.vue'),
          },
        ],
      },
      {
        path: '/charts',
        name: () => i18next.t('charts'),
        component: () => import('@/views/charts/Charts.vue'),
      },
      {
        path: '/icons',
        name: () => i18next.t('icons'),
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/icons/coreui-icons',
        children: [
          {
            path: '/icons/coreui-icons',
            name: 'CoreUI Icons',
            component: () => import('@/views/icons/CoreUIIcons.vue'),
          },
          {
            path: '/icons/brands',
            name: 'Brands',
            component: () => import('@/views/icons/Brands.vue'),
          },
          {
            path: '/icons/flags',
            name: 'Flags',
            component: () => import('@/views/icons/Flags.vue'),
          },
        ],
      },
      {
        path: '/notifications',
        name: () => i18next.t('notifications'),
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/notifications/alerts',
        children: [
          {
            path: '/notifications/alerts',
            name: 'Alerts',
            component: () => import('@/views/notifications/Alerts.vue'),
          },
          {
            path: '/notifications/badges',
            name: 'Badges',
            component: () => import('@/views/notifications/Badges.vue'),
          },
          {
            path: '/notifications/modals',
            name: 'Modals',
            component: () => import('@/views/notifications/Modals.vue'),
          },
          {
            path: '/notifications/toasts',
            name: 'Toasts',
            component: () => import('@/views/notifications/Toasts.vue'),
          },
        ],
      },
      {
        path: '/widgets',
        name: () => i18next.t('widgets'),
        component: () => import('@/views/widgets/Widgets.vue'),
      },
      {
        path: '/smart-table',
        name: 'Smart Table',
        component: () => import('@/views/smart-table/SmartTable.vue'),
      },
      {
        path: '/calendar',
        name: () => i18next.t('calendar'),
        component: () => import('@/views/plugins/Calendar.vue'),
      },
      {
        path: 'apps',
        name: () => i18next.t('apps'),
        redirect: '/apps/invoicing/invoice',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'invoicing',
            redirect: '/apps/invoicing/invoice',
            name: 'Invoicing',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: 'invoice',
                name: 'Invoice',
                component: () => import('@/views/apps/invoicing/Invoice.vue'),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
  {
    path: '/apps/email',
    redirect: '/apps/email/inbox',
    name: 'Email',
    component: () => import('@/views/apps/email/EmailApp.vue'),
    children: [
      {
        path: 'compose',
        name: 'Compose',
        component: () => import('@/views/apps/email/Compose.vue'),
      },
      {
        path: 'inbox',
        name: 'Inbox',
        component: () => import('@/views/apps/email/Inbox.vue'),
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/apps/email/Message.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem(AUTH_TOKEN)

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: ROUTE_NAMES.LOGIN })
  } else {
    next()
  }
})

export default router
