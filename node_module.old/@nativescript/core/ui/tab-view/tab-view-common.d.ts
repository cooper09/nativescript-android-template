import { TabView as TabViewDefinition, TabViewItem as TabViewItemDefinition, SelectedIndexChangedEventData } from '.';
import { View, AddArrayFromBuilder, AddChildFromBuilder } from '../core/view';
import { ViewBase } from '../core/view-base';
import { Style } from '../styling/style';
import { EventData } from '../../data/observable';
import { Color } from '../../color';
import { Property, CssProperty, CoercibleProperty } from '../core/properties';
import { TextTransform } from '../text-base';
export declare const traceCategory = "TabView";
export declare abstract class TabViewItemBase extends ViewBase implements TabViewItemDefinition, AddChildFromBuilder {
    private _title;
    private _view;
    private _iconSource;
    get textTransform(): TextTransform;
    set textTransform(value: TextTransform);
    _addChildFromBuilder(name: string, value: any): void;
    get title(): string;
    set title(value: string);
    get view(): View;
    set view(value: View);
    get iconSource(): string;
    set iconSource(value: string);
    eachChild(callback: (child: ViewBase) => boolean): void;
    loadView(view: ViewBase): void;
    abstract _update(): any;
}
export declare class TabViewBase extends View implements TabViewDefinition, AddChildFromBuilder, AddArrayFromBuilder {
    static selectedIndexChangedEvent: string;
    items: TabViewItemDefinition[];
    selectedIndex: number;
    androidOffscreenTabLimit: number;
    androidTabsPosition: 'top' | 'bottom';
    androidSwipeEnabled: boolean;
    iosIconRenderingMode: 'automatic' | 'alwaysOriginal' | 'alwaysTemplate';
    get androidSelectedTabHighlightColor(): Color;
    set androidSelectedTabHighlightColor(value: Color);
    get tabTextFontSize(): number;
    set tabTextFontSize(value: number);
    get tabTextColor(): Color;
    set tabTextColor(value: Color);
    get tabBackgroundColor(): Color;
    set tabBackgroundColor(value: Color);
    get selectedTabTextColor(): Color;
    set selectedTabTextColor(value: Color);
    _addArrayFromBuilder(name: string, value: Array<any>): void;
    _addChildFromBuilder(name: string, value: any): void;
    get _selectedView(): View;
    get _childrenCount(): number;
    eachChild(callback: (child: ViewBase) => boolean): void;
    eachChildView(callback: (child: View) => boolean): void;
    onItemsChanged(oldItems: TabViewItemDefinition[], newItems: TabViewItemDefinition[]): void;
    onSelectedIndexChanged(oldIndex: number, newIndex: number): void;
}
export interface TabViewBase {
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): any;
    on(event: 'selectedIndexChanged', callback: (args: SelectedIndexChangedEventData) => void, thisArg?: any): any;
}
export declare function traceMissingIcon(icon: string): void;
export declare const selectedIndexProperty: CoercibleProperty<TabViewBase, number>;
export declare const itemsProperty: Property<TabViewBase, TabViewItemDefinition[]>;
export declare const iosIconRenderingModeProperty: Property<TabViewBase, "automatic" | "alwaysOriginal" | "alwaysTemplate">;
export declare const androidOffscreenTabLimitProperty: Property<TabViewBase, number>;
export declare const androidTabsPositionProperty: Property<TabViewBase, "top" | "bottom">;
export declare const androidSwipeEnabledProperty: Property<TabViewBase, boolean>;
export declare const tabTextFontSizeProperty: CssProperty<Style, number>;
export declare const tabTextColorProperty: CssProperty<Style, Color>;
export declare const tabBackgroundColorProperty: CssProperty<Style, Color>;
export declare const selectedTabTextColorProperty: CssProperty<Style, Color>;
export declare const androidSelectedTabHighlightColorProperty: CssProperty<Style, Color>;
