# Swiper轮播图插件



## 1、背景

>在做`微信小程序`项目的时候，发现微信小程序提供的`轮播图`插件不能满足需求，于是在网上找了很多关于`微信小程序`的轮播图插件，但是都找不到合适的，就想着自己封装一个小程序轮播图插件，本来想以`微信小程序`的方式封装，但是有现成的[Swiper](https://www.swiper.com.cn/)库参考，于是就用原生JS封装后，想着封装好之后再移植到微信小程序，但是由于某些原因，目前还没有移植到微信小程序，以后有机会再进行封装成小程序版本。



## 2、用法示例

```html
<!-- 1.引进样式和js -->
<link rel="stylesheet" type="text/css" href="css/swiper.css">
<script type="text/javascript" src="js/swiper.js"></script>

<!-- 2.固定结构 -->
<div class="swiper-container">
    <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class=" swiper-slide">Slide 4</div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"><span class="arrow"></span></div>
    <div class="swiper-button-next"><span class="arrow"></span></div>
</div>

<!-- 3.固定结构 -->
<script type="text/javascript">
    var swiper2 = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 'auto',
        pagination: '.swiper-container1 .swiper-pagination',
        loop: true,
        autoplay: 2000,
        spaceBetween: 0,
     	autoplayDisableOnInteraction: false,
        freeMode: true,
        spaceBetween: 30,
        paginationClickable: true,
        speed: 300，
        onInit: function(swiper) {}
   	})
</script>
```



## 3、API 文档

### 3.1 Swiper 初始化

```js

// 用于初始化一个Swiper，返回初始化后的Swiper实例
// container : 必选，Swiper容器的css选择器，例如“.swiper-container”。
// options : 可选，参见 配置选项。
new Swiper(container, options)
```



### 3.2、配置选项（options）

```js
{
    // 设定初始化时slide的索引。
    initialSlide: 0, 
    // Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。 默认为水平方向（horizontal）
    direction: 'horizontal', 
    // 滑动速度，默认300ms
    speed: 300, 
    // 自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换
    autoplay: 5000, 
    // 用户操作swiper之后，是否禁止autoplay。默认为true：停止。
    autoplayDisableOnInteraction: true, 
    // 默认为false，设置为true则变为free模式，slide会根据惯性滑动且不会贴合 为true时 loop失效
    freeMode: false, 
    // 设置slider容器能够同时显示的slides数量(carousel模式)。'auto'则自动根据slides的宽度来设定数量
    slidesPerView: 1, 
    // 设置为true 则开启loop模式。无缝滚动模式
    loop: false,
    //是否启用弹力动画效果，关掉可以加速 默认为true
    bounce: true, 
    // 此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
    paginationClickable: true, 
    // slide之间的距离（单位px） 默认为0
    spaceBetween: 0, 
    // 设置为true则点击slide会过渡到这个slide。
    slideToClickedSlide: false, 
    // 双向控制变量， 在初始化的时候传进 Swiper 对象 可进行双向控制
    control: [] || swiper
}
```


### 3.3、回调函数

```js
{	
    // 初始化后执行。接受Swiper实例作为参数
    onInit: function(swiper) {},
    // 当碰触到slider时执行。可选Swiper实例和touchstart事件对象作为参数
    onTouchStart: function(swiper, e) {},
    // 手指触碰Swiper并滑动（手指）时执行 可选Swiper实例和touchstart事件对象作为参数
    onTouchMove: function(swiper, e){},
    // 手指松开时执行 可选Swiper实例和touchstart事件对象作为参数
    onTouchEnd: function(swiper, e){},
    // swiper从当前slide开始过渡到另一个slide时执行。触摸情况下，如果释放slide时没有达到过渡条件而回弹时不会触发这个函数
    onSlideChangeStart: function(swiper){},
    // 过渡开始时触发，接受Swiper实例作为参数。
    onTransitionStart: function(swiper) {},
    // 过渡结束时触发，接收Swiper实例作为参数。
    onTransitionEnd: function(swiper){},
    // 当你点击或轻触Swiper 300ms后执行。接收Swiper实例作为参数。
    onClick: function(swiper){},
    // 当你轻触(tap)Swiper后执行 只在移动端起效。接收Swiper实例作为参数。
    onTap: function(swiper) {}
}
```



### 3.4、属性选项

```js
var swiper = new Swiper(container, options)
// 返回当前活动块(激活块)的索引。loop模式下注意该值会被加上复制的slide数。
swiper.activeIndex; 
// 返回当前活动块的索引，与activeIndex不同的是，在loop模式下不会将复制的块的数量计算在内。
swiper.realIndex; 
// 返回最后点击Slide的索引。(click)
swiper.clickedIndex; 
// 返回最后点击的Slide(HTML元素)。
swiper.clickedSlide; 
// 轮播图总数
swiper.total; 
// 从按下到松开拖动x轴的距离
swiper.moveX; 
// 从按下到松开拖动y轴的距离
swiper.moveY;
```



### 3.5、方法

```js
var swiper = new Swiper(container, options)
// Swiper切换到指定slide。参数:index:指定切换到的slide(必须) cb: 切换完成后的回调函数
swiper.slideTo(index, cb); 
// 滑动到下一个滑块。参数: cb: 切换完成后的回调函数
swiper.slideNext(cb); 
// 滑动到上一个滑块。参数: cb: 切换完成后的回调函数
swiper.slidePrev(cb); 
// 开始自动播放
swiper.startAutoplay(); 
// 永久停止自动播放 
swiper.stopAutoplay(); 
// 用户操作暂时性停止自动播放 当用户操作完成之后还是会自动播放
swiper.stopTmpAutoplay();
// 返回当前wrapper位移
swiper.getWrapperTranslate();
// 手动设置wrapper的位移。参数： translate: 200 指定距离  duration: 200 这个位移的动画时间 单位ms
swiper.setWrapperTranslate(translate, duration);
```



此插件参考了[Swiper](<https://www.swiper.com.cn/>) 和 [iScroll ](<http://caibaojian.com/iscroll-5/>)

非常感谢 [Swiper](<https://www.swiper.com.cn/>) 和 [iScroll ](http://caibaojian.com/iscroll-5/)这些非常优秀的开源库

此插件写的比较混乱，如果你有好的意见或建议，欢迎给我提issue或pull request。



## License 开源协议

[MIT](http://opensource.org/licenses/MIT)