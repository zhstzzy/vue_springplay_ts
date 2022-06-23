<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }" @click="saveNavState">首页
    </el-breadcrumb-item>
    <el-breadcrumb-item>{{ msg.one }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ msg.two }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
import {inject} from "vue";
import {sessionStorage} from "@/hook/sessionStorage";
import store from "@/store";
import useCurrentInstance from "@/hook/useCurrentInstance";

const props = defineProps<{ msg: object }>();
const {proxy} = useCurrentInstance()


const saveNavState = () => {
  store.commit("setActivePath",proxy.$router.name);
};
</script>
<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}
</style>