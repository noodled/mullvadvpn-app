// @flow

import { shell } from 'electron';
import log from 'electron-log';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { links } from '../../config';
import Connect from '../components/Connect';
import AccountExpiry from '../lib/account-expiry';
import userInterfaceActions from '../redux/userinterface/actions';

import type { ReduxState, ReduxDispatch } from '../redux/store';
import type { SharedRouteProps } from '../routes';

import type { RelaySettingsRedux, RelayLocationRedux } from '../redux/settings/reducers';

function getRelayName(
  relaySettings: RelaySettingsRedux,
  relayLocations: Array<RelayLocationRedux>,
): string {
  if (relaySettings.normal) {
    const location = relaySettings.normal.location;

    if (location === 'any') {
      return 'Automatic';
    } else if (location.country) {
      const country = relayLocations.find(({ code }) => code === location.country);
      if (country) {
        return country.name;
      }
    } else if (location.city) {
      const [countryCode, cityCode] = location.city;
      const country = relayLocations.find(({ code }) => code === countryCode);
      if (country) {
        const city = country.cities.find(({ code }) => code === cityCode);
        if (city) {
          return city.name;
        }
      }
    } else if (location.hostname) {
      const [countryCode, cityCode, hostname] = location.hostname;
      const country = relayLocations.find(({ code }) => code === countryCode);
      if (country) {
        const city = country.cities.find(({ code }) => code === cityCode);
        if (city) {
          return `${city.name} (${hostname})`;
        }
      }
    }

    return 'Unknown';
  } else if (relaySettings.customTunnelEndpoint) {
    return 'Custom';
  } else {
    throw new Error('Unsupported relay settings.');
  }
}

const mapStateToProps = (state: ReduxState) => {
  return {
    accountExpiry: state.account.expiry ? new AccountExpiry(state.account.expiry) : null,
    selectedRelayName: getRelayName(state.settings.relaySettings, state.settings.relayLocations),
    connection: state.connection,
    version: state.version,
    connectionInfoOpen: state.userInterface.connectionInfoOpen,
    blockWhenDisconnected: state.settings.blockWhenDisconnected,
  };
};

const mapDispatchToProps = (dispatch: ReduxDispatch, props: SharedRouteProps) => {
  const userInterface = bindActionCreators(userInterfaceActions, dispatch);
  const history = bindActionCreators({ push }, dispatch);

  return {
    onToggleConnectionInfo: (isOpen: boolean) => {
      userInterface.updateConnectionInfoOpen(isOpen);
    },
    onSettings: () => {
      history.push('/settings');
    },
    onSelectLocation: () => {
      history.push('/select-location');
    },
    onConnect: async () => {
      try {
        await props.app.connectTunnel();
      } catch (error) {
        log.error(`Failed to connect the tunnel: ${error.message}`);
      }
    },
    onDisconnect: () => {
      try {
        props.app.disconnectTunnel();
      } catch (error) {
        log.error(`Failed to disconnect the tunnel: ${error.message}`);
      }
    },
    onExternalLink: (type) => shell.openExternal(links[type]),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Connect);
