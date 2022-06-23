<template>
  <div>
    <bread-crumb :msg="{one:'运动平台',two:'卡路里'}"/>
    <el-card>
      <!-- calories 页面 -->
      <div>
        <el-row>
          <el-col :span="3" v-for="(item,i) in step.count" :key="i">
            <div>{{ step.data[i] }}
              <el-input-number v-model="step.count[i]" size="small" @change="chart"></el-input-number>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="echarts" ref="echartsEl"></div>
      <div class="tags">
        <el-tag>{{ "总里程：" + s }}</el-tag>
        <el-tag>{{ "总消耗：" + calories }}</el-tag>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, ref, reactive, onMounted, computed} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import BreadCrumb from "@/components/BreadCrumb.vue";

import * as echarts from 'echarts';
import {ECharts, EChartsOption, init} from 'echarts';
import store from "@/store";

const {proxy} = useCurrentInstance();

const step = reactive({
  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  count: [4391, 4451, 6732, 4212, 3353, 8211, 9232],
});

const sum = ref(0)
const s = computed(() => {
  sum.value = 0;
  step.count.forEach((item) => {
    sum.value += item
  })
  return sum.value * 0.75 / 1000;
})

const calories = computed(() => {
  sum.value = 0;
  step.count.forEach((item) => {
    sum.value += item
  })
  return sum.value * 0.027;
})

const echartsEl = ref<HTMLDivElement>();

const chart = () => {
  const e = echarts.init(echartsEl.value as HTMLDivElement);
  e.setOption({
    tooltip: {},
    xAxis: {
      type: 'category',
      data: step.data,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: step.count,
        type: 'bar',
        showBackground: true,
        barWidth: 70,//柱图宽度
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
        color: '#d67c29',
      }
    ]
  });
}
onMounted(() => {
  chart();
});
</script>

<style scoped>
.echarts {
  height: 500px;
}

.tags {
  display: flex;
  justify-content: space-around;
}
</style>