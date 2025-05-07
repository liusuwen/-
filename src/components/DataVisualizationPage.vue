
<script setup lang="ts">
import { ref } from 'vue';
import { sendQuery,getSuggestedMessage} from "@/api/data";
import ChartAsImage from './ChartAsImage.vue';
// import type { BubbleListItemProps, BubbleListProps } from 'vue-element-plus-x/bubbleList/types';

// type listType = BubbleListItemProps & {
//   key: number
//   role: 'user' | 'ai'
// }

const suggestedMessage = ref([]);
const answer = ref('');
const messages=ref([{
  key: 1,
  role: 'ai',
  content: '欢迎使用金融助手',
  placement: 'start',
  loading: false,
  shape: 'corner',
  variant: 'outlined',
  isMarkdown: false,
  typing: false,
  isFog: false,
  avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
  avatarSize: '24px',
  avatarGap: '12px',
}]);

const list= messages;
const chartOption =ref(
    {

    }
);
const senderValue = ref();
const senderRef = ref();

const submitQuery = async (text?:string) => {
  console.log(senderValue.value);
  const query = text ?? senderValue.value;
  if (!query) return;
  messages.value.push({
    key: messages.value.length + 1,
    role: 'user',
    content: query,
    placement: 'end',
    loading: false,
    shape: 'corner',
    variant: 'outlined',
    isMarkdown: false,
    typing: false,
    isFog: false,
    avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
    avatarSize: '24px',
    avatarGap: '12px',
  });
  // senderRef.value.reset();
  messages.value.push({
    key: messages.value.length + 1,
    role: 'ai',
    content: answer.value,
    loading: true,
    placement: 'start',
    shape: 'corner',
    variant: 'outlined',
    isMarkdown: true,
    typing: true,
    isFog: true,
    avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
    avatarSize: '24px',
    avatarGap: '12px',
  });
  const res = await sendQuery(query);
  console.log(res);
  // const suggestionRes = await getSuggestedMessage(res.message_id);

  // 检查 suggestionRes 是否为 undefined 或 null
  // if (suggestionRes && suggestionRes.data) {
  //   suggestedMessage.value = suggestionRes.data;
  // } else {
  //   suggestedMessage.value = [];
  // }


  answer.value = res.answer;
  chartOption.value=answer.value;
  console.log("chart++++"+JSON.parse(res.answer));
  messages.value[messages.value.length-1].loading =false;
  messages.value[messages.value.length-1].content=res.answer;
};

</script>

<template>
  <div class="container">
    <div class="content">
      <BubbleList :list="list" max-height="500px" >

        <!-- 自定义头像 -->
        <template #avatar="{ item }">
          <!--          <div class="avatar-wrapper">-->
          <!--            <img :src="item.role === 'ai' ? avartAi : avatar" alt="avatar">-->
          <!--          </div>-->
          <div v-if="item.role==='ai'" class="avatar-wrapper">
            <img src="@/assets/robot.png" alt="avatar">
          </div>
          <div v-if="item.role==='user'" class="avatar-wrapper">
            <img src="@/assets/user.png" alt="avatar"/>
          </div>
        </template>

        <!-- 自定义头部 -->
        <template #header="{ item }">
          <div class="header-wrapper">
            <div class="header-name">
              {{ item.role === 'ai' ? '客服' : '当前用户' }}
            </div>
          </div>
        </template>


                <!-- 自定义气泡内容 -->
                <template #content="{ item }">
                  <div class="content-wrapper">
                    <div v-if="item.role === 'ai' && chartOption!=null" class="content-text">
                      <ChartAsImage :option="chartOption">
                        <!-- 使用具名插槽接收 img 参数 -->
                        <template #default="{ img }">
                          <div class="custom-bubble">
                            <img :src="img" alt="自定义图表" class="rounded shadow-lg" />
                          </div>
                          <div>{{item}}</div>
                        </template>
                      </ChartAsImage>
                    </div>
                    <div v-if="item.role === 'user'" class="content-text">
                      {{ item.content }}
                    </div>

                  </div>
                </template>
      </BubbleList>
      <div style="display: flex; flex-direction: column; gap: 12px; ">
        <!-- 建议消息按钮容器：一行展示 -->
        <div
            v-if="suggestedMessage.length > 0"
            style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; justify-content: center">
          <el-button
              v-for="(msg, index) in suggestedMessage"
              :key="index"
              type="primary"
              size="small"
              @click="submitQuery(msg)"
          >
            {{ msg }}
          </el-button>
        </div>


        <Sender ref="senderRef" placeholder="请输入你的问题" v-model="senderValue" @submit="submitQuery" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}


.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80%;
  height: 70%;
  background-color: white;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}


.BubbleList {
  flex: 1;
  overflow-y: auto;
}

.Sender {
  margin-top: 12px;
}

.footer-container {
  :deep(.el-button+.el-button) {
    margin-left: 8px;
  }
}
</style>