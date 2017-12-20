// @flow
import path from 'path';
import KeyframeAnimation from './keyframe-animation';

import type { Tray } from 'electron';

export type TrayIconType = 'unsecured' | 'securing' | 'secured';

export default class TrayIconManager {

  _animation: ?KeyframeAnimation;
  _iconType: TrayIconType;

  constructor(tray: Tray, initialType: TrayIconType) {
    const animation = this._createAnimation();
    animation.onFrame = (img) => tray.setImage(img);
    animation.reverse = this._isReverseAnimation(initialType);
    animation.play({ advanceTo: 'end' });

    this._animation = animation;
    this._iconType = initialType;
  }

  destroy() {
    if(this._animation) {
      this._animation.stop();
      this._animation = null;
    }
  }

  _createAnimation(): KeyframeAnimation {
    const basePath = path.join(path.resolve(__dirname, '..'), 'assets/images/menubar icons');
    const filePath = path.join(basePath, 'lock-{}.png');
    const animation = KeyframeAnimation.fromFilePattern(filePath, [1, 9]);
    animation.speed = 100;
    return animation;
  }

  _isReverseAnimation(type: TrayIconType): bool {
    // unsecured & securing are treated as one
    return type !== 'secured';
  }

  get iconType(): TrayIconType {
    return this._iconType;
  }

  set iconType(type: TrayIconType) {
    if(this._iconType === type || !this._animation) { return; }

    const animation = this._animation;
    animation.reverse = this._isReverseAnimation(type);
    animation.play({ beginFromCurrentState: true });

    this._iconType = type;
  }

}