<template>
  <div></div>
</template>

<script lang="ts" setup>
import useCurrentInstance from "@/hook/useCurrentInstance";

const {proxy} = useCurrentInstance();
proxy.$alert('登录信息失效！', '提示', {
  confirmButtonText: '确定',
}).then((response:any) => {
  sessionStorage.clear();
  proxy.$router.replace({path: '/login'})
});
</script>

<style scoped>

</style>