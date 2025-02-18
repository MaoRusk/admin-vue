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
import Lands from './Lands'
import LandsAbsorption from './LandsAbsorption'
import LandsAvailability from './LandsAvailable'
import Companies from './Companies'
import BuildingsContacts from './BuildingsContacts'

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
  lands: Lands,
  landsAbsorption: LandsAbsorption,
  landsAvailability: LandsAvailability,
  companies: Companies,
  BuildingsContacts,
}
