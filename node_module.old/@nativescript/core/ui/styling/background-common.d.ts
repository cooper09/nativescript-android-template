import { Background as BackgroundDefinition } from './background';
import { BackgroundRepeat } from '../styling/style-properties';
import { LinearGradient } from './linear-gradient';
import { Color } from '../../color';
export declare class Background implements BackgroundDefinition {
    static default: Background;
    color: Color;
    image: string | LinearGradient;
    repeat: BackgroundRepeat;
    position: string;
    size: string;
    borderTopColor: Color;
    borderRightColor: Color;
    borderBottomColor: Color;
    borderLeftColor: Color;
    borderTopWidth: number;
    borderRightWidth: number;
    borderBottomWidth: number;
    borderLeftWidth: number;
    borderTopLeftRadius: number;
    borderTopRightRadius: number;
    borderBottomLeftRadius: number;
    borderBottomRightRadius: number;
    clipPath: string;
    private clone;
    withColor(value: Color): Background;
    withImage(value: string | LinearGradient): Background;
    withRepeat(value: BackgroundRepeat): Background;
    withPosition(value: string): Background;
    withSize(value: string): Background;
    withBorderTopColor(value: Color): Background;
    withBorderRightColor(value: Color): Background;
    withBorderBottomColor(value: Color): Background;
    withBorderLeftColor(value: Color): Background;
    withBorderTopWidth(value: number): Background;
    withBorderRightWidth(value: number): Background;
    withBorderBottomWidth(value: number): Background;
    withBorderLeftWidth(value: number): Background;
    withBorderTopLeftRadius(value: number): Background;
    withBorderTopRightRadius(value: number): Background;
    withBorderBottomRightRadius(value: number): Background;
    withBorderBottomLeftRadius(value: number): Background;
    withClipPath(value: string): Background;
    isEmpty(): boolean;
    static equals(value1: Background, value2: Background): boolean;
    hasBorderColor(): boolean;
    hasBorderWidth(): boolean;
    hasBorderRadius(): boolean;
    hasUniformBorderColor(): boolean;
    hasUniformBorderWidth(): boolean;
    hasUniformBorderRadius(): boolean;
    hasUniformBorder(): boolean;
    getUniformBorderColor(): Color;
    getUniformBorderWidth(): number;
    getUniformBorderRadius(): number;
    toString(): string;
}
