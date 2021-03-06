// @flow

import { Styles } from 'reactxp';
import { colors } from '../../config';

export default {
  connect: Styles.createViewStyle({
    flex: 1,
  }),
  map: Styles.createViewStyle({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    height: '100%',
    width: '100%',
  }),
  body: Styles.createViewStyle({
    paddingTop: 0,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 0,
    marginTop: 186,
    flex: 1,
  }),
  container: Styles.createViewStyle({
    flexDirection: 'column',
    flex: 1,
    position: 'relative' /* need this for z-index to work to cover map */,
    zIndex: 1,
  }),
  status_icon: Styles.createViewStyle({
    position: 'absolute',
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginTop: 94,
  }),
  notification_area: Styles.createViewStyle({
    width: '100%',
    position: 'absolute',
  }),
  error_title: Styles.createTextStyle({
    fontFamily: 'DINPro',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    color: colors.white,
    marginBottom: 8,
  }),
  error_message: Styles.createTextStyle({
    fontFamily: 'Open Sans',
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 24,
  }),
};
