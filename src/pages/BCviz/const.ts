import type { NavigateOptions } from "react-router";

const { freeze } = Object;
export const commonUseSearchParams: NavigateOptions = freeze({
  replace: true,//该参数用于指定导航时是否替换当前历史记录条目，而不是在历史记录中添加新的条目。默认值为 false，即导航时会在历史记录中添加新的条目，用户可以通过浏览器的后退按钮返回上一个页面；当设置为 true 时，当前的历史记录条目会被替换，用户无法通过后退按钮回到被替换的页面。
  // state: any,//该参数允许你在导航时传递任意数据到目标页面。传递的数据可以在目标页面通过 useLocation 钩子获取到。这在需要在不同页面之间传递数据，而又不想通过 URL 参数传递时非常有用。
  preventScrollReset: false,//该参数用于控制导航后页面滚动位置是否重置。默认情况下，导航到新页面时，页面会滚动到顶部；当设置为 true 时，页面滚动位置将保持不变。
  // relative: RelativeRoutingType,//该参数用于指定相对导航的类型。RelativeRoutingType 是一个枚举类型，有以下几种可能的值：'route'：表示相对于当前路由进行导航。'path'：表示相对于当前路径进行导航。

  flushSync: false,//该参数用于控制导航是否同步执行。默认情况下，导航是异步执行的；当设置为 true 时，导航会同步执行，这意味着在导航完成之前，后续代码不会继续执行(下面的代码会在导航完成后执行)。
  viewTransition: true,//该参数用于控制是否启用视图过渡效果。当设置为 true 时，在导航过程中会启用浏览器的视图过渡 API（如果浏览器支持），可以实现平滑的页面过渡动画效果。
});