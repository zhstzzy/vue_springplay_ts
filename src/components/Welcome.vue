<template>
  <div>
    <h3>欢迎使用个人运动管理平台！！！！</h3>
  </div>
</template>

<script lang="ts" setup>
import useCurrentInstance from "@/hook/useCurrentInstance";
import {onMounted} from "vue";
import store from "@/store";

const {proxy} = useCurrentInstance();
onMounted(()=>{
  store.commit("setActivePath",proxy.$router.name);
})
</script>

<style lang="less" scoped>
/* @import url(); 引入css类 */
</style>
