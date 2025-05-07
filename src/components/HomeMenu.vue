<!-- HomeMenu.vue -->
<template>
  <el-row class="tac">
    <el-col :span="3">
      <h5 class="mb-2">菜单</h5>
      <el-menu
          default-active="3"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
      >
        <el-menu-item index="3">
          <el-icon><User /></el-icon>
          <span>客服助手</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><Money /></el-icon>
          <span>金融客服助手</span>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><View /></el-icon>
          <span>数据可视化助手</span>
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon><Document /></el-icon>
          <span>演示文档</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <component :is="currentComponent" v-if="currentComponent"></component>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { User, Money } from '@element-plus/icons-vue';
import SupportPageStream from './SupportPageStream.vue';
import FinanceSupportPageStream from './FinanceSupportPageStream.vue';
import DataVisualizationPageStream from './DataVisualizationPageStream.vue';
import DemoSupportPageStream from './DemoSupportPageStream';


const currentComponent = ref<InstanceType<typeof SupportPageStream> | InstanceType<typeof FinanceSupportPageStream> |InstanceType<typeof DataVisualizationPageStream>| null>(null);

onMounted(() => {
  currentComponent.value = SupportPageStream; // 初始化时显示 SupportPage
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleSelect = (key: string) => {
  if (key === '3') {
    currentComponent.value = SupportPageStream;
  }else if (key === '4'){
    currentComponent.value = FinanceSupportPageStream;
  }else if (key === '5'){
    currentComponent.value = DataVisualizationPageStream;
  }else if (key === '6'){
    currentComponent.value = DemoSupportPageStream;
  }
};
</script>

<style scoped>
</style>
