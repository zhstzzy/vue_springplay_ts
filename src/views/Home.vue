<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div class="div-header">
          <img class="logo-header" src="../assets/logo.png"/>
          <span>个人运动平台</span>
        </div>
        <div>
          <el-dropdown @command="handleCommand">
          <span class="username">
            {{ username }}
            <el-icon class="el-icon--right"><arrow-down/></el-icon>
          </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a">个人中心</el-dropdown-item>
                <el-dropdown-item command="b">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff" :collapse="isCollapse"
                   :collapse-transition="false" :router="true" :default-active="activePath">
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <template #title>
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item :index="it.path" v-for="it in item.subList" :key="it.id" @click="saveNavState(it.path)">
                <i :class="it.icon"></i>
                <span>{{ it.title }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import {defineComponent,ref, reactive, onMounted} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name:"Home",
  setup() {
    const {proxy} = useCurrentInstance();

    let isCollapse = false;
    const username = ref("");
    let menuList = reactive([]);
    let activePath = "/user";
    const handleCommand = (command: any) => {
      if (command === 'b') {
        logout();
      }
    };
    const logout = () => {
      sessionStorage.clear(); //清除 session
      proxy.$router.push("/login");
    };
    const getMenuList = async () => {
      const {data: res} = proxy.$http.get("/menus");
      console.log(res);
      if (res.code !== 200) return proxy.$message.error({showClose: true, message: res.message});
      menuList=res.data.menus;
    };
    const toggleCollapse = () => {
      isCollapse = !isCollapse;
    };
    const saveNavState = (path: string) => {
      // 放入 session 中
      sessionStorage.set("activePath", path);
      activePath = path;
    };
    onMounted(() => {
      username.value = sessionStorage.get("user");
      // 查询menuList
      getMenuList();
      activePath = sessionStorage.get("activePath");
    });
    return{
      isCollapse,
      username,
      menuList,
      activePath,
      handleCommand,
      logout,
      getMenuList,
      toggleCollapse,
      saveNavState,
    }
  },
});
</script>

<style lang="less" scoped>
.home {
  height: 100%;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 2%;
  align-items: center;
  color: #fff;
  font-size: 20px;

  .div-header {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9eef3;
}

.logo-header {
  width: 65px;
  height: 65px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.username {
  margin-right: 30px;
  font-size: 20px;
  color: white
}
</style>
