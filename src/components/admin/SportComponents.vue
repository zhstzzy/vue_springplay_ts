<template>
  <div>
    <bread-crumb :msg="{one:'权限列表',two:'课程列表'}"></bread-crumb>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入搜索的课程名称" v-model="pagination.subname" clearable @clear="getSubject "
                    @keyup.enter="getSubject">
            <!--  搜索区域  -->
            <template #append>
              <el-button type="primary" icon="el-icon-search" @click="getSubject"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加课程</el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 20px;">
        <el-table current-row-key="id" height="580px" :data="pagination.subjectList" highlight-current-row border>
          <el-table-column type="index" align="center" label="序号" width="65"></el-table-column>
          <el-table-column prop="subname" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="sellingPrice" label="价格" align="center" sortable></el-table-column>
          <el-table-column prop="detail" label="课程详情" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete"
                         @click="handleDelete(scope.$index, scope.row)"></el-button>

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
    <div>
      <el-dialog title="添加课程" v-model="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="10%">
          <el-form-item label="课程名称" prop="subname">
            <el-input v-model="addForm.subname"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="sellingPrice">
            <el-input-number v-model.number="addForm.sellingPrice" :precision="2"
                             :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item prop="detail" label="课程详情">
            <el-input v-model="addForm.detail"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogClose">取 消</el-button>
            <el-button type="primary" @click="addSubject">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="编辑课程" v-model="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="10%">
          <el-form-item label="课程Id">
            <el-input v-model="editForm.subId" disabled></el-input>
          </el-form-item>
          <el-form-item label="课程名称" prop="subname">
            <el-input v-model="editForm.subname"></el-input>
          </el-form-item>
          <el-form-item prop="detail" label="课程详情">
            <el-input v-model="editForm.detail"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="sellingPrice">
            <el-input-number v-model.number="editForm.sellingPrice" :precision="2"
                             :step="0.1"></el-input-number>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogClose">取 消</el-button>
            <el-button type="primary" @click="editSubject">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BreadCrumb from "@/components/BreadCrumb.vue";
import useCurrentInstance from "@/hook/useCurrentInstance";
import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import store from "@/store";

const {proxy} = useCurrentInstance();

const pagination = reactive({//分页相关模型数据
  currentPage: 1,//当前页码
  pageSize: 10,//每页显示的记录数
  total: 0,//总记录数
  subname: "",//商品名
  subjectList: [],
});

const getSubject = async () => {
  const url = "/subject/" + pagination.currentPage + "/" + pagination.pageSize;
  const {data: res} = await proxy.$http.get(url, {params: {subname: pagination.subname}});
  if (res.code === 200) {
    pagination.pageSize = res.data.size;
    pagination.currentPage = res.data.current;
    pagination.total = res.data.total;
    pagination.subjectList = res.data.records;
  }
};

const handleSizeChange = (pageSize: any) => {
  pagination.pageSize = pageSize;
  getSubject();
};

const handleCurrentChange = (currentPage: any) => {
  pagination.currentPage = currentPage
  getSubject();
};

const handleDelete = (index: any, row: any) => {
  // console.log(row)
  ElMessageBox.confirm("此操作将永久删除当前信息，是否继续？", "提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    proxy.$http.delete("/subject/" + row.subId).then(({data: res}: any) => {
      if (res.code === 200) {
        ElMessage({type: 'success', message: res.message});
      } else {
        ElMessage({type: 'error', message: "数据同步失败，自动刷新"});
      }
    }).finally(() => {
      // 重新加载数据
      getSubject();
    });
  }).catch(() => {
    ElMessage.info("取消操作");
  });
}

const addDialogVisible = ref(false);
const addFormRef = ref();

const addForm = reactive({
  subname: "",
  sellingPrice: "",
  detail:"",
})

const addFormRules = reactive({
  subname: [{required: true, message: "请输入商品名称", trigger: "blur"}],
  sellingPrice: [{required: true, message: "请输入价格", trigger: "blur"}, {type: 'number', message: '价格必须为数字'},],

});

const addDialogClose = () => {
  addDialogVisible.value = false
  addFormRef.value.resetFields();
};

const addSubject = () => {
  addFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const {data: res} = await proxy.$http.put("/subject", addForm)
      // console.log(res)
      if (res.code === 200) {
        ElMessage({
          type: "success",
          message: res.message
        });
        getSubject();
      } else {
        ElMessage({
          type: "error",
          message: res.message
        });
      }
      addDialogClose();
    } else {
      ElMessage({
        type: "error",
        message: "请完整的填写信息"
      })
    }
  })
};


const handleEdit = (index: any, row: any) => {
  // console.log(row)
  editForm.subId = row.subId;
  editForm.subname = row.subname;
  editForm.sellingPrice = row.sellingPrice;
  editForm.detail = row.detail;
  editDialogVisible.value = true;
};

const editDialogVisible = ref(false);

const editForm = reactive({
  subId:"",
  subname: "",
  sellingPrice: "",
  detail:"",
})

const editFormRef = ref();

const editFormRules = reactive({
  subname: [{required: true, message: "请输入商品名称", trigger: "blur"}],
  sellingPrice: [{required: true, message: "请输入价格", trigger: "blur"}, {type: 'number', message: '价格必须为数字'},],
});

const editDialogClose = () => {
  editDialogVisible.value = false
  editFormRef.value.resetFields();
};

const editSubject = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const {data: res} = await proxy.$http.post("/subject", editForm)
      if (res.code === 200) {
        ElMessage({
          type: "success",
          message: res.message
        });
        getSubject();
      } else {
        ElMessage({
          type: "error",
          message: res.message
        });
      }
      editDialogClose();
    } else {
      ElMessage({
        type: "error",
        message: "请完整的填写信息"
      })
    }
  })
}

onMounted(() => {
  getSubject();
});

</script>


<style scoped>
.pagiantion {
  text-align: right;
  padding: 15px;
}
</style>