// @flow

import * as React from 'react';
import { Button, Component, Styles, Text, TextInput, Types, View } from 'reactxp';
import { ImageView } from '@mullvad/components';
import { colors } from '../../config';

const styles = {
  cellButton: Styles.createViewStyle({
    backgroundColor: colors.blue,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'default',
  }),
  cellContainer: Styles.createViewStyle({
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
  }),

  footer: {
    container: Styles.createViewStyle({
      paddingTop: 8,
      paddingRight: 24,
      paddingBottom: 24,
      paddingLeft: 24,
    }),
    text: Styles.createTextStyle({
      fontFamily: 'Open Sans',
      fontSize: 13,
      fontWeight: '600',
      lineHeight: 20,
      letterSpacing: -0.2,
      color: colors.white80,
    }),
  },

  label: {
    container: Styles.createViewStyle({
      marginLeft: 8,
      marginTop: 14,
      marginBottom: 14,
      flexGrow: 1,
    }),
    text: Styles.createTextStyle({
      fontFamily: 'DINPro',
      fontSize: 20,
      fontWeight: '900',
      lineHeight: 26,
      letterSpacing: -0.2,
      color: colors.white,
    }),
  },

  input: {
    frame: Styles.createViewStyle({
      flexGrow: 0,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 4,
      paddingHorizontal: 2,
      paddingVertical: 2,
    }),
    text: Styles.createTextStyle({
      color: colors.white,
      backgroundColor: 'transparent',
      fontFamily: 'Open Sans',
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
      textAlign: 'right',
    }),
  },

  cellHover: Styles.createViewStyle({
    backgroundColor: colors.blue80,
  }),
  icon: Styles.createViewStyle({
    marginLeft: 8,
  }),

  subtext: Styles.createTextStyle({
    color: colors.white60,
    fontFamily: 'Open Sans',
    fontSize: 13,
    fontWeight: '800',
    flex: -1,
    textAlign: 'right',
    marginLeft: 8,
  }),
};

type CellButtonProps = {
  children?: React.Node,
  disabled?: boolean,
  cellHoverStyle?: Types.ViewStyle,
  style?: Types.ViewStyle,
};

type State = { hovered: boolean };

const CellHoverContext = React.createContext<boolean>(false);

export class CellButton extends Component<CellButtonProps, State> {
  state = { hovered: false };

  onHoverStart = () => (!this.props.disabled ? this.setState({ hovered: true }) : null);
  onHoverEnd = () => (!this.props.disabled ? this.setState({ hovered: false }) : null);

  render() {
    const { children, style, cellHoverStyle, ...otherProps } = this.props;
    const hoverStyle = cellHoverStyle || styles.cellHover;
    return (
      <Button
        style={[styles.cellButton, style, this.state.hovered && hoverStyle]}
        onHoverStart={this.onHoverStart}
        onHoverEnd={this.onHoverEnd}
        {...otherProps}>
        <CellHoverContext.Provider value={this.state.hovered}>{children}</CellHoverContext.Provider>
      </Button>
    );
  }
}

type ContainerProps = { children: React.Node };

export function Container({ children }: ContainerProps) {
  return <View style={styles.cellContainer}>{children}</View>;
}

export type LabelProps = {
  children: React.Node,
  containerStyle?: Types.ViewStyle,
  textStyle?: Types.TextStyle,
  cellHoverContainerStyle?: Types.ViewStyle,
  cellHoverTextStyle?: Types.TextStyle,
};

export function Label({
  children,
  containerStyle,
  textStyle,
  cellHoverContainerStyle,
  cellHoverTextStyle,
  ...otherProps
}: LabelProps) {
  return (
    <CellHoverContext.Consumer>
      {(hovered) => (
        <View
          style={[styles.label.container, containerStyle, hovered && cellHoverContainerStyle]}
          {...otherProps}>
          <Text style={[styles.label.text, textStyle, hovered && cellHoverTextStyle]}>
            {children}
          </Text>
        </View>
      )}
    </CellHoverContext.Consumer>
  );
}

export function InputFrame({ style, children, ...otherProps }: Types.ViewProps) {
  return (
    <View style={[styles.input.frame, style]} {...otherProps}>
      {children}
    </View>
  );
}

export function Input({ style, ...otherProps }: Types.TextInputProps) {
  return (
    <TextInput
      maxLength={10}
      placeholderTextColor={colors.white60}
      autoCorrect={false}
      autoFocus={false}
      style={[styles.input.text, style]}
      testId="CellInputField"
      {...otherProps}
    />
  );
}

export type SubTextProps = {
  children: React.Node,
  cellHoverStyle?: Types.ViewStyle,
  style?: Types.ViewStyle,
};

export function SubText({ children, style, cellHoverStyle, ...otherProps }: SubTextProps) {
  return (
    <CellHoverContext.Consumer>
      {(hovered) => (
        <Text style={[styles.subtext, style, hovered && cellHoverStyle]} {...otherProps}>
          {children}
        </Text>
      )}
    </CellHoverContext.Consumer>
  );
}

export function Icon({
  style,
  tintColor,
  tintHoverColor,
  ...otherProps
}: React.ElementProps<typeof ImageView>) {
  return (
    <CellHoverContext.Consumer>
      {(hovered) => (
        <ImageView
          tintColor={(hovered && tintHoverColor) || tintColor || colors.white60}
          style={[styles.icon, style]}
          {...otherProps}
        />
      )}
    </CellHoverContext.Consumer>
  );
}

export function Footer({ children }: ContainerProps) {
  return (
    <View style={styles.footer.container}>
      <Text style={styles.footer.text}>{children}</Text>
    </View>
  );
}
