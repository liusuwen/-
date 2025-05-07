<template>
  <div>
    <!-- 原始图表渲染区域（不展示） -->
    <div ref="chartRef" style="width: 400px; height: 300px; position: absolute; left: -9999px;"></div>

    <!-- 展示生成的图片 -->
    <div v-if="imgSrc">
      <slot :img="imgSrc">
        <img :src="imgSrc" alt="生成的图表" style="max-width: 100%;" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';

import * as echarts from 'echarts';

const props = defineProps<{
  option: any
}>();

const chartRef = ref<HTMLDivElement | null>(null);
const imgSrc = ref('');
let chartInstance: echarts.ECharts | null = null;

const generateImage = () => {
  if (chartRef.value) {
    let option = props.option;

    // 如果 option 是字符串，则解析为对象
    if (typeof option === 'string') {
      try {
        option = JSON.parse(option);
      } catch (error) {
        console.error('Invalid JSON string for option:', error);
        return;
      }
    }

    // 确保 option 是一个对象
    if (typeof option !== 'object' || option === null) {
      console.error('Invalid option:', option);
      return;
    }

    console.log('ECharts Option:', option); // 添加调试信息

    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(option);
    const dataURL = chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    console.log('DataURL:', dataURL); // 添加调试信息
    imgSrc.value = dataURL;
    chartInstance.dispose(); // 生成图片后释放资源
  } else {
    console.error('chartRef is not available');
  }
};


onMounted(async () => {
  await nextTick(); // 等待 DOM 完全挂载和渲染
  console.log('Component mounted');
  generateImage();
});


watch(() => props.option, generateImage, { deep: true });
</script>
