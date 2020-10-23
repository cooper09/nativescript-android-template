import { LayoutBase } from '../layouts/layout-base';
import { View, CustomLayoutView, Template } from '../core/view';
import { Property } from '../core/properties';
import { ChangedData } from '../../data/observable-array';
export interface ItemsSource {
    length: number;
    getItem(index: number): any;
}
/**
 * Represents a UI Repeater component.
 */
export declare class Repeater extends CustomLayoutView {
    private _isDirty;
    ios: any;
    android: any;
    constructor();
    /**
     * Gets or set the items collection of the Repeater.
     * The items property can be set to an array or an object defining length and getItem(index) method.
     */
    items: any[] | ItemsSource;
    /**
     * Gets or set the item template of the Repeater.
     */
    itemTemplate: string | Template;
    /**
     * Gets or set the items layout of the Repeater. Default value is StackLayout with orientation="vertical".
     */
    itemsLayout: LayoutBase;
    onLoaded(): void;
    _requestRefresh(): void;
    /**
     * Forces the Repeater to reload all its items.
     */
    refresh(): void;
    _onItemsChanged(data: ChangedData<any>): void;
    _getDefaultItemContent(index: number): View;
    private _getDataItem;
    get _childrenCount(): number;
    eachChildView(callback: (child: View) => boolean): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
}
/**
 * Represents the item template property of each ListView instance.
 */
export declare const itemTemplateProperty: Property<Repeater, string | Template>;
/**
 * Represents the property backing the items property of each ListView instance.
 */
export declare const itemsProperty: Property<Repeater, any[] | ItemsSource>;
export declare const itemsLayoutProperty: Property<Repeater, LayoutBase>;
