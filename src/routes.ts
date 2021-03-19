import { Route } from './type'

const routes: Route[] = [
  [
    '/zfrontier/user/:userId',
    () => import('@/fetchers/zfrontier/flow').then(e => e.default),
  ],
]
export default routes
