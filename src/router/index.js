import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import Login from '@/views/pages/Login.vue'
import { useAuthStore } from '../stores/auth'
import { ROUTE_NAMES } from './routeNames'

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
        meta: {},
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
            meta: { requiredPermission: 'users.index' },
          },
          {
            path: 'users/create',
            name: ROUTE_NAMES.USERS_CREATE,
            component: () => import('@/views/security/users/UserDetail.vue'),
            props: { id: 0 },
            meta: { requiredPermission: 'users.create' },
          },
          {
            path: 'users/:id/edit',
            name: ROUTE_NAMES.USERS_UPDATE,
            component: () => import('@/views/security/users/UserDetail.vue'),
            props: true,
            meta: { requiredPermission: ['users.update', 'users.show'] },
          },
          {
            path: 'roles',
            name: ROUTE_NAMES.ROLES,
            component: () => import('@/views/security/roles/Roles.vue'),
            meta: { requiredPermission: 'roles.index' },
          },
          {
            path: 'roles/create',
            name: ROUTE_NAMES.ROLES_CREATE,
            component: () => import('@/views/security/roles/RoleDetail.vue'),
            props: { id: 0 },
            meta: { requiredPermission: 'roles.create' },
          },
          {
            path: 'roles/:id',
            name: ROUTE_NAMES.ROLES_UPDATE,
            component: () => import('@/views/security/roles/RoleDetail.vue'),
            props: true,
            meta: { requiredPermission: ['roles.update', 'roles.show'] },
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
            meta: { requiredPermission: 'industrial-parks.index' },
          },
          {
            path: 'industrial-parks/:id',
            name: ROUTE_NAMES.INDUSTRIAL_PARKS_DETAIL,
            component: () => import('@/views/catalogs/industrial-parks/IndustrialParkDetail.vue'),
            props: true,
            meta: {
              requiredPermission: [
                'industrial-parks.create',
                'industrial-parks.update',
                'industrial-parks.show',
              ],
            },
          },
          {
            path: 'companies',
            name: ROUTE_NAMES.COMPANIES_INDEX,
            component: () => import('@/views/catalogs/companies/Companies.vue'),
            meta: { requiredPermission: 'companies.index' },
          },
          {
            path: 'company/:id',
            name: ROUTE_NAMES.COMPANY_DETAIL,
            component: () => import('@/views/catalogs/companies/CompanyDetail.vue'),
            props: (route) => ({
              id: isNaN(Number(route.params.id)) ? '0' : Number(route.params.id),
            }),
            meta: {
              requiredPermission: ['companies.create', 'companies.update', 'companies.show'],
            },
          },
          {
            path: 'industries',
            name: ROUTE_NAMES.INDUSTRIES,
            component: () => import('@/views/catalogs/industries/Industries.vue'),
            meta: { requiredPermission: 'industries.index' },
          },
          {
            path: 'industry/create',
            name: ROUTE_NAMES.INDUSTRY_CREATE,
            component: () => import('@/views/catalogs/industries/IndustryDetail.vue'),
            meta: {
              label: 'Create Industry',
              requiredPermission: 'industries.create',
            },
          },
          {
            path: 'industry/:id',
            name: ROUTE_NAMES.INDUSTRY_UPDATE,
            component: () => import('@/views/catalogs/industries/IndustryDetail.vue'),
            props: true,
            meta: {
              label: 'Edit Industry',
              requiredPermission: ['industries.update', 'industries.show'],
            },
          },
          {
            path: 'developers',
            name: ROUTE_NAMES.DEVELOPERS,
            component: () => import('@/views/catalogs/developers/Developers.vue'),
            meta: { requiredPermission: 'developers.index' },
          },
          {
            path: 'developer/create',
            name: ROUTE_NAMES.DEVELOPERS_CREATE,
            component: () => import('@/views/catalogs/developers/DeveloperDetalle.vue'),
            meta: {
              label: 'Create Developer',
              requiredPermission: 'developers.create',
            },
          },
          {
            path: 'developers/:id',
            name: 'DeveloperDetail',
            component: () => import('@/views/catalogs/developers/DeveloperDetail.vue'),
            props: true,
            meta: {
              label: 'Edit Developer',
              requiredPermission: ['developers.update', 'developers.show'],
            },
          },
          {
            path: 'tenants',
            name: ROUTE_NAMES.TENANTS_INDEX,
            component: () => import('@/views/catalogs/tenants/Tenants.vue'),
            meta: { requiredPermission: 'tenants.index' },
          },
          {
            path: 'tenants/:id',
            name: ROUTE_NAMES.TENANTS_DETAIL,
            component: () => import('@/views/catalogs/tenants/TenantDetail.vue'),
            meta: {
              requiredPermission: ['tenants.create', 'tenants.update', 'tenants.show'],
            },
          },
          {
            path: 'brokers',
            name: ROUTE_NAMES.BROKERS_INDEX,
            component: () => import('@/views/catalogs/brokers/Brokers.vue'),
            meta: {
              requiredPermission: 'tenants.index',
              label: 'Brokers',
            },
          },
          {
            path: 'brokers/create',
            name: ROUTE_NAMES.BROKERS_CREATE,
            component: () => import('@/views/catalogs/brokers/BrokerDetail.vue'),
            props: { id: 0 },
            meta: {
              requiredPermission: 'tenants.create',
              label: 'Create Broker',
            },
          },
          {
            path: 'brokers/:id',
            name: ROUTE_NAMES.BROKERS_UPDATE,
            component: () => import('@/views/catalogs/brokers/BrokerDetail.vue'),
            props: true,
            meta: {
              requiredPermission: ['tenants.update', 'tenants.show'],
              label: 'Edit Broker',
            },
          },
          {
            path: 'reits',
            name: ROUTE_NAMES.REITS,
            component: () => import('@/views/catalogs/reits/Reits.vue'),
            meta: {
              requiredPermission: 'reits.index',
              label: 'REITs',
            },
          },
          {
            path: 'reits/create',
            name: ROUTE_NAMES.REITS_CREATE,
            component: () => import('@/views/catalogs/reits/ReitDetail.vue'),
            meta: {
              requiredPermission: 'reits.create',
              label: 'Create REIT',
            },
          },
          {
            path: 'reits/:id',
            name: ROUTE_NAMES.REITS_UPDATE,
            component: () => import('@/views/catalogs/reits/ReitDetail.vue'),
            props: true,
            meta: {
              requiredPermission: ['reits.update', 'tenants.show'],
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
            meta: { requiredPermission: 'buildings.index' },
          },
          {
            path: 'market-size/create',
            name: ROUTE_NAMES.BUILDINGS_CREATE,
            component: () => import('@/views/operations/buildings/BuildingDetalle.vue'),
            meta: { requiredPermission: 'buildings.create' },
          },
          {
            path: 'market-size/:buildingId/edit',
            name: ROUTE_NAMES.BUILDINGS_UPDATE,
            component: () => import('@/views/operations/buildings/BuildingDetalle.vue'),
            meta: { requiredPermission: ['buildings.update', 'buildings.show'] },
          },
          {
            path: 'lands',
            name: ROUTE_NAMES.LANDS_INDEX,
            component: () => import('@/views/operations/lands/LandsIndex.vue'),
            meta: { requiredPermission: 'lands.create' },
          },
          {
            path: 'lands/create',
            name: ROUTE_NAMES.LANDS_CREATE,
            component: () => import('@/views/operations/lands/LandsDetail.vue'),
            meta: { requiredPermission: 'lands.create' },
          },
          {
            path: 'lands/:landId/edit',
            name: ROUTE_NAMES.LANDS_UPDATE,
            component: () => import('@/views/operations/lands/LandsDetail.vue'),
            meta: { requiredPermission: ['lands.update', 'lands.show'] },
            props: true,
          },
          {
            path: 'pending-approvals',
            name: ROUTE_NAMES.MARKET_SIZE_PENDING_APPROVALS,
            component: () => import('@/views/operations/buildings/PendingApprovals.vue'),
          },
          {
            path: 'reit-mortgage',
            name: ROUTE_NAMES.REIT_MORTGAGE,
            component: () => import('@/views/operations/reits-mortgage/ReitMortgageIndex.vue'),
            meta: { requiredPermission: 'reit-mortgage.index' },
          },

          {
            path: 'reit-mortgage/create',
            name: ROUTE_NAMES.REIT_MORTGAGE_CREATE,
            component: () => import('@/views/operations/reits-mortgage/ReitMortgageDetail.vue'),
            meta: { requiredPermission: 'reit-mortgage.create' },
          },

          {
            path: 'reit-mortgage/:reitMortgageId/edit',
            name: ROUTE_NAMES.REIT_MORTGAGE_UPDATE,
            component: () => import('@/views/operations/reits-mortgage/ReitMortgageDetail.vue'),
            meta: { requiredPermission: ['reit-mortgage.show', 'reit-mortgage.update'] },
          },

          {
            path: 'reit-annual',
            name: ROUTE_NAMES.REIT_ANNUAL_INDEX,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualIndex.vue'),
            meta: { requiredPermission: 'reit-annual.index' },
          },
          {
            path: 'reit-annual/create',
            name: ROUTE_NAMES.REIT_ANNUAL_CREATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
            meta: { requiredPermission: 'reit-annual.create' },
          },
          {
            path: 'reit-annual/:reitAnnualId/edit',
            name: ROUTE_NAMES.REIT_ANNUAL_UPDATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
            meta: { requiredPermission: ['reit-annual.update', 'reit-annual.show'] },
          },

          {
            path: 'reit-quarter',
            name: ROUTE_NAMES.REIT_QUARTER_INDEX,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualIndex.vue'),
            meta: { requiredPermission: 'reit-annual.index' },
          },
          {
            path: 'reit-quarter/create',
            name: ROUTE_NAMES.REIT_QUARTER_CREATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
            meta: { requiredPermission: 'reit-annual.create' },
          },
          {
            path: 'reit-quarter/:reitAnnualId/edit',
            name: ROUTE_NAMES.REIT_QUARTER_UPDATE,
            component: () => import('@/views/operations/reitAnnual/ReitAnnualForm.vue'),
            meta: { requiredPermission: ['reit-annual.update', 'reit-annual.show'] },
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
  {
    path: '/forbidden',
    name: ROUTE_NAMES.FORBIDDEN,
    component: () => import('@/views/pages/Page403.vue'),
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
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    return next({ name: ROUTE_NAMES.LOGIN })
  }
  if (
    to.meta.requiredPermission &&
    to.meta.requiredPermission.length &&
    !authStore.can(
      ...(typeof to.meta.requiredPermission === 'string'
        ? [to.meta.requiredPermission]
        : to.meta.requiredPermission),
    )
  ) {
    return next({ name: ROUTE_NAMES.FORBIDDEN })
  }
  return next()
})

export default router
