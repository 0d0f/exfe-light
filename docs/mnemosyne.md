X-Photos Module Roadmap
-----------------------
> 开发路线

## html & css 结构 样式

## 功能
  * x-photos
    * x widget
    * panel (图片展示)
      1. 获取 feed 数据
      2. 图片排列, 展示
      3. 滚动浏览、window resize 自适应, 重新刷新排列布局
      4. 大图浏览
      5. 导航
      6. 渐进动画
  * 各个图片服务商 OAuth 流程

## 时间
  * 2013-01-17
    制定开发周期

  * 2013-01-18
    html css 基本结构样式

  * 2013-01-21
    * 跟 @leaskh 定义 feed 数据结构
    * 构造测试数据
    * 结合数据结构，给 html 添加适当的属性
    * `XPhotos` Class
      * getFeed: feed 数据接口
        1. 请求数据
        2. 增量请求
      * generateItem: 每个图片 item 结构
      * generateHTML: 根据 feed，生产 html 结构
      * createNavBar: 根据 feed，生产 navbar
      * filter feed:
        * 筛选 feed, 定义类似 tag, cate, date 等
      * resize: 刷新图片列表
      * 排序算法: date, user, source
      * bind events
        * item
          - prev
          - next
          - mouseenter
          - mouseleave
          - click / show big pic
          - esc / exit
        * `navbar`
          - click --> show `item`
        * window resize
          监听窗口变化，改变刷新图片排列布局
      * etc...
    * Comment 评论
    * 提升交互体验
    * `exit`

## 功能

### Pic Item Class (图片 Object)
  - Struct
    ```js
    {
      // property
      id
      date
      identity
      source
      // function
      generateHTML
    }
    ```
    ```html
      div#id.photo-item
    ```
  - APIs
    * id
    * generateHTML: 生产图片 HTML 结构



### Layout Engine Class (排版引擎)
  - Struct
    ```js
    {
      // property
      // function
    }
    ```
  - Responsibility (职责): 负责图片排版
  - APIs
    * generateHTML: 生产 HTML 结构
    * render: 渲染 HTML 结构，插入 DOM 中
