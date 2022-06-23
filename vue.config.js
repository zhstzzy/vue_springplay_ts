const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  // publicPath: './', // build 的时候启用
  transpileDependencies: true,
  lintOnSave: false,
});
