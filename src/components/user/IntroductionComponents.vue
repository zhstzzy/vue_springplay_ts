<template>
  <div>
    <bread-crumb :msg="{one:'运动平台',two:'运动科普'}"/>
    <el-carousel :interval="4000" height="300px">
      <el-carousel-item v-for="item in imgList" :key="item">
<!--        <img src="@/assets/carousel/1.jpg"/>-->
        <el-image style="width: 1000px; height: 300px" :src="item" fit="scale-down" />
      </el-carousel-item>
    </el-carousel>
    <el-card :body-style="{ padding: '0px'}" style="margin-top: 20px">
      <div style="padding: 50px">
        <span style="font-size: 30px">运动时间表， 每天最佳运动时间竟然是这个！</span>
        <div class="bottom">
          <time class="time">{{ currentDate }}</time>
          <el-button text class="button" @click="show">{{ msg.title }}</el-button>
        </div>
        <div class="sportPage" v-if="msg.isShow === true">
          <p class="contentFont">什么时候是最佳运动时间？</p>
          <p class="contentFont">为了能够瘦下来，大家是真的很努力呢，有人在清晨睁眼的那一刻，就开始展开和脂肪的斗争，但是想要赢得减肥的最终胜利，到底该在什么时间运动，该做什么运动呢？</p>
          <p class="contentImage"><img data-index="0" src="@/assets/introduction/186.gif" data-width="640px"
                                       data-height="488px"></p>
          <p class="contentFont">6:00-8:00 低强度运动</p>
          <p class="contentFont">
            清晨，身体在慢慢苏醒，人体各器官调节功能相对低下，关节和肌肉最为僵硬，建议大家不要做过于激烈的运动，可以做一些强度较低的运动，如慢跑、快走、瑜伽、太极等。温和的运动，能够在早晨唤醒人们一天的精神，提高人体代谢水平。</p>
          <p class="contentFont">注意事项：</p>
          <p class="contentFont">1、部分有锻炼基础的人可以晨起后空腹运动，但有血糖调节、心脑血管等问题的人，不能空腹运动，可能会引起身体的不适应症状。</p>
          <p class="contentFont">2、晨起运动一定要多喝水。</p>
          <p class="contentImage"><img data-index="1" src="@/assets/introduction/192.jpg" data-width="1080px"
                                       data-height="933px"></p>
          <p class="contentFont">9:30-10:30 中强度运动</p>
          <p class="contentFont">上午，人体的各项机能都已逐渐恢复，可以充分调动各器官有效地发挥作用，适当的运动会感觉精力充沛，可以进行一些户外有氧运动，骑车、打球、跑步都是不错的选择。</p>
          <p class="contentFont">注意事项：</p>
          <p class="contentFont">早餐后一小时左右再开始运动，运动后休息一小时左右再进行午餐，减少对消化系统的不良影响。</p>
          <p class="contentImage"><img data-index="2" src="@/assets/introduction/195.jpg" data-width="1080px"
                                       data-height="982px"></p>
          <p class="contentFont">14:00-16:00 中高强度运动</p>
          <p class="contentFont">午后，肌肉的力量和弹性开始上升，做运动能降低受伤风险。建议进行一些力量训练来锻炼肌肉，当然也可以趁着身体柔软，做一些伸展性的运动。</p>
          <p class="contentFont">注意事项：</p>
          <p class="contentFont">午饭后两小时左右，再开始运动。</p>
          <p class="contentImage"><img data-index="3" src="@/assets/introduction/198.jpg" data-width="1080px"
                                       data-height="864px"></p>
          <p class="contentFont">17:00-19:00 高强度运动</p>
          <p class="contentFont">
            傍晚，是一天当中最佳的运动时间，此时间段身体的适应能力最佳，肌肉最为柔韧，人的体能达到顶峰，可以做一些比较高强度的运动，运动的时间也可以延长，如高强度间歇性运动（HIIT）等。</p>
          <p class="contentFont">注意事项：</p>
          <p class="contentFont">运动结束一小时后，方可吃晚餐。</p>
          <p class="contentImage"><img data-index="4" src="@/assets/introduction/200.jpg" data-width="1080px"
                                       data-height="1080px"></p>
          <p class="contentFont">20:00-22:00 低强度运动</p>
          <p class="contentFont">到了夜晚，身体开始慢慢进入休息状态，适合进行一些强度较低的运动，进行一些强度低的运动，散步、拉伸运动等，减肥健身之余还可以帮助睡眠。</p>
          <p class="contentFont">注意事项：</p>
          <p class="contentFont">建议晚上不要做剧烈运动，运动时间不宜过长，以免影响消化和睡眠，运动与睡觉时间最好间隔一小时以上。</p>
          <p class="contentImage"><img data-index="5" src="@/assets/introduction/204.jpg" data-width="1080px"
                                       data-height="999px"></p>
          <p class="contentFont">开始运动就是最佳燃脂时间</p>
          <p class="contentFont">以上推荐的这些运动时间，只是根据人体机能变化，最理想状态下的时间表，我们还是应该根据个人的实际情况，来安排自己的运动时间。</p>
          <p class="contentFont">
            运动和睡眠以及饮食不同，它并不是必须得遵行某个既定的时间表来进行，只要你开始运动，听从自己身体的状态，那么任何时候都会是你最佳的运动时间，别给偷懒找借口，运动就在当下！</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, ref, reactive, onMounted} from "vue";
import useCurrentInstance from '@/hook/useCurrentInstance'
import {sessionStorage} from "@/hook/sessionStorage";
import {ElNotification} from "element-plus";
import BreadCrumb from "@/components/BreadCrumb.vue";
import store from "@/store";

const {proxy} = useCurrentInstance();

const currentDate = ref(new Date())
const msg = reactive({
  isShow: true,
  title: "收起",
});

const show = () => {
  msg.isShow = !msg.isShow;
  msg.isShow ? msg.title = "收起" : msg.title = "展开";
}

const imgList = [
  require('@/assets/carousel/1.jpg'),
  require('@/assets/carousel/2.jpg'),
  require('@/assets/carousel/3.jpg'),
]

</script>

<style lang="less" scoped>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.contentFont {
  font-weight: 600;
}

.contentImage {
  text-align: center;
}


.sportPage {
  width: 60%;
  margin-left: 20%;

  img {
    width: auto;
    height: 432px;
  }
}


.demonstration {
  //color: var(--el-text-color-secondary);
}

.el-carousel__item {
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  //background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  //background-color: #d3dce6;
}
</style>