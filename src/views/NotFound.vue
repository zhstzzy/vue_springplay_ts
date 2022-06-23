<template>
  <div>

    <div class="error">
      <div>当前网页不存在，请检查网址是否正常</div>
      <span class="aaa">404</span> <br><br><br><br><br><br>
      <span class="bbb"><router-link to="/">返回首页</router-link></span>
    </div>

  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.error {
  text-align: center;
  margin-top: 25px;
  height: 600px;
}

.aaa {
  font-size: 250px;
  color: black;
  font-family: '方正舒体'
}

.bbb {
  font-size: 80px;
  color: white;
  font-family: '方正舒体'
}
</style>