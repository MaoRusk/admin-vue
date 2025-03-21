import { ROUTE_NAMES } from './router/routeNames'

// interface Item {
//   component: string
//   name: string,
//   to: RouterLinkProps,
//   icon: string,
//   items?: Array<Item>
//   visible: boolean | string | Array<string>, // si debe renderizarse el item, cuando es string, verifica si el usuario en sesion tiene el permiso
// }
export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: { name: ROUTE_NAMES.DASHBOARD },
    icon: 'cil-speedometer',
    visible: true,
  },

  {
    component: 'CNavTitle',
    name: 'Management',
    visible: ['users.index', 'roles.index'],
  },

  {
    component: 'CNavGroup',
    name: 'Security',
    icon: 'cil-lock-locked',
    visible: ['users.index', 'roles.index'],
    items: [
      {
        component: 'CNavItem',
        name: 'Users',
        to: { name: ROUTE_NAMES.USERS },
        icon: 'cil-user',
        visible: 'users.index',
      },
      {
        component: 'CNavItem',
        name: 'Roles',
        to: { name: ROUTE_NAMES.ROLES },
        icon: 'cilCropRotate',
        visible: 'roles.index',
      },
      {
        component: 'CNavItem',
        name: 'Access Policies',
        to: { name: ROUTE_NAMES.POLICIES },
        icon: 'cil-shield-alt',
        visible: true,
      },
    ],
  },

  {
    component: 'CNavGroup',
    name: 'Catalogs',
    icon: 'cilList',
    visible: [
      'industrial-parks.index',
      'companies.index',
      'developers.index',
      'industries.index',
      'reits.index',
      'tenants.index',
      'brokers.index',
    ],
    items: [
      {
        component: 'CNavItem',
        name: 'Industrial Parks',
        to: { name: ROUTE_NAMES.INDUSTRIAL_PARKS },
        icon: 'cil-building',
        visible: 'industrial-parks.index',
      },
      {
        component: 'CNavItem',
        name: 'Companies',
        to: { name: ROUTE_NAMES.COMPANIES_INDEX },
        icon: 'cil-briefcase',
        visible: 'companies.index',
      },
      {
        component: 'CNavItem',
        name: 'Developers',
        to: { name: ROUTE_NAMES.DEVELOPERS },
        icon: 'cil-people',
        visible: 'developers.index',
      },
      {
        component: 'CNavItem',
        name: 'Industries',
        to: { name: ROUTE_NAMES.INDUSTRIES },
        icon: 'cil-factory',
        visible: 'industries.index',
      },
      {
        component: 'CNavItem',
        name: 'REITs',
        to: { name: ROUTE_NAMES.REITS },
        icon: 'cil-building',
        visible: 'reits.index',
      },
      {
        component: 'CNavItem',
        name: 'Tenants',
        to: { name: ROUTE_NAMES.TENANTS_INDEX },
        icon: 'cil-people',
        visible: 'tenants.index',
      },
      {
        component: 'CNavItem',
        name: 'Brokers',
        to: { name: ROUTE_NAMES.BROKERS_INDEX },
        icon: 'cil-people',
        visible: 'brokers.index',
      },
    ],
  },

  {
    component: 'CNavTitle',
    name: 'Operation',
    visible: ['buildings.index', 'lands.index', 'reit-annual.index', 'reit-mortgage.index', 'market-growth.index', 'users.index'],
  },
  {
    component: 'CNavGroup',
    name: 'Market Size',
    icon: 'cil-building',
    visible: ['buildings.index'],
    items: [
      {
        component: 'CNavItem',
        name: 'Market Size',
        to: { name: ROUTE_NAMES.BUILDINGS },
        icon: 'cilLibraryAdd',
        visible: 'buildings.index',
      },
      {
        component: 'CNavItem',
        name: 'Pending Approvals',
        to: { name: ROUTE_NAMES.MARKET_SIZE_PENDING_APPROVALS },
        icon: 'cilCheckCircle',
        visible: true,
      },
    ],
  },

  {
    component: 'CNavItem',
    name: 'Lands',
    to: { name: ROUTE_NAMES.LANDS_INDEX },
    icon: 'cilTerrain',
    visible: 'lands.index',
  },

  {
    component: 'CNavItem',
    name: 'Market Growth',
    to: { name: ROUTE_NAMES.MARKET_GROWTH_INDEX },
    icon: 'cilChart',
    visible: 'market-growths.index',
  },

  {
    component: 'CNavGroup',
    name: 'REITs',
    icon: 'cilInstitution',
    visible: ['reit-annual.index', 'reit-mortgage.index'],
    items: [
      {
        component: 'CNavItem',
        name: 'Reit Mortgage',
        to: { name: ROUTE_NAMES.REIT_MORTGAGE },
        icon: 'cilLibraryAdd',
        visible: 'reit-mortgage.index',
      },
      {
        component: 'CNavItem',
        name: 'REITs Annual',
        to: { name: ROUTE_NAMES.REIT_ANNUAL_INDEX },
        icon: 'cilGraph',
        visible: 'reit-annual.index',
      },
      {
        component: 'CNavItem',
        name: 'REITs Quarter',
        to: { name: ROUTE_NAMES.REIT_QUARTER_INDEX },
        icon: 'cilGraph',
        visible: 'reit-annual.index',
      },
    ],
  },
]
