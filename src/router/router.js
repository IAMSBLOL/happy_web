
import * as React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import {
  NAVIGATION, CIRCULARMASK
} from './pathNames'

function SuspenseFn (Comp) {
  return (
    <React.Suspense>
      <Comp />
    </React.Suspense>
  )
}

const App = React.lazy(() => import('@src/views/container/app'));
const Navigation = React.lazy(() => import('@src/views/Navigation'));
const LoginWebgl = React.lazy(() => import('@src/views/LoginWebgl'));
const CircularMask = React.lazy(() => import('@src/views/shader/CircularMask'));
// const Home = React.lazy(() => import('@src/views/home'));
// const HomeN = React.lazy(() => import('@src/views/home/one'));
// const HomeT = React.lazy(() => import('@src/views/home/two'));

const routes = [
  {
    path: '/',
    element: <Navigate to={NAVIGATION} replace />
  },
  {
    // path: '/app',
    // exact: true,
    strict: true,
    element: SuspenseFn(App),
    children: [
      {
        path: NAVIGATION,
        element: SuspenseFn(Navigation),

      },
      {
        path: '/LoginWebgl',
        element: SuspenseFn(LoginWebgl),

      },
      {
        path: CIRCULARMASK,
        element: SuspenseFn(CircularMask),

      },
      // {
      //   path: APP_HOME,
      //   element: SuspenseFn(Home),
      //   children: [
      //     {
      //       path: APP_HOME_ONE,
      //       element: SuspenseFn(HomeN),
      //     },
      //     {
      //       path: APP_HOME_TWO,
      //       element: SuspenseFn(HomeT),
      //     },
      //   ]
      // },
    ]
  }
]

function Routes () {
  const element = useRoutes(routes);

  // The returned element will render the entire element
  // hierarchy with all the appropriate context it needs

  return element
};

export default Routes;
