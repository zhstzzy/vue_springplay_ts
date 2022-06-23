<template>
  <div>
    <bread-crumb :msg="{one:'用户',two:'个人页面'}"></bread-crumb>
    <el-card>
      个人信息
      <el-form class="userForm" :model="user.info" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="user.info.username" disabled prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-row>
            <el-col :span="17">
              <el-input v-model="user.info.password" type="password" disabled
                        prefix-icon="iconfont icon-password"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button @click="handleEdit">修改密码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-row>
            <el-col :span="17">
              <el-input v-model="user.info.email" disabled prefix-icon="iconfont icon-email"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button @click="emailHandleEdit">修改邮箱</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      课程信息
      <el-table current-row-key="id" :data="pagination.userSubjectList" style="width: 100%;margin-top: 20px" height="330px"
                highlight-current-row border>
        <el-table-column type="index" label="序号" align="center" width="65"/>
        <el-table-column prop="subname" label="课程名称" width="230" align="center"/>
        <el-table-column prop="detail" label="详情" show-overflow-tooltip align="center"/>
        <el-table-column prop="startTime" label="开始时间" align="center"/>
        <el-table-column prop="endTime" label="结束时间" align="center"/>
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">
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
            :page-sizes="[1,5, 10, 15, 20]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
        v-model="dialogVisiblePassword"
        title="修改密码"
        width="30%"
        :before-close="handleClose"
    >
      <el-form class="userForm" :model="editForm" ref="editFormRef" :rules="editFormRule"
               label-width="100px">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="editForm.oldPassword" type="password" prefix-icon="iconfont icon-password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="editForm.newPassword" type="password" prefix-icon="iconfont icon-password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkNewPassword">
          <el-input v-model="editForm.checkNewPassword" type="password" prefix-icon="iconfont icon-password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="changePassword">确定</el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog
        v-model="dialogVisibleEmail"
        title="修改邮箱"
        width="30%"
        :before-close="emailHandleClose"
    >
      <el-form class="userForm" :model="editForm" ref="editFormRef" :rules="editFormRule"
               label-width="100px">
        <el-form-item prop="email" label="邮箱">
          <el-row>
            <el-col :span="19">
              <el-input v-model="editForm.email" prefix-icon="iconfont icon-email"></el-input>
            </el-col>
            <el-col :span="2">
              <el-button @click="sendMail()" :disabled="send">发送</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="editForm.code" prefix-icon="iconfont icon-code"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="emailHandleClose">取消</el-button>
        <el-button type="primary" @click="changeEmail">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {onMounted, reactive, ref} from "vue";
import useCurrentInstance from "@/hook/useCurrentInstance";
import {sessionStorage} from "@/hook/sessionStorage";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import store from "@/store";

const {proxy} = useCurrentInstance();

const user = reactive({
  info: {
    id: "",
    username: "",
    password: "",
    email: "",
  }
});

const getUserInfo = async () => {
  const data = store.getters.getUserInfo;
  const {data: res} = await proxy.$http.get("/user/" + data.id);
  // console.log(res)
  if (res.code === 200) {
    user.info = res.data;
    user.info.password = "********";
  }
};

const dialogVisiblePassword = ref(false);
const dialogVisibleEmail = ref(false);

const editFormRef = ref();

const editForm = reactive({
  id: "",
  username: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  checkNewPassword: "",
  code: "",
});

