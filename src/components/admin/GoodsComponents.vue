<template>
  <div>
    <!--  商品页面  -->
    <BreadCrumb :msg="{one:'权限列表',two:'商品列表'}"/>

    <el-card>
      <el-row :gutter="30">
        <el-col :span="10">
          <el-input placeholder="请输入搜索的商品名称" v-model="pagination.goodsName" clearable @clear="getGoods "
                    @keyup.enter="getGoods">
            <!--  搜索区域  -->
            <template #append>
              <el-button type="primary" icon="el-icon-search" @click="getGoods"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加商品</el-button>
        </el-col>
      </el-row>
      <div style="margin-top: 20px;">
        <el-table current-row-key="id" height="580px" :data="pagination.goodsList" highlight-current-row border
                  :default-sort="{ prop: 'inventory' ,order:'ascending'}">
          <el-table-column type="index" align="center" label="序号" width="65"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="unit" label="单位" align="center"></el-table-column>
          <el-table-column prop="unitPrice" label="进价" align="center" sortable></el-table-column>
          <el-table-column prop="sellPrice" label="售价" align="center" sortable></el-table-column>
          <el-table-column prop="inventory" label="数量" align="center" sortable>
            <template #default="scope">
              <div :class="scope.row.inventory < 10 ? 'specialColor':''">{{ scope.row.inventory }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"
                         @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-button size="mini" type="primary" @click="purchase(scope.$index,scope.row)">进货</el-button>
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
      <el-dialog title="添加商品" v-model="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="10%">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="addForm.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-select
                v-model="addForm.unit"
                placeholder="选择单位"
            >
              <el-option label="瓶" value="瓶"/>
              <el-option label="个" value="个"/>
              <el-option label="根" value="根"/>
              <el-option label="块" value="块"/>
            </el-select>
          </el-form-item>
          <el-form-item label="进价" prop="unitPrice">
            <el-input v-model.number="addForm.unitPrice"></el-input>
          </el-form-item>
          <el-form-item label="售价" prop="sellPrice">
            <el-input v-model.number="addForm.sellingPrice"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="inventory">
            <el-input v-model.number="addForm.inventory"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addDialogClose">取 消</el-button>
            <el-button type="primary" @click="addGood">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="编辑商品" v-model="editDialogVisible" width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="10%">
          <el-form-item label="商品名称">
            <el-input v-model="editForm.goodsName" disabled></el-input>
          </el-form-item>
          <el-form-item label="进价">
            <el-input-number v-model="editForm.unitPrice" :precision="2" :step="0.1"></el-input-number>
          </el-form-item>
          <el-form-item label="售价">
            <el-input-number v-model.number="editForm.sellingPrice" :min="editForm.unitPrice" :precision="2"
                             :step="0.1"></el-input-number>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogClose">取 消</el-button>
            <el-button type="primary" @click="editGood">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<!-- filename: GoodsComponents.vue -->
<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import BreadCrumb from "@/components/BreadCrumb.vue";
import store from "@/store";

const {proxy} = useCurrentInstance();

const pagination = reactive({//分页相关模型数据
  currentPage: 1,//当前页码
  pageSize: 10,//每页显示的记录数
  total: 0,//总记录数
  goodsName: "",//商品名
  goodsList: [],
});

// 获取全部用户
const getGoods = async () => {
  const url = "/goods/" + pagination.currentPage + "/" + pagination.pageSize;
  const {data: res} = await proxy.$http.get(url, {params: {goodsName: pagination.goodsName}});
  if (res.code === 200) {
    pagination.pageSize = res.data.size;
    pagination.currentPage = res.data.current;
    pagination.total = res.data.total;
    pagination.goodsList = res.data.records;
  }
  let msg = {value:"",flag:false};
  pagination.goodsList.forEach((item: any) => {
    if (item.inventory < 10) {
      msg.flag = true
      msg.value += item.goodsName + " "
    }
  })
  if (msg.flag){
    msg.value += "库存不足,请及时补货";
    ElNotification({
      type: "error",
      message: msg.value,
      title: "库存不足"
    })
  }

};

const handleSizeChange = (pageSize: any) => {
  pagination.pageSize = pageSize;
  getGoods();
};

const handleCurrentChange = (currentPage: any) => {
  pagination.currentPage = currentPage
  getGoods();
}

const addDialogVisible = ref(false);

const addForm = reactive({
  goodsName: "",
  unit: "",
  unitPrice: "",
  sellingPrice: "",
  inventory: "",
})

const addFormRef = ref();

const addFormRules = reactive({
  goodsName: [{required: true, message: "请输入商品名称", trigger: "blur"}],
  unit: [{required: true, message: "请选择单位", trigger: "blur"}],
  unitPrice: [{required: true, message: "请输入单价", trigger: "blur"}, {type: 'number', message: '单价必须为数字'},],
  sellingPrice: [{required: true, message: "请输入售价", trigger: "blur"}, {type: 'number', message: '售价必须为数字'},],
  inventory: [{required: true, message: "请输入数量", trigger: "blur"}, {type: 'number', message: '数量必须为数字'},],

});

const addDialogClose = () => {
  addDialogVisible.value = false
  addFormRef.value.resetFields();
};

const addGood = () => {
  addFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const {data: res} = await proxy.$http.put("/goods", addForm)
      if (res.code === 200) {
        ElMessage({
          type: "success",
          message: res.message
        });
        getGoods();
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
}

const handleEdit = (index: any, row: any) => {
  // console.log(row)
  editForm.goodsId = row.goodsId;
  editForm.goodsName = row.goodsName;
  editForm.unitPrice = row.unitPrice;
  editForm.sellingPrice = row.sellPrice;
  editDialogVisible.value = true;
};

const editDialogVisible = ref(false);

const editForm = reactive({
  goodsId: "",
  goodsName: "",
  unitPrice: "",
  sellingPrice: "",
  inventory: "",
})

const editFormRef = ref();

const editFormRules = reactive({
  goodsName: [{required: true, message: "请输入商品名称", trigger: "blur"}],
  unitPrice: [{required: true, message: "请输入单价", trigger: "blur"}, {type: 'number', message: '单价必须为数字'},],
  sellingPrice: [{required: true, message: "请输入售价", trigger: "blur"}, {type: 'number', message: '售价必须为数字'},],
  inventory: [{required: true, message: "请输入数量", trigger: "blur"}, {type: 'number', message: '数量必须为数字'},],

});

const editDialogClose = () => {
  editDialogVisible.value = false
  editFormRef.value.resetFields();
};

const editGood = () => {
  editFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const {data: res} = await proxy.$http.post("/goods", editForm)
      if (res.code === 200) {
        ElMessage({
          type: "success",
          message: res.message
        });
        getGoods();
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

//进货
const purchase = (index: any, row: any) => {
  // console.log(row)
  ElMessageBox.confirm("是否确认为" + row.goodsName + "商品补货 20" + row.unit, "提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    editForm.goodsId = row.goodsId;
    editForm.inventory = row.inventory + 20;
    await proxy.$http.post("/goods", editForm).then(({data: res}: any) => {
      // console.log(res)
      if (res.code === 200) {
        ElMessage({type: 'success', message: res.message});
      } else {
        ElMessage.error({type: 'error', message: "数据同步失败，自动刷新"});
      }
    }).finally(() => {
      // 重新加载数据
      getGoods();
    });
  }).catch(() => {
    ElMessage({type: 'info', message: "取消操作"})
  });
}

// 删除
const handleDelete = (index: any, row: any) => {
  // console.log(row)
  ElMessageBox.confirm("此操作将永久删除当前信息，是否继续？", "提示", {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await proxy.$http.delete("/goods/" + row.goodsId).then(({data: res}: any) => {
      // console.log(res)
      if (res.code === 200) {
        ElMessage({type: 'success', message: res.message});
      } else {
        ElMessage.error({type: 'error', message: "数据同步失败，自动刷新"});
      }
    }).finally(() => {
      // 重新加载数据
      getGoods();
    });
  }).catch(() => {
    ElMessage({type: 'info', message: "取消操作",})
  });
};


onMounted(() => {
  getGoods()
})

</script>


<style scoped>

.pagiantion {
  text-align: right;
  padding: 15px;
}

.specialColor {
  color: red;
}
</style>