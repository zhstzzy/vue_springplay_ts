<template>
  <div class="register_container">
    <!-- 注册块 -->
    <div class="box">
      <!-- 图标块 -->
      <div class="avatar_box">
        <img src="../assets/login.png"/>
      </div>
      <!-- 注册 -->
      <div class="register_form">
        <!-- 表单区域 -->
        <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerForm.password" prefix-icon="iconfont icon-password"
                      show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input type="password" v-model="registerForm.checkPassword" prefix-icon="iconfont icon-password"
                      show-password></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :rules="registerRules.email">
            <el-row>
              <el-col :span="19">
                <el-input v-model="registerForm.email" prefix-icon="iconfont icon-email"></el-input>
              </el-col>
              <el-col :span="2">
                <el-button @click="sendMail()" :disabled="send">发送</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="registerForm.code" prefix-icon="iconfont icon-code"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: -15%">
            <el-button type="primary" @click="check" style="width: 48%"> 立即注册</el-button>
            <el-button @click="gotoLogin()" style="width: 48%">返回登录</el-button>
          </el-form-item>
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
import {defineComponent, ref, reactive, watch} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";
// 滑块验证
import SlideVerify, {SlideVerifyInstance} from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import {ElNotification} from 'element-plus';

export default defineComponent({
  name: "RegisterView",
  components: {SlideVerify},
  setup: function () {
    const {proxy} = useCurrentInstance()

    const registerFormRef = ref();

    const validateName = async (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        const {data: res} = await proxy.$http.get("/user", {params: {username: value}});
        if (res.code === 200) {
          callback(res.message);
        } else {
          callback();
        }
      }
    }
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (registerForm.checkPassword !== "") {
          registerFormRef.value.validateField("checkPassword");
        }
        callback();
      }
    };
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== registerForm.password) {
        // console.log(value)
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    //邮箱验证
    const validateEmail = (rule: any, value: any, callback: any) => {
      if (!value.match("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")) {
        callback(new Error("请输入正确的邮箱地址"));
        send.value = true;
      } else {
        callback();
        send.value = false;
      }
    };

    const registerForm = reactive({
      username: "",
      password: "",
      checkPassword: "",
      email: "",
      code: "",
    })

    const registerRules = reactive({
      username: [
        {validator: validateName, trigger: "blur"},
        {required: true, message: "请输入用户名", trigger: "blur"},
        {min: 5, max: 20, message: "用户名至少要有5位", trigger: "blur"},
      ],
      password: [
        {required: true, message: "请输入密码", trigger: "blur"},
        {validator: validatePass, trigger: "blur"},
        {min: 6, message: "密码至少需要6位", trigger: "blur"},
      ],
      checkPassword: [
        {required: true, message: "请输入确认密码", trigger: "blur"},
        {validator: validatePass2, trigger: "blur"},
        {min: 6, message: "密码至少需要6位", trigger: "blur"},
      ],
      email: [
        {required: true, message: "请输入邮箱地址", trigger: "blur"},
        {validator: validateEmail, trigger: "blur"},
        // {type: "email", message: "请输入正确的邮箱地址", trigger: "blur"},
      ],
      code: [
        {required: true, message: "请输入邮箱验证码", trigger: "blur"},
        {min: 6, message: "验证码不足6位", trigger: "blur"},
      ],
    });

    const register = () => {
      registerFormRef.value.validate(async (valid: any) => {
        if (valid) {
          const {data: res} = await proxy.$http.post('/user/add',registerForm);
          // console.log(res);
          if (res.code === 200) {
            proxy.$message.success(res.message);
            proxy.$router.push({path: "/login"});
          } else {
            proxy.$message.error(res.message);
            registerFormRef.value.resetFields();
          }
        } else {
          proxy.$message.error("请先输入数据");
          console.log('error submit!!')
          return false
        }
      })
    }

    const gotoLogin = () => {
      proxy.$router.push({path: "/login"});
    };

    const send = ref(true)

    const sendMail = async () => {
      const {data: res} = await proxy.$http.get("/user/email", {params: {to: registerForm.email,text:"注册账号"}});
      if (res.code === 200) {
        ElNotification({
          title: '验证码',
          message: res.message,
          type: 'success',
        })
      } else {
        ElNotification({
          title: '验证码',
          message: "发送失败",
          type: 'error',
        })
      }
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
      msgType.value = "success";
      setTimeout(()=>{
        dialogVisible.value = false;
        register();
        block.value?.refresh();
        msg.value = "";
        msgType.value = "";
      },50)
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
      registerFormRef,
      registerForm,
      registerRules,
      gotoLogin,
      send,
      sendMail,
      register,
      // 滑块验证
      block,
      msg,
      msgType,
      dialogVisible,
      imgs,
      check,
      text: "向右滑动->",
      accuracy: 2,
      onAgain,
      onSuccess,
      onFail,
      onRefresh,
      dialogClosed,
    }
  }
});
</script>

<style lang="less" scoped>
.register_container {
  background-color: #2b4b6b;
  height: 100%;
}

.box {
  width: 450px;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  //top: 10px;
  transform: translate(-50%, 50%);

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

.register_form {
  position: absolute;
  bottom: 5%;
  width: 100%;
  padding-right: 30px;
  box-sizing: border-box;
}
</style>
