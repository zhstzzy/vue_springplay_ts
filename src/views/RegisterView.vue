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
                <el-button @click="sendMail()">发送</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="registerForm.code" prefix-icon="iconfont icon-code"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: -15%">
            <el-button type="primary" @click="submitForm('registerForm')" style="width: 48%"> 立即注册</el-button>
            <el-button @click="gotoLogin()" style="width: 48%">返回登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, onMounted} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";

export default defineComponent({
  name: "RegisterView",
  setup() {
    const {proxy} = useCurrentInstance()

    const registerFormRef = ref();

    const validateName = async (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        const {data: res} = await proxy.$http.get("/user", {params: {username: value}});
        console.log(res);
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
        if (registerFormRef.value.checkPassword !== "") {
          registerFormRef.value.validateField("checkPassword");
        }
        callback();
      }
    };
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== registerFormRef.value.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    const registerForm = reactive({
      username: "",
      password: "",
      checPassword: "",
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
      ],
      email: [
        {required: true, message: "请输入邮箱地址", trigger: "blur"},
        {type: "email", message: "请输入正确的邮箱地址", trigger: "blur"},
      ],
      code: [
        {required: true, message: "请输入邮箱验证码", trigger: "blur"},
        {min: 6, message: "验证码不足6位", trigger: "blur"},
      ],
    });

    const gotoLogin = () => {
      proxy.$router.push({path: "/login"});
    };

    const sendMail=()=>{

    };
    return{
      registerFormRef,
      registerForm,
      registerRules,
      gotoLogin,
    }
  }
  // data() {
  //   var validateName = (rule, value, callback) => {
  //     if (value === "") {
  //       callback(new Error("请输入用户名"));
  //     } else {
  //       this.axios.get("/demo/api/findUsername", { params: { username: value } }).then((res) => {
  //         // console.log(res);
  //         if (res.data.type == "error") {
  //           callback(res.data.message);
  //         } else {
  //           callback();
  //         }
  //       });
  //     }
  //   };
  //   var validatePass = (rule, value, callback) => {
  //     if (value === "") {
  //       callback(new Error("请输入密码"));
  //     } else {
  //       if (this.ruleForm.checkPassword !== "") {
  //         this.$refs.registerForm.validateField("checkPassword");
  //       }
  //       callback();
  //     }
  //   };
  //   var validatePass2 = (rule, value, callback) => {
  //     if (value === "") {
  //       callback(new Error("请再次输入密码"));
  //     } else if (value !== this.registerForm.password) {
  //       callback(new Error("两次输入密码不一致!"));
  //     } else {
  //       callback();
  //     }
  //   };
  //   return {
  //     registerForm: {
  //       username: "",
  //       password: "",
  //       checPassword: "",
  //       email: "",
  //       code: "",
  //     },
  //     registerRules: {
  //       username: [
  //         { validator: validateName, trigger: "blur" },
  //         { required: true, message: "请输入用户名", trigger: "blur" },
  //         { min: 5, max: 20, message: "用户名至少要有5位", trigger: "blur" },
  //       ],
  //       password: [
  //         { required: true, message: "请输入密码", trigger: "blur" },
  //         { validator: validatePass, trigger: "blur" },
  //         { min: 6, message: "密码至少需要6位", trigger: "blur" },
  //       ],
  //       checkPassword: [
  //         { required: true, message: "请输入确认密码", trigger: "blur" },
  //         { validator: validatePass2, trigger: "blur" },
  //       ],
  //       email: [
  //         { required: true, message: "请输入邮箱地址", trigger: "blur" },
  //         { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
  //       ],
  //       code: [
  //         { required: true, message: "请输入邮箱验证码", trigger: "blur" },
  //         { min: 6, message: "验证码不足6位", trigger: "blur" },
  //       ],
  //     },
  //   };
  // },
  // methods: {
  //   gotoLogin() {
  //     this.$router.push({ path: "/login" });
  //   },
  // },
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
  top: 25px;
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
