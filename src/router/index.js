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
            path: 'brokers',
            name: ROUTE_NAMES.BROKERS_INDEX,
            component: () => import('@/views/catalogs/brokers/Brokers.vue'),
            meta: {
              requiresAuth: true,
              label: 'Brokers',
            },
          },
          {
            path: 'brokers/create',
            name: ROUTE_NAMES.BROKERS_CREATE,
            component: () => import('@/views/catalogs/brokers/BrokerDetail.vue'),
            props: { id: 0 },
            meta: {
              requiresAuth: true,
              label: 'Create Broker',
            },
          },
          {
            path: 'brokers/:id',
            name: ROUTE_NAMES.BROKERS_UPDATE,
            component: () => import('@/views/catalogs/brokers/BrokerDetail.vue'),
            props: true,
            meta: {
              requiresAuth: true,
              label: 'Edit Broker',
            },
          },
          {
            path: 'reits',
            name: ROUTE_NAMES.REITS,
            component: () => import('@/views/catalogs/reits/Reits.vue'),
            meta: {
              requiresAuth: true,
              label: 'REITs',
            },
          },
          {
            path: 'reits/create',
            name: ROUTE_NAMES.REITS_CREATE,
            component: () => import('@/views/catalogs/reits/ReitDetail.vue'),
            meta: {
              requiresAuth: true,
              label: 'Create REIT',
            },
          },
          {
            path: 'reits/:id',
            name: ROUTE_NAMES.REITS_UPDATE,
            component: () => import('@/views/catalogs/reits/ReitDetail.vue'),
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

          {
            path: 'reit-annual',
            name: ROUTE_NAMES.REIT_ANNUAL_INDEX,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualIndex.vue'),
          },
          {
            path: 'reit-annual/create',
            name: ROUTE_NAMES.REIT_ANNUAL_CREATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
          },
          {
            path: 'reit-annual/:reitAnnualId/edit',
            name: ROUTE_NAMES.REIT_ANNUAL_UPDATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
          },

          {
            path: 'reit-quarter',
            name: ROUTE_NAMES.REIT_QUARTER_INDEX,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualIndex.vue'),
          },
          {
            path: 'reit-quarter/create',
            name: ROUTE_NAMES.REIT_QUARTER_CREATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
          },
          {
            path: 'reit-quarter/:reitAnnualId/edit',
            name: ROUTE_NAMES.REIT_QUARTER_UPDATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
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
