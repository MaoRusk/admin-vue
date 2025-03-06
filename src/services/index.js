import Auth from './Auth'
import Brokers from './Brokers'
import Buildings from './Buildings'
import Builders from './Builders'
import Countries from './Countries'
import Currencies from './Currencies'
import Developers from './Developers'
import IndustrialParks from './IndustrialParks'
import Industries from './Industries'
import Markets from './Markets'
import Owners from './Owners'
import Regions from './Regions'
import Shelters from './Shelters'
import Submarkets from './Submarkets'
import Tenants from './Tenants'
import BuildingsAvailability from './BuildingsAvailability'
import BuildingsAbsorption from './BuildingsAbsorption'
import Users from './Users'
import Roles from './Roles'
import Permissions from './Permissions'
import Companies from './Companies'
import Contacts from './CompaniesContacts'
import Lands from './Lands'
import LandsAbsorption from './LandsAbsorption'
import LandsAvailability from './LandsAvailable'
import LandsContacts from './LandsContacts'
import BuildingsContacts from './BuildingsContacts'
import reitsService from './Reits'
import camsService from './Cams'

export const API = {
  auth: Auth,
  buildings: Buildings,
  brokers: Brokers,
  builders: Builders,
  countries: Countries,
  currencies: Currencies,
  developers: Developers,
  industrialparks: IndustrialParks,
  industries: Industries,
  markets: Markets,
  owners: Owners,
  regions: Regions,
  shelters: Shelters,
  submarkets: Submarkets,
  tenants: Tenants,
  buildingsAvailability: BuildingsAvailability,
  buildingsAbsorption: BuildingsAbsorption,
  users: Users,
  roles: Roles,
  permissions: Permissions,
  companies: Companies,
  contacts: Contacts,
  lands: Lands,
  landsAbsorption: LandsAbsorption,
  landsAvailability: LandsAvailability,
  landsContacts: LandsContacts,
  BuildingsContacts,
  reits: reitsService,
  cams: camsService,
}
