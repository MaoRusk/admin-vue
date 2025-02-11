import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import i18next from '@/i18n'
import DefaultLayout from '@/layouts/DefaultLayout'

import { ROUTE_NAMES } from './routeNames'
import { AUTH_TOKEN } from '../constants'

import EmployeeDetalle from '@/views/operations/employees/EmployeeDetalle.vue'
import PolicyDetail from '@/views/operations/policies/PolicyDetail.vue'
import PendingApprovals from '@/views/operations/buildings/PendingApprovals.vue'
import Buildings from '@/views/operations/buildings/Buildings.vue'
import Login from '@/views/pages/Login.vue'
import Users from '@/views/operations/users/Users.vue'
import UserDetail from '@/views/operations/users/UserDetail.vue'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/operations',
        name: ROUTE_NAMES.OPERATIONS,
        meta: {
          requiresAuth: true,
          label: 'Operations',
        },
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: 'policies',
            name: ROUTE_NAMES.POLICIES,
            component: () => import('@/views/operations/policies/Policies.vue'),
          },
          {
            path: 'policy/:id',
            name: ROUTE_NAMES.POLICY_DETAIL,
            component: PolicyDetail,
            props: true,
          },
          {
            path: '/operations/companies',
            name: ROUTE_NAMES.COMPANIES,
            component: () => import('@/views/operations/companies/Companies.vue'),
          },
          {
            path: '/operations/company/:id',
            name: ROUTE_NAMES.COMPANY_DETAIL,
            component: () => import('@/views/operations/companies/CompanyDetail.vue'),
            props: (route) => ({
              id: Number(route.params.id),
            }),
          },
          {
            path: '/operations/employees',
            name: 'Employees',
            component: () => import('@/views/operations/employees/Employees.vue'),
          },
          {
            path: '/operations/employee/:id',
            name: 'EmployeeDetalle',
            component: EmployeeDetalle,
            props: true,
          },
          {
            path: '/operations/market-size',
            name: ROUTE_NAMES.BUILDINGS,
            component: Buildings,
          },
          {
            path: '/operations/market-size/create',
            name: ROUTE_NAMES.BUILDINGS_CREATE,
            component: () => import('@/views/operations/buildings/BuildingDetalle.vue'),
          },
          {
            path: '/operations/market-size/:buildingId/edit',
            name: ROUTE_NAMES.BUILDINGS_UPDATE,
            component: () => import('@/views/operations/buildings/BuildingDetalle.vue'),
          },
          {
            path: 'buildings/pending-approvals',
            name: 'PendingApprovals',
            component: PendingApprovals,
          },
          {
            path: 'industrial-parks',
            name: ROUTE_NAMES.INDUSTRIAL_PARKS,
            component: () => import('@/views/operations/industrial-parks/IndustrialParks.vue'),
          },
          {
            path: 'industrial-parks/:id',
            name: ROUTE_NAMES.INDUSTRIAL_PARKS_DETAIL,
            component: () => import('@/views/operations/industrial-parks/IndustrialParkDetail.vue'),
            props: true,
          },
          {
            path: '/seguridad',
            name: 'Seguridad',
            meta: { requiresAuth: true },
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: 'users',
                name: ROUTE_NAMES.USERS,
                component: Users,
                meta: {
                  requiresAuth: true,
                },
              },
              {
                path: 'users/create',
                name: ROUTE_NAMES.USERS_CREATE,
                component: UserDetail,
                props: { id: 0 }, // Para nuevo usuario
                meta: {
                  requiresAuth: true,
                },
              },
              {
                path: 'users/:id',
                name: ROUTE_NAMES.USERS_UPDATE,
                component: UserDetail,
                props: true,
                meta: {
                  requiresAuth: true,
                },
              },
            ],
          },
          {
            path: 'industries',
            name: ROUTE_NAMES.INDUSTRIES,
            component: () => import('@/views/operations/industries/Industries.vue'),
            meta: {
              requiresAuth: true,
              label: 'Industries',
            },
          },
          {
            path: 'industry/create',
            name: ROUTE_NAMES.INDUSTRY_CREATE,
            component: () => import('@/views/operations/industries/IndustryDetail.vue'),
            meta: {
              requiresAuth: true,
              label: 'Create Industry',
            },
          },
          {
            path: 'industry/:id',
            name: ROUTE_NAMES.INDUSTRY_UPDATE,
            component: () => import('@/views/operations/industries/IndustryDetail.vue'),
            props: true,
            meta: {
              requiresAuth: true,
              label: 'Edit Industry',
            },
          },
          {
            path: 'developers',
            name: ROUTE_NAMES.DEVELOPERS,
            component: () => import('@/views/operations/developers/Developers.vue'),
            meta: {
              requiresAuth: true,
              label: 'Developers',
            },
          },
          {
            path: 'developer/create',
            name: ROUTE_NAMES.DEVELOPERS_CREATE,
            component: () => import('@/views/operations/developers/DeveloperDetalle.vue'),
            meta: {
              requiresAuth: true,
              label: 'Create Developer',
            },
          },
          {
            path: 'developer/:id',
            name: ROUTE_NAMES.DEVELOPERS_UPDATE,
            component: () => import('@/views/operations/developers/DeveloperDetalle.vue'),
            props: true,
            meta: {
              requiresAuth: true,
              label: 'Edit Developer',
            },
          },
          {
            path: 'tenants',
            name: 'Tenants',
            component: () => import('@/views/operations/tenants/Tenants.vue'),
          },
          {
            path: 'tenants/:id',
            name: 'TenantDetail',
            component: () => import('@/views/operations/tenants/TenantDetail.vue'),
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
