import { defineRoutes } from './common/toolkit'

// Import all routes below
import zfrontierUser from '@/fetchers/zfrontier/flow'
import zfrontierList from '@/fetchers/zfrontier/list'

// And export them
export default defineRoutes([zfrontierUser, zfrontierList])
