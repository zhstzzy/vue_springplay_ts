<template>
  <div>
    用户列表
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  用户列表主体部分  -->
    <el-card>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入搜索内容" v-model="pagination.username" @keyup.enter="getUserList">
            <!--  搜索区域  -->
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮  -->
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 50px;">
        <el-table current-row-key="id" :data="userList" stripe highlight-current-row border>
          <el-table-column type="index" align="center" label="序号"></el-table-column>
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
          <el-table-column prop="role" label="角色" align="center">
            <template #default="scope">
              <el-popover effect="light" trigger="hover" placement="top" width="auto">
                <template #default>
                  <div>角色: {{ scope.row.role }}</div>
                </template>
                <template #reference>
                  <el-tag :type="scope.row.role === '普通用户' ? 'info' : scope.row.role === '超级管理员' ? 'success' : ''">
                    {{ scope.row.role }}
                  </el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.state === true ? 'success' : 'danger'">
                {{ scope.row.state === true ? '已激活' : '未激活' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                         :disabled="scope.row.role==='超级管理员'?true:false">编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
                         :disabled="scope.row.role==='超级管理员'?true:false">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
              class="pagiantion"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, onMounted} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";

export default defineComponent({
  name: "HomeView",
  setup() {
    const {proxy} = useCurrentInstance();

    const pagination = reactive({//分页相关模型数据
      currentPage: 1,//当前页码
      pageSize: 10,//每页显示的记录数
      total: 0,//总记录数
      username: "",//用户名
    });
    let userList = reactive([]);

    // 获取全部用户
    const getUserList = async () => {
      const url = "/user/" + pagination.currentPage + "/" + pagination.pageSize;
      console.log(pagination.username);
      const {data: res} = await proxy.$http.get(url, {params: {username: pagination.username}});
      console.log(res);
      if (res.code === 200) {
        pagination.pageSize = res.data.size;
        pagination.currentPage = res.data.current;
        pagination.total = res.data.total;
        userList = res.data.records;
      }
    };
    //切换页码
    const handleCurrentChange = (currentPage: any) => {
      // 修改页码值为当前选中的页码值
      pagination.currentPage = currentPage;
      // 执行查询
      getUserList();
    };
    const handleSizeChange = (pageSize: any) => {
      pagination.pageSize = pageSize;
      getUserList();
    }
    // 删除
    const handleDelete = (row: any) => {
      // console.log(row)
      proxy.$confirm("此操作将永久删除当前信息，是否继续？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        proxy.$http.delete("/books/" + row.id).then((res: any) => {
          if (res.data.flag) {
            proxy.$message.success("删除成功");
          } else {
            proxy.$message.error("数据同步失败，自动刷新");
          }
        }).finally(() => {
          // 重新加载数据
          getUserList();
        });
      }).catch(() => {
        proxy.$message.info("取消操作");
      });
    };
    const handleEdit = (index: any, row: any) => {
      console.log(index, row)
    };

    onMounted(() => {
      getUserList();
    });
    return {
      pagination,
      userList,
      getUserList,
      handleCurrentChange,
      handleSizeChange,
      handleDelete,
      handleEdit
    }
  },
});
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}

.pagiantion {
  text-align: right;
  padding: 15px;
}
</style>