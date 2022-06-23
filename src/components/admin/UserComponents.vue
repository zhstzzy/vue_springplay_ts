<template>
  <div>
    <!--    用户列表-->
    <bread-crumb :msg="{one:'权限列表',two:'用户列表'}"/>
    <!--  用户列表主体部分  -->
    <el-card>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入搜索的用户名" v-model="pagination.username" clearable @clear="getUserList "
                    @keyup.enter="getUserList">
            <!--  搜索区域  -->
            <template #append>
              <el-button type="primary" icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <!--        <el-col :span="4">
                  &lt;!&ndash; 添加用户按钮  &ndash;&gt;
                  <el-button type="primary">添加用户</el-button>
                </el-col>-->
      </el-row>
      <div style="margin-top: 20px;">
        <el-table current-row-key="id" height="580px" :data="pagination.userList" highlight-current-row border>
          <el-table-column type="index" align="center" label="序号" width="65"></el-table-column>
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center" sortable></el-table-column>
          <el-table-column prop="role" label="角色" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.role === '普通用户' ? 'info' : scope.row.role === '超级管理员' ? 'success' : ''">
                {{ scope.row.role }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="state" label="状态" align="center" width="150">
            <template #default="scope">
              <el-tooltip :content="scope.row.state === true ? '当前用户已激活' : '未激活'" placement="top">
                <el-switch
                    v-model="scope.row.state"
                    class="mb-2"
                    :disabled="scope.row.state"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="updateUserState(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"
                         :disabled="scope.row.role==='超级管理员'?true:false">
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"
                         :disabled="scope.row.role==='超级管理员'?true:false">
              </el-button>
              <el-tooltip effect="dark" content="权限分配" placement="top-start" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"
                           @click="handleEditRole(scope.$index,scope.row)"
                           :disabled="scope.row.role==='超级管理员'?true:false"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
              class="pagiantion"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-sizes="[1,5, 10, 15, 20]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <div>
      <el-dialog title="修改用户信息" v-model="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="id">
            <el-input v-model="editForm.id" disabled></el-input>
          </el-form-item>
          <!-- 用户名 -->
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="editForm.password"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, reactive, onMounted, inject} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {ElNotification, ElMessage, ElMessageBox} from 'element-plus'
import {sessionStorage} from "@/hook/sessionStorage";
import BreadCrumb from "@/components/BreadCrumb.vue";
import store from "@/store";

export default defineComponent({
  name: "HomeView",
  components: {BreadCrumb},
  setup() {
    const {proxy} = useCurrentInstance();

    const pagination = reactive({//分页相关模型数据
      currentPage: 1,//当前页码
      pageSize: 10,//每页显示的记录数
      total: 0,//总记录数
      username: "",//用户名
      userList: [],
    });

    // 获取全部用户
    const getUserList = async () => {
      const url = "/user/" + pagination.currentPage + "/" + pagination.pageSize;
      // console.log(pagination.username);
      const {data: res} = await proxy.$http.get(url, {params: {username: pagination.username}});
      // console.log(res);
      if (res.code === 200) {
        pagination.pageSize = res.data.size;
        pagination.currentPage = res.data.current;
        pagination.total = res.data.total;
        pagination.userList = res.data.records;
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
    const updateUserState = async (row: any) => {
      const data = {state: row.state, id: row.id}
      // console.log(data)
      const {date: res} = await proxy.$http.post("/user", data);
      if (res.code === 200) {
        ElNotification({
          title: 'Success',
          message: res.message,
          type: 'success',
        })
      } else {
        ElNotification({
          title: 'Error',
          message: res.message,
          type: 'error',
        })
      }
    }

    // 删除
    const handleDelete = (index: any, row: any) => {
      // console.log(row)
      ElMessageBox.confirm("此操作将永久删除当前信息，是否继续？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        proxy.$http.delete("/user/" + row.id).then(({data: res}: any) => {
          // console.log(res)
          if (res.code === 200) {
            ElMessage({type: 'success', message: res.message});
          } else {
            ElMessage.error({type: 'error', message: "数据同步失败，自动刷新"});
          }
        }).finally(() => {
          // 重新加载数据
          getUserList();
        });
      }).catch(() => {
        ElMessage.info("取消操作");
      });
    };

    //修改用户
    const editForm = reactive({
      id: "",
      username: "",
      password: "",
      email: ""
    });
    const editFormRef = ref();
    const editFormRules = reactive({
      password: [
        {required: true, message: "请输入密码", trigger: "blur"},
        {min: 6, message: "密码至少需要6位", trigger: "blur"},
      ],
      email: [
        {required: true, message: "请输入邮箱地址", trigger: "blur"},
        {type: "email", message: "请输入正确的邮箱地址", trigger: "blur"},
      ],
    });
    const editDialogVisible = ref(false);
    const editDialogClosed = () => {
      editDialogVisible.value = false
      editFormRef.value.resetFields();
    };

    const handleEdit = (index: any, row: any) => {
      editForm.id = row.id;
      editForm.username = row.username;
      editForm.email = row.email;
      editForm.password = "";
      editDialogVisible.value = true;
    };
    const editUserInfo = () => {
      editFormRef.value.validate(async (valid: any) => {
        if (valid) {
          const {data: res} = await proxy.$http.post("/user/edit", editForm)
          // console.log(res)
          if (res.code === 200) {
            editDialogVisible.value = false;
            ElNotification({
              title: '消息',
              message: res.message,
              type: 'success',
            })
          } else {
            ElNotification({
              title: '消息',
              message: res.message,
              type: 'error',
            })
          }
        }
      })
    };

    const handleEditRole = (index: any, row: any) => {
      // console.log(row);
      const data = {id:row.id,role:row.role};
      const msg = row.role === "普通管理员" ? "普通用户":"普通管理员";
      ElMessageBox.confirm("是否修改当前用户为" + msg, "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        data.role = msg;
        // console.log(data)
        proxy.$http.post("/user/role" , data).then(({data: res}: any) => {
          // console.log(res)
          if (res.code === 200) {
            ElNotification({type: 'success', message: res.message,title:"提示"});
          } else {
            ElNotification({type: 'error', message: res.message,title:"提示"});
          }
        }).finally(() => {
          // 重新加载数据
          getUserList();
        });
      }).catch(() => {
        proxy.$message.info("取消操作");
      });
    }

    onMounted(() => {
      getUserList();
    });
    return {
      pagination,
      getUserList,
      handleCurrentChange,
      handleSizeChange,
      updateUserState,
      handleDelete,
      editForm,
      editFormRef,
      editFormRules,
      editDialogVisible,
      editDialogClosed,
      handleEdit,
      editUserInfo,
      handleEditRole,
    }
  },
});
</script>

<style lang="less" scoped>
.pagiantion {
  text-align: right;
  padding: 15px;
}
</style>