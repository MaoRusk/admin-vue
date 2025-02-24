import { ROUTE_NAMES } from './router/routeNames'

export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: { name: ROUTE_NAMES.DASHBOARD },
    icon: 'cil-speedometer',
  },

  {
    component: 'CNavTitle',
    name: 'Management',
  },

  {
    component: 'CNavGroup',
    name: 'Security',
    icon: 'cil-lock-locked',
    items: [
      {
        component: 'CNavItem',
        name: 'Users',
        to: { name: ROUTE_NAMES.USERS },
        icon: 'cil-user',
      },
      {
        component: 'CNavItem',
        name: 'Roles',
        to: { name: ROUTE_NAMES.ROLES },
        icon: 'cilCropRotate',
      },
      {
        component: 'CNavItem',
        name: 'Access Policies',
        to: { name: ROUTE_NAMES.POLICIES },
        icon: 'cil-shield-alt',
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: 'Catalogs',
    icon: 'cilList',
    items: [
      {
        component: 'CNavItem',
        name: 'Industrial Parks',
        to: { name: ROUTE_NAMES.INDUSTRIAL_PARKS },
        icon: 'cil-building',
      },
      {
        component: 'CNavItem',
        name: 'Companies',
        to: { name: ROUTE_NAMES.COMPANIES_INDEX },
        icon: 'cil-briefcase',
      },
      {
        component: 'CNavItem',
        name: 'Developers',
        to: { name: ROUTE_NAMES.DEVELOPERS },
        icon: 'cil-people',
      },
      {
        component: 'CNavItem',
        name: 'Industries',
        to: { name: ROUTE_NAMES.INDUSTRIES },
        icon: 'cil-factory',
      },
      {
        component: 'CNavItem',
        name: 'Tenants',
        to: { name: ROUTE_NAMES.TENANTS_INDEX },
        icon: 'cil-people',
      },
      {
        component: 'CNavItem',
        name: 'Brokers',
        to: { name: ROUTE_NAMES.TENANTS_INDEX },
        icon: 'cil-people',
      },
    ],
  },

  {
    component: 'CNavTitle',
    name: 'Operation',
  },

  {
    component: 'CNavGroup',
    name: 'Market Size',
    icon: 'cil-building',
    items: [
      {
        component: 'CNavItem',
        name: 'Market Size',
        to: { name: ROUTE_NAMES.BUILDINGS },
        icon: 'cilLibraryAdd',
      },
      {
        component: 'CNavItem',
        name: 'Pending Approvals',
        to: { name: ROUTE_NAMES.MARKET_SIZE_PENDING_APPROVALS },
        icon: 'cilCheckCircle',
      },
    ],
  },

  {
    component: 'CNavItem',
    name: 'Lands',
    to: { name: ROUTE_NAMES.LANDS_INDEX },
    icon: 'cilTerrain',
  },
]
