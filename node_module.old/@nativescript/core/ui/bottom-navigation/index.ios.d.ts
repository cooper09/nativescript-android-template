import { TabContentItem } from '../tab-navigation-base/tab-content-item';
import { TabStripItem } from '../tab-navigation-base/tab-strip-item';
import { TextTransform } from '../text-base';
import { Color } from '../../color';
import { Font } from '../styling/font';
import { TabNavigationBase } from '../tab-navigation-base/tab-navigation-base';
declare class UITabBarControllerImpl extends UITabBarController {
    private _owner;
    static initWithOwner(owner: WeakRef<BottomNavigation>): UITabBarControllerImpl;
    viewWillAppear(animated: boolean): void;
    viewDidDisappear(animated: boolean): void;
    viewWillTransitionToSizeWithTransitionCoordinator(size: CGSize, coordinator: UIViewControllerTransitionCoordinator): void;
    traitCollectionDidChange(previousTraitCollection: UITraitCollection): void;
}
export declare class BottomNavigation extends TabNavigationBase {
    viewController: UITabBarControllerImpl;
    items: TabContentItem[];
    _ios: UITabBarControllerImpl;
    private _delegate;
    private _moreNavigationControllerDelegate;
    private _iconsCache;
    private _selectedItemColor;
    private _unSelectedItemColor;
    constructor();
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    onUnloaded(): void;
    get ios(): UITabBarController;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    _setNativeViewFrame(nativeView: UIView, frame: CGRect): void;
    onSelectedIndexChanged(oldIndex: number, newIndex: number): void;
    getTabBarBackgroundColor(): UIColor;
    setTabBarBackgroundColor(value: UIColor | Color): void;
    setTabBarItemTitle(tabStripItem: TabStripItem, value: string): void;
    setTabBarItemBackgroundColor(tabStripItem: TabStripItem, value: UIColor | Color): void;
    setTabBarItemColor(tabStripItem: TabStripItem, value: UIColor | Color): void;
    private setItemColors;
    private setIconColor;
    setTabBarIconColor(tabStripItem: TabStripItem, value: UIColor | Color): void;
    setTabBarIconSource(tabStripItem: TabStripItem, value: UIColor | Color): void;
    setTabBarItemFontInternal(tabStripItem: TabStripItem, value: Font): void;
    setTabBarItemTextTransform(tabStripItem: TabStripItem, value: TextTransform): void;
    getTabBarHighlightColor(): UIColor;
    setTabBarHighlightColor(value: UIColor | Color): void;
    getTabBarSelectedItemColor(): Color;
    setTabBarSelectedItemColor(value: Color): void;
    getTabBarUnSelectedItemColor(): Color;
    setTabBarUnSelectedItemColor(value: Color): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    _onViewControllerShown(viewController: UIViewController): void;
    private _actionBarHiddenByTabView;
    _handleTwoNavigationBars(backToMoreWillBeVisible: boolean): void;
    private getViewController;
    private setViewControllers;
    private setItemImages;
    updateAllItemsColors(): void;
    private updateItemColors;
    private createTabBarItem;
    private getIconRenderingMode;
    private getIcon;
    private getFixedSizeIcon;
    private setViewAttributes;
}
export {};
