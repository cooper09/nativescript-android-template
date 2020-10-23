import { AnimationCurve } from '../enums';
import { Trace } from '../../trace';
// Types.
import { unsetValue } from '../core/properties';
import { Animation } from '.';
import { backgroundColorProperty, scaleXProperty, scaleYProperty, translateXProperty, translateYProperty, rotateProperty, opacityProperty, rotateXProperty, rotateYProperty, widthProperty, heightProperty } from '../styling/style-properties';
export class Keyframes {
}
export class UnparsedKeyframe {
}
export class KeyframeDeclaration {
}
export class KeyframeInfo {
    constructor() {
        this.curve = AnimationCurve.ease;
    }
}
export class KeyframeAnimationInfo {
    constructor() {
        this.name = '';
        this.duration = 0.3;
        this.delay = 0;
        this.iterations = 1;
        this.curve = 'ease';
        this.isForwards = false;
        this.isReverse = false;
    }
}
export class KeyframeAnimation {
    constructor() {
        this.delay = 0;
        this.iterations = 1;
    }
    static keyframeAnimationFromInfo(info) {
        const length = info.keyframes.length;
        let animations = new Array();
        let startDuration = 0;
        if (info.isReverse) {
            for (let index = length - 1; index >= 0; index--) {
                let keyframe = info.keyframes[index];
                startDuration = KeyframeAnimation.parseKeyframe(info, keyframe, animations, startDuration);
            }
        }
        else {
            for (let index = 0; index < length; index++) {
                let keyframe = info.keyframes[index];
                startDuration = KeyframeAnimation.parseKeyframe(info, keyframe, animations, startDuration);
            }
            for (let index = length - 1; index > 0; index--) {
                let a1 = animations[index];
                let a2 = animations[index - 1];
                if (a2['curve'] !== undefined) {
                    a1['curve'] = a2['curve'];
                    a2['curve'] = undefined;
                }
            }
        }
        animations.map((a) => (a['curve'] ? a : Object.assign(a, { curve: info.curve })));
        const animation = new KeyframeAnimation();
        animation.delay = info.delay;
        animation.iterations = info.iterations;
        animation.animations = animations;
        animation._isForwards = info.isForwards;
        return animation;
    }
    static parseKeyframe(info, keyframe, animations, startDuration) {
        let animation = {};
        for (let declaration of keyframe.declarations) {
            animation[declaration.property] = declaration.value;
        }
        let duration = keyframe.duration;
        if (duration === 0) {
            duration = 0.01;
        }
        else {
            duration = info.duration * duration - startDuration;
            startDuration += duration;
        }
        animation.duration = info.isReverse ? info.duration - duration : duration;
        animation.curve = keyframe.curve;
        animation.forceLayer = true;
        animation.valueSource = 'keyframe';
        animations.push(animation);
        return startDuration;
    }
    get isPlaying() {
        return this._isPlaying;
    }
    cancel() {
        if (!this.isPlaying) {
            Trace.write('Keyframe animation is already playing.', Trace.categories.Animation, Trace.messageType.warn);
            return;
        }
        this._isPlaying = false;
        for (let i = this._nativeAnimations.length - 1; i >= 0; i--) {
            let animation = this._nativeAnimations[i];
            if (animation.isPlaying) {
                animation.cancel();
            }
        }
        if (this._nativeAnimations.length > 0) {
            let animation = this._nativeAnimations[0];
            this._resetAnimationValues(this._target, animation);
        }
        this._resetAnimations();
    }
    play(view) {
        if (this._isPlaying) {
            Trace.write('Keyframe animation is already playing.', Trace.categories.Animation, Trace.messageType.warn);
            return new Promise((resolve) => {
                resolve();
            });
        }
        let animationFinishedPromise = new Promise((resolve) => {
            this._resolve = resolve;
        });
        this._isPlaying = true;
        this._nativeAnimations = new Array();
        this._target = view;
        if (this.delay !== 0) {
            setTimeout(() => this.animate(view, 0, this.iterations), this.delay);
        }
        else {
            this.animate(view, 0, this.iterations);
        }
        return animationFinishedPromise;
    }
    animate(view, index, iterations) {
        if (!this._isPlaying) {
            return;
        }
        if (index === 0) {
            let animation = this.animations[0];
            if ('backgroundColor' in animation) {
                view.style[backgroundColorProperty.keyframe] = animation.backgroundColor;
            }
            if ('scale' in animation) {
                view.style[scaleXProperty.keyframe] = animation.scale.x;
                view.style[scaleYProperty.keyframe] = animation.scale.y;
            }
            if ('translate' in animation) {
                view.style[translateXProperty.keyframe] = animation.translate.x;
                view.style[translateYProperty.keyframe] = animation.translate.y;
            }
            if ('rotate' in animation) {
                view.style[rotateXProperty.keyframe] = animation.rotate.x;
                view.style[rotateYProperty.keyframe] = animation.rotate.y;
                view.style[rotateProperty.keyframe] = animation.rotate.z;
            }
            if ('opacity' in animation) {
                view.style[opacityProperty.keyframe] = animation.opacity;
            }
            if ('height' in animation) {
                view.style[heightProperty.keyframe] = animation.height;
            }
            if ('width' in animation) {
                view.style[widthProperty.keyframe] = animation.width;
            }
            setTimeout(() => this.animate(view, 1, iterations), 1);
        }
        else if (index < 0 || index >= this.animations.length) {
            iterations -= 1;
            if (iterations > 0) {
                this.animate(view, 0, iterations);
            }
            else {
                if (this._isForwards === false) {
                    let animation = this.animations[this.animations.length - 1];
                    this._resetAnimationValues(view, animation);
                }
                this._resolveAnimationFinishedPromise();
            }
        }
        else {
            let animation;
            const cachedAnimation = this._nativeAnimations[index - 1];
            if (cachedAnimation) {
                animation = cachedAnimation;
            }
            else {
                let animationDef = this.animations[index];
                animationDef.target = view;
                animation = new Animation([animationDef]);
                this._nativeAnimations.push(animation);
            }
            const isLastIteration = iterations - 1 <= 0;
            // Catch the animation cancel to prevent unhandled promise rejection warnings
            animation
                .play(isLastIteration)
                .then(() => {
                this.animate(view, index + 1, iterations);
            }, (error) => {
                Trace.write(typeof error === 'string' ? error : error.message, Trace.categories.Animation, Trace.messageType.warn);
            })
                .catch((error) => {
                Trace.write(typeof error === 'string' ? error : error.message, Trace.categories.Animation, Trace.messageType.warn);
            }); // tslint:disable-line
        }
    }
    _resolveAnimationFinishedPromise() {
        this._nativeAnimations = new Array();
        this._isPlaying = false;
        this._target = null;
        this._resolve();
    }
    _resetAnimations() {
        this._nativeAnimations = new Array();
        this._isPlaying = false;
        this._target = null;
    }
    _resetAnimationValues(view, animation) {
        if ('backgroundColor' in animation) {
            view.style[backgroundColorProperty.keyframe] = unsetValue;
        }
        if ('scale' in animation) {
            view.style[scaleXProperty.keyframe] = unsetValue;
            view.style[scaleYProperty.keyframe] = unsetValue;
        }
        if ('translate' in animation) {
            view.style[translateXProperty.keyframe] = unsetValue;
            view.style[translateYProperty.keyframe] = unsetValue;
        }
        if ('rotate' in animation) {
            view.style[rotateProperty.keyframe] = unsetValue;
        }
        if ('opacity' in animation) {
            view.style[opacityProperty.keyframe] = unsetValue;
        }
        if ('height' in animation) {
            view.style[heightProperty.keyframe] = unsetValue;
        }
        if ('width' in animation) {
            view.style[widthProperty.keyframe] = unsetValue;
        }
    }
}
//# sourceMappingURL=keyframe-animation.js.map