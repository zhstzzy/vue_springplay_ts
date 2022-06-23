<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <div class="div-header">
          <img class="logo-header" src="../assets/logo.png"/>
          <span>个人运动平台</span>
        </div>
        <div style="display: flex">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
          <el-dropdown @command="handleCommand">
            <span class="username">
            {{ userInfo.username }}
            <el-icon class="el-icon--right"><!--<arrow-down/--></el-icon>
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
          <el-menu background-color="#545c64" text-color="#fff" :collapse="isCollapse" active-text-color="#409eff"
                   :collapse-transition="false" :router="true" :default-active="activePath.url" >
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
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>2022 Copyright © zhstzzy 版权所有</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, onMounted, onUpdated, watch, provide, nextTick} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";
import {ElNotification} from "element-plus";
import store from "@/store/index"
import {useRouter} from "vue-router";
import {useCookies} from "vue3-cookies";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  setup() {
    const {proxy} = useCurrentInstance();
    const { cookies } = useCookies();

    let isCollapse = ref(false);
    const userInfo = reactive({
      username:"",
      id:"",
    });
    let menuList = ref([]);
    let activePath = reactive({
      url: "/user",
    });
    const handleCommand = (command: any) => {
      if (command === 'b') {
        logout();
      } else if (command === 'a') {
        proxy.$router.push("/person")
        saveNavState("/person")
      }
    };
    const logout = () => {
      sessionStorage.clear(); //清除 session
      setTimeout(() => {
        cookies.remove("token");
        proxy.$router.push("/login");
        ElNotification({
          title: 'Success',
          message: '退出登录成功',
          type: 'success',
        })
      }, 50)

    };
    const getMenuList = async () => {
      const {data: res} = await proxy.$http.get("/menus", {params: {username: userInfo.username}});
      // console.log(res)
      if (res.code !== 200) return proxy.$message.error({showClose: true, message: res.message});
      menuList.value = res.data.menus
    };
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };
    const saveNavState = (path: string) => {
      // 放入 session 中
      // sessionStorage.set("activePath", path);
      store.commit("setActivePath", path);
      activePath.url = store.getters.getActivePath;
    };
    watch(() => store.getters.getActivePath,
        (url, prevUrl) => {
          activePath.url = store.getters.getActivePath;
        }
    );
    onMounted(() => {
      const user = store.getters.getUserInfo;
      userInfo.username = user.username;
      userInfo.id = user.id;
      activePath.url = store.getters.getActivePath;
      // username.value = sessionStorage.get("user");
      // 查询menuList
      getMenuList();
    });
    return {
      isCollapse,
      userInfo,
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

.el-footer {
  display: flex;
  justify-content: space-between;
  padding-left: 45%;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 15px;
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9eef3;
  overflow-y: scroll;
  height: 80vh;
}

/* 修改表格的滚动条*/
/deep/ .el-main__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

/* 表格滚动条的滑块*/
/deep/ .el-main__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #c8c9cc;
  border-radius: 3px;
}

/**修改全局的滚动条*/
/**滚动条的宽度*/
/deep/ ::-webkit-scrollbar {
  width: 5px;
  /*竖向*/
  height: 5px;
  /*横向*/
}

/*滚动条的滑块*/
/deep/ ::-webkit-scrollbar-thumb {
  background-color: #c8c9cc;
  border-radius: 3px;
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
  display: flex;
  flex: 2;
  margin-left: 10px;
  //margin-right: 30px;
  font-size: 30px;
  color: white
}
</style>
