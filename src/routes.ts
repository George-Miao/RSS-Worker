import { Route } from './type'

const routes: Route[] = [
  ['/zfrontier/user/:userId', () => import('@/fetchers/zfrontier/flow')],
]
export default routes
