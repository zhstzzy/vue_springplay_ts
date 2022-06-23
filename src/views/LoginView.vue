<template>
  <div class="login_container">
    <!-- 登录块 -->
    <div class="box">
      <!-- 图标块 -->
      <div class="avatar_box">
        <img src="../assets/login.png"/>
      </div>
      <!-- 登录 -->
      <div class="login_form">
        <!-- 表单区域 -->
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="100px">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-password" type="password" show-password
                      @keyup.enter="handleEnter($event)"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item>
            <el-button type="primary" @click="check" class="btns">登录</el-button>
            <!-- <el-button @click="resetLoginForm('loginFormRef')">注册</el-button> -->
          </el-form-item>
          <!-- 注册跳转 -->
          <el-row style="text-align: center; margin-left: 40%">
            <el-link href="/register">没有账号？立即注册</el-link>
          </el-row>
        </el-form>
      </div>
    </div>
    <el-dialog title="请完成安全验证" v-model="dialogVisible" width="360px" center v-loading="true" @closed="dialogClosed">
      <div class="verification-slide">
        <el-alert :title="msg" :type="msgType" effect="dark"/>
        <slide-verify
            ref="block"
            :slider-text="text"
            :accuracy="accuracy"
            :imgs="imgs"
            @again="onAgain"
            @success="onSuccess"
            @fail="onFail"
            @refresh="onRefresh"
        ></slide-verify>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";

// 滑块验证
import SlideVerify, {SlideVerifyInstance} from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import store from "@/store";


export default defineComponent({
  name: "LoginView",
  components: {SlideVerify},
  setup() {
    const {proxy} = useCurrentInstance();

    const loginFormRef = ref();
    const loginForm = reactive({
      username: "",
      password: "",
    });

    const loginRules = reactive({
      username: [
        {required: true, message: "用户名为必填项", trigger: "blur"},
        {min: 4, max: 12, message: "用户名需要在 4 ~ 12 个字符", trigger: "blur"},
      ],
      password: [
        {required: true, message: "密码为必填项", trigger: "blur"},
        {min: 6, message: "密码至少需要6位", trigger: "blur"},
      ],
    });

    const login = () => {
      loginFormRef.value.validate(async (valid: any) => {
        if (valid) {
          const {data: res} = await proxy.$http.post("/login", loginForm);
          // console.log(res);
          if (res.code !== 400) {
            proxy.$message.success(res.message);
            // sessionStorage.set("username", res.data.username);
            store.commit("setUserInfo", res.data)
            if (res.data.role.indexOf("管理员") != -1) {
              proxy.$router.push({path: "/user"});
              store.commit("setActivePath","/user")
            } else {
              proxy.$router.push({path: "/introduction"});
              store.commit("setActivePath","/introduction")
            }
          } else {
            proxy.$message.error(res.message);
            loginFormRef.value.resetFields();
          }
        } else {
          proxy.$message.error("请输入用户名或密码");
          console.log('error submit!!')
          return false
        }
      })
    };
    const handleEnter = (event: any) => {
      // console.log(event)
      event.target.blur();
      check();
    };
    const gotoRegister = () => {
      proxy.$router.push({path: "/register"});
    };

    // 滑块验证
    const msg = ref("");
    const msgType = ref("")
    const block = ref<SlideVerifyInstance>();
    const dialogVisible = ref(false)
    const imgs = [
      require('@/assets/silder/slider_bg_1.jpg'),
      require('@/assets/silder/slider_bg_2.jpg'),
      require('@/assets/silder/slider_bg_3.jpg'),
      require('@/assets/silder/slider_bg_4.jpg'),
    ];
    //显示弹窗
    const check = () => {
      dialogVisible.value = true;
    }

    const onAgain = () => {
      msg.value = "检测到非人为操作的哦！ try again";
      msgType.value = "error";
      // 刷新
      block.value?.refresh();
    };

    const onSuccess = (times: number) => {
      msg.value = `验证成功, 耗时${(times / 1000).toFixed(1)}s`;
      msgType.value = "success"
      setTimeout(() => {
        login();
        dialogVisible.value = false;
        block.value?.refresh();
        msg.value = "";
        msgType.value = "";
      }, 10);
    };

    const onFail = () => {
      msg.value = "验证不通过";
      msgType.value = "error";
    };

    const onRefresh = () => {
      msg.value = "点击了刷新小图标";
      msgType.value = "info";
    };
    const dialogClosed = () => {
      // 刷新
      block.value?.refresh();
      msg.value = "";
      msgType.value = "";
    }

    return {
      loginFormRef,
      loginForm,
      loginRules,
      handleEnter,
      login,
      gotoRegister,
      loading: true,
      // 滑块验证
      block,
      msg,
      msgType,
      dialogVisible,
      check,
      imgs,
      text: "向右滑动->",
      accuracy: 2,
      onAgain,
      onSuccess,
      onFail,
      onRefresh,
      dialogClosed,
    };
  },
});
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.box {
  width: 450px;
  height: 320px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 25px;
  transform: translate(-50%, 78%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 70%;
    padding: 5px;
    box-shadow: 0 0 2px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #eee;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  text-align: center;
  width: 85%;
  transform: translate(-2%);
}

.login_form {
  position: absolute;
  bottom: 5%;
  width: 100%;
  padding-right: 30px;
  box-sizing: border-box;
}
</style>
