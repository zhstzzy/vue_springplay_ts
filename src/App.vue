<template>
  <router-view v-if="isRouterActive"></router-view>
</template>

<script lang="ts">
import {defineComponent, nextTick, provide, ref} from 'vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import store from "@/store";

import {storage} from "@/hook/session";

export default defineComponent({
  name: 'App',
  setup: function () {
    const isRouterActive = ref(true)
    provide('reload', () => {
      isRouterActive.value = false;
      nextTick(() => {
        isRouterActive.value = true;
      })
    })
    //在页面加载时读取sessionStorage里的状态信息
    if (storage.get("store")) {
      store.replaceState(Object.assign({}, store.state, storage.get("store")));
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      storage.set("store", store.state);
    })

    return {
      locale: zhCn,
      isRouterActive,
    }
  }
})
</script>

<style>
</style>