const validateOldPass = async (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入旧密码"));
  } else {
    const {data: res} = await proxy.$http.post("/login", {
      username: editForm.username,
      password: editForm.oldPassword
    });
    if (res.code === 200) {
      callback();
    } else {
      callback(new Error("当前密码错误"))
    }
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入旧密码"));
  } else {
    if (editForm.checkNewPassword !== "") {
      editFormRef.value.validateField("checkNewPassword");
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入确认密码"));
  } else if (value !== editForm.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const send = ref(false);

const sendMail = async () => {
  const {data: res} = await proxy.$http.get("/user/email", {params: {to: editForm.email, text: "更换邮箱"}});
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

const editFormRule = reactive({
  oldPassword: [
    {required: true, message: "请输入旧密码", trigger: "blur"},
    {validator: validateOldPass, trigger: "blur"},
    {min: 6, message: "密码至少需要6位", trigger: "blur"},
  ],
  newPassword: [
    {required: true, message: "请输入新密码", trigger: "blur"},
    {validator: validatePass, trigger: "blur"},
    {min: 6, message: "密码至少需要6位", trigger: "blur"},
  ],
  checkNewPassword: [
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

const handleClose = () => {
  dialogVisiblePassword.value = false;
  editFormRef.value.resetFields();
};
const handleEdit = () => {
  dialogVisiblePassword.value = true;
  editForm.id = user.info.id;
  editForm.username = user.info.username;
};
const handleDelete = (index:any,row:any)=>{
  // console.log(row)
  ElMessageBox.confirm("此操作将永久删除当前信息，是否继续？", "提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    proxy.$http.delete("/userSubject/" + row.id).then(({data: res}: any) => {
      // console.log(res)
      if (res.code === 200) {
        ElMessage({type: 'success', message: res.message});
      } else {
        ElMessage.error({type: 'error', message: "数据同步失败，自动刷新"});
      }
    }).finally(() => {
      // 重新加载数据
      getSubjectByUser();
    });
  }).catch(() => {
    ElMessage.info("取消操作");
  });
}

const changePassword = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const data = {id: editForm.id, password: editForm.newPassword}
      const {data: res} = await proxy.$http.post("/user/edit", data);
      if (res.code === 200) {
        ElNotification.success?.({message: res.message})
        handleClose();
        proxy.$router.push("/login");
        sessionStorage.clear()
      }
    } else {
      ElMessage.error("请先输入数据");
      console.log('error submit!!')
      return false
    }
  })
};

const changeEmail = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const data = {id: editForm.id, email: editForm.email, code: editForm.code};
      const {data: res} = await proxy.$http.post("/user/edit", data);
      if (res.code === 200) {
        ElNotification.success?.({message: res.message})
        emailHandleClose();
      }
    } else {
      ElMessage.error("请先输入数据");
      console.log('error submit!!')
      return false
    }
  })
}

const emailHandleEdit = () => {
  dialogVisibleEmail.value = true;
  editForm.id = user.info.id;
  editForm.username = user.info.username;
  editForm.email = user.info.email;
};

const emailHandleClose = () => {
  dialogVisibleEmail.value = false;
  editFormRef.value.resetFields();
};

const pagination = reactive({//分页相关模型数据
  currentPage: 1,//当前页码
  pageSize: 5,//每页显示的记录数
  total: 0,//总记录数
  userSubjectList: [],
});

//切换页码
const handleCurrentChange = (currentPage: any) => {
  // 修改页码值为当前选中的页码值
  pagination.currentPage = currentPage;
  // 执行查询
  getSubjectByUser();
};
const handleSizeChange = (pageSize: any) => {
  pagination.pageSize = pageSize;
  getSubjectByUser();
}

const getSubjectByUser = async () => {
  const data = store.getters.getUserInfo;
  const param = {size: pagination.pageSize, current: pagination.currentPage, id: data.id}
  const {data: res} = await proxy.$http.get("/userSubject", {params: param});
  if (res.code === 200) {
    pagination.userSubjectList = res.data.records;
    pagination.total = res.data.total;
    pagination.pageSize = res.data.size;
    pagination.currentPage = res.data.current;
  }
}

onMounted(() => {
  getUserInfo();
  getSubjectByUser();
});

</script>

<style scoped>
.userForm {
  max-width: 460px;
  padding-top: 20px
}

.pagiantion {
  text-align: right;
  padding: 15px;
}
</style>