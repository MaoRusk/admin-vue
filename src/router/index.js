import { createRouter, createWebHashHistory } from 'vue-router'

import { ROUTE_NAMES } from './routeNames'
import { AUTH_TOKEN } from '../constants'

import DefaultLayout from '@/layouts/DefaultLayout'
import Login from '@/views/pages/Login.vue'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: DefaultLayout,
    redirect: { name: ROUTE_NAMES.DASHBOARD },
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/views/dashboard/Dashboard.vue'),
      },

      {
        path: 'security',
        name: ROUTE_NAMES.SECURITY,
        redirect: { name: ROUTE_NAMES.USERS },
        children: [
          {
            path: 'users',
            name: ROUTE_NAMES.USERS,
            component: () => import('@/views/security/users/Users.vue'),
          },
          {
            path: 'users/create',
            name: ROUTE_NAMES.USERS_CREATE,
            component: () => import('@/views/security/users/UserDetail.vue'),
            props: { id: 0 },
          },
          {
            path: 'users/:id/edit',
            name: ROUTE_NAMES.USERS_UPDATE,
            component: () => import('@/views/security/users/UserDetail.vue'),
            props: true,
          },
          {
            path: 'roles',
            name: ROUTE_NAMES.ROLES,
            component: () => import('@/views/security/roles/Roles.vue'),
          },
          {
            path: 'roles/create',
            name: ROUTE_NAMES.ROLES_CREATE,
            component: () => import('@/views/security/roles/RoleDetail.vue'),
            props: { id: 0 },
          },
          {
            path: 'roles/:id',
            name: ROUTE_NAMES.ROLES_UPDATE,
            component: () => import('@/views/security/roles/RoleDetail.vue'),
            props: true,
          },
          {
            path: 'policies',
            name: ROUTE_NAMES.POLICIES,
            component: () => import('@/views/security/policies/Policies.vue'),
          },
          {
            path: 'policy/:id',
            name: ROUTE_NAMES.POLICY_DETAIL,
            component: () => import('@/views/security/policies/PolicyDetail.vue'),
            props: true,
          },
        ],
      },

      {
        path: 'catalogs',
        name: ROUTE_NAMES.CATALOGS,
        redirect: { name: ROUTE_NAMES.INDUSTRIAL_PARKS },
        children: [
          {
            path: 'industrial-parks',
            name: ROUTE_NAMES.INDUSTRIAL_PARKS,
            component: () => import('@/views/catalogs/industrial-parks/IndustrialParks.vue'),
          },
          {
            path: 'industrial-parks/:id',
            name: ROUTE_NAMES.INDUSTRIAL_PARKS_DETAIL,
            component: () => import('@/views/catalogs/industrial-parks/IndustrialParkDetail.vue'),
            props: true,
          },
          {
            path: 'companies',
            name: ROUTE_NAMES.COMPANIES,
            component: () => import('@/views/catalogs/companies/Companies.vue'),
          },
          {
            path: 'company/:id',
            name: ROUTE_NAMES.COMPANY_DETAIL,
            component: () => import('@/views/catalogs/companies/CompanyDetail.vue'),
            props: (route) => ({
              id: Number(route.params.id),
            }),
          },
          {
            path: 'industries',
            name: ROUTE_NAMES.INDUSTRIES,
            component: () => import('@/views/catalogs/industries/Industries.vue'),
          },
          {
            path: 'industry/create',
            name: ROUTE_NAMES.INDUSTRY_CREATE,
            component: () => import('@/views/catalogs/industries/IndustryDetail.vue'),
            meta: {
              label: 'Create Industry',
            },
          },
          {
            path: 'industry/:id',
            name: ROUTE_NAMES.INDUSTRY_UPDATE,
            component: () => import('@/views/catalogs/industries/IndustryDetail.vue'),
            props: true,
            meta: {
              label: 'Edit Industry',
            },
          },
          {
            path: 'developers',
            name: ROUTE_NAMES.DEVELOPERS,
            component: () => import('@/views/catalogs/developers/Developers.vue'),
          },
          {
            path: 'developer/create',
            name: ROUTE_NAMES.DEVELOPERS_CREATE,
            component: () => import('@/views/catalogs/developers/DeveloperDetalle.vue'),
            meta: {
              label: 'Create Developer',
            },
          },
          {
            path: 'developer/:id',
            name: ROUTE_NAMES.DEVELOPERS_UPDATE,
            component: () => import('@/views/catalogs/developers/DeveloperDetalle.vue'),
            props: true,
            meta: {
              label: 'Edit Developer',
            },
          },
          {
            path: 'tenants',
            name: ROUTE_NAMES.TENANTS_INDEX,
            component: () => import('@/views/catalogs/tenants/Tenants.vue'),
          },
          {
            path: 'tenants/:id',
            name: ROUTE_NAMES.TENANTS_DETAIL,
            component: () => import('@/views/catalogs/tenants/TenantDetail.vue'),
          },
          {
            path: '/operations/reits',
            name: ROUTE_NAMES.REITS,
            component: () => import('@/views/operations/reits/Reits.vue'),
            meta: {
              requiresAuth: true,
              label: 'REITs',
            },
          },
          {
            path: '/operations/reits/create',
            name: ROUTE_NAMES.REITS_CREATE,
            component: () => import('@/views/operations/reits/ReitDetail.vue'),
            meta: {
              requiresAuth: true,
              label: 'Create REIT',
            },
          },
          {
            path: '/operations/reits/:id',
            name: ROUTE_NAMES.REITS_UPDATE,
            component: () => import('@/views/operations/reits/ReitDetail.vue'),
            props: true,
            meta: {
              requiresAuth: true,
              label: 'Edit REIT',
            },
          },
        ],
      },

      {
        path: 'operations',
        name: ROUTE_NAMES.OPERATIONS,
        redirect: { name: ROUTE_NAMES.BUILDINGS },
        children: [
          {
            path: 'market-size',
            name: ROUTE_NAMES.BUILDINGS,
            component: () => import('@/views/operations/buildings/Buildings.vue'),
          },
          {
            path: 'market-size/create',
            name: ROUTE_NAMES.BUILDINGS_CREATE,
            component: () => import('@/views/operations/buildings/BuildingDetalle.vue'),
          },
          {
            path: 'market-size/:buildingId/edit',
            name: ROUTE_NAMES.BUILDINGS_UPDATE,
            component: () => import('@/views/operations/buildings/BuildingDetalle.vue'),
          },
          {
            path: 'lands',
            name: ROUTE_NAMES.LANDS_INDEX,
            component: () => import('@/views/operations/lands/LandsIndex.vue'),
          },
          {
            path: 'lands/create',
            name: ROUTE_NAMES.LANDS_CREATE,
            component: () => import('@/views/operations/lands/LandsDetail.vue'),
          },
          {
            path: 'lands/:landId/edit',
            name: ROUTE_NAMES.LANDS_UPDATE,
            component: () => import('@/views/operations/lands/LandsDetail.vue'),
          },
          {
            path: 'pending-approvals',
            name: ROUTE_NAMES.MARKET_SIZE_PENDING_APPROVALS,
            component: () => import('@/views/operations/buildings/PendingApprovals.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: Login,
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
