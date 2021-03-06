// @flow

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerMiddleware, connectRouter, push, replace } from 'connected-react-router';

import accountReducer from './account/reducers';
import accountActions from './account/actions';
import connectionReducer from './connection/reducers';
import connectionActions from './connection/actions';
import settingsReducer from './settings/reducers';
import settingsActions from './settings/actions';
import supportReducer from './support/reducers';
import supportActions from './support/actions';
import versionReducer from './version/reducers';
import versionActions from './version/actions';
import userInterfaceReducer from './userinterface/reducers';
import userInterfaceActions from './userinterface/actions';

import type { Store, StoreEnhancer } from 'redux';
import type { History } from 'history';
import type { AccountReduxState } from './account/reducers';
import type { ConnectionReduxState } from './connection/reducers';
import type { SettingsReduxState } from './settings/reducers';
import type { SupportReduxState } from './support/reducers';
import type { VersionReduxState } from './version/reducers';
import type { UserInterfaceReduxState } from './userinterface/reducers';

import type { AccountAction } from './account/actions';
import type { ConnectionAction } from './connection/actions';
import type { SettingsAction } from './settings/actions';
import type { SupportAction } from './support/actions';
import type { VersionAction } from './version/actions';
import type { UserInterfaceAction } from './userinterface/actions';

export type ReduxState = {
  account: AccountReduxState,
  connection: ConnectionReduxState,
  settings: SettingsReduxState,
  support: SupportReduxState,
  version: VersionReduxState,
  userInterface: UserInterfaceReduxState,
};

export type ReduxAction =
  | AccountAction
  | ConnectionAction
  | SettingsAction
  | SupportAction
  | VersionAction
  | UserInterfaceAction;
export type ReduxStore = Store<ReduxState, ReduxAction, ReduxDispatch>;
export type ReduxGetState = () => ReduxState;
export type ReduxDispatch = (action: ReduxAction) => any;

export default function configureStore(
  initialState: ?ReduxState,
  routerHistory: History,
): ReduxStore {
  const actionCreators: { [string]: Function } = {
    ...accountActions,
    ...connectionActions,
    ...settingsActions,
    ...supportActions,
    ...versionActions,
    ...userInterfaceActions,
    pushRoute: (route) => push(route),
    replaceRoute: (route) => replace(route),
  };

  const reducers = {
    account: accountReducer,
    connection: connectionReducer,
    settings: settingsReducer,
    support: supportReducer,
    version: versionReducer,
    userInterface: userInterfaceReducer,
    router: connectRouter(routerHistory),
  };

  const composeEnhancers = (() => {
    const reduxCompose = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (process.env.NODE_ENV === 'development' && reduxCompose) {
      return reduxCompose({ actionCreators });
    }
    return compose;
  })();

  const enhancer: StoreEnhancer<ReduxState, ReduxAction, ReduxDispatch> = composeEnhancers(
    applyMiddleware(routerMiddleware(routerHistory)),
  );

  const rootReducer = combineReducers(reducers);

  if (initialState) {
    return createStore(rootReducer, initialState, enhancer);
  } else {
    return createStore(rootReducer, enhancer);
  }
}
