<template>
  <div>
    <bread-crumb :msg="{one:'运动平台',two:'课程选择'}"/>
    <el-card v-for="item in subject.list" key="item.subId" class="card">
      <el-descriptions title="课程信息">
        <el-descriptions-item label="名称">{{ item.subname }}</el-descriptions-item>
        <el-descriptions-item label="价格">
          <el-tag size="small">{{ item.sellingPrice }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="详情">
          {{ item.detail }}
        </el-descriptions-item>
      </el-descriptions>
      <el-button @click="show(item)" class="btn">预约</el-button>
      <el-dialog v-model="item.flag" title="请选择课程的时间" width="30%" :show-close="false">
        <el-date-picker
            v-model="value1"
            type="datetimerange"
            start-placeholder="Start Date"
            end-placeholder="End Date"
            :default-time="defaultTime1"
        />
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(item)">取消</el-button>
        <el-button type="primary" @click="addSubject(item)">确定</el-button>
      </span>
        </template>
      </el-dialog>
    </el-card>

  </div>
</template>

<script lang="ts" setup>
import {defineComponent, ref, reactive, onMounted} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import BreadCrumb from "@/components/BreadCrumb.vue";
import {ElMessage} from "element-plus";
import store from "@/store";
import dayjs from 'dayjs'

const {proxy} = useCurrentInstance();

const subject = reactive({
  list: [],
})

const getSubject = async () => {
  const {data: res} = await proxy.$http.get("/subject");
  if (res.code === 200) {
    subject.list = res.data.subjectList
  }
  subject.list.forEach((item) => {
    item.flag = false;
  })
};

const value1 = ref('')

const defaultTime1 = [new Date()]

const show = (item: any) => {
  // console.log(item)
  item.flag = true
}

const cancel = (item: any) => {
  item.flag = false;
  value1.value = '';
  ElMessage.info("操作取消")
}

const addSubject = async (item: any) => {
  // console.log(value1.value)
  const date={
    subId:item.subId,
    startTime:dayjs(value1.value[0]).format("YYYY-MM-DD HH:mm:ss"),
    endTime:dayjs(value1.value[1]).format("YYYY-MM-DD HH:mm:ss"),
    uid:store.getters.getUserInfo.id
  }
  const {data:res} = await proxy.$http.put("/userSubject",date);
  // console.log("添加用户课程",res)
  item.flag = false;
  value1.value = '';

}

onMounted(() => {
  getSubject();
});

</script>

<style scoped>
.card {
  margin-top: 10px;
}

.btn {
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
}
</style>