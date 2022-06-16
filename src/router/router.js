
import * as React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import {
  NAVIGATION, CIRCULARMASK, NOISE, APP_HOME, APP_HOME_ONE, EARTH
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
const Noise = React.lazy(() => import('@src/views/shader/Noise'));

const TesorPage = React.lazy(() => import('@src/views/tensorflow/TesorPage'));

const Earth = React.lazy(() => import('@src/views/shader/Earth'));
const Home = React.lazy(() => import('@src/views/home'));
const HomeN = React.lazy(() => import('@src/views/home/one'));

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
        path: '/TesorPage',
        element: SuspenseFn(TesorPage),
      },
      {
        path: CIRCULARMASK,
        element: SuspenseFn(CircularMask),

      },
      {
        path: NOISE,
        element: SuspenseFn(Noise),

      },
      {
        path: EARTH,
        element: SuspenseFn(Earth),

      },
      {
        path: APP_HOME,
        element: SuspenseFn(Home),
        children: [
          {
            path: APP_HOME_ONE,
            element: SuspenseFn(HomeN),
          },

        ]
      },
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
