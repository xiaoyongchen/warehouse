# vue 技巧

## Suspense

Suspense 组件有两个插槽：#default 和 #fallback。两个插槽都只允许一个直接子节点。在可能的时候都将显示默认槽中的节点。否则将显示后备槽中的节点。

```template
  <Suspense>
    <!-- 具有深层异步依赖的组件 -->
    <Dashboard />

    <!-- 在 #fallback 插槽中显示 “正在加载中” -->
    <template #fallback>
      Loading...
    </template>
  </Suspense>
```

:::warning
  **实验性功能**

  还未成稳定版本
:::

## vue-router lifeCycle

* 导航触发.
* 当前路由调用`beforeRouteLeave`
* 调用全局`beforeEach`.
* 触发`beforeRouteUpdate`.
* 调用全局`beforeEnter`.
* 解析异步路由组件.
* 调用 `beforeRouteEnter`的激活组件.
* 触发全局的`beforeResolve`的callback.
* 导航完成.
* 触发全局hooks:`afterEach`.
* 触发Dom更新.
* 在激活组件中`beforeRouteEnter`的hooks中调用next方法.

## props `validator`

:::tip

   使用 prop 定义中的 validator 选项，可以将一个 prop 类型限制在一组特定的值中。

:::