<template>
  <div></div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Error",
  created() {
    this.$alert('登录信息失效！', '提示', {
      confirmButtonText: '确定',
    }).then((response) => {
      localStorage.removeItem("user");
      this.$router.replace({path: '/login'})
    });
  }
}
</script>

<style scoped>

</style>