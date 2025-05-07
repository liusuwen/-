
<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import { useXStream } from 'vue-element-plus-x';
import ChartAsImage from './ChartAsImage.vue';
import {sendQuery} from '../api/data.d.ts';
const { startStream, cancel, data, error, isLoading } = useXStream();
// import type { BubbleListItemProps, BubbleListProps } from 'vue-element-plus-x/bubbleList/types';




const suggestedMessage = ref([]);

const messages=ref([{
  key: 1,
  role: 'ai',
  content: '欢迎使用数据图显客服助手',
  placement: 'start',
  loading: false,
  shape: 'corner',
  variant: 'outlined',
  chartOption:'',
  isMarkdown: false,
  typing: false,
  isFog: false,
  avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
  avatarSize: '24px',
  avatarGap: '12px',
}]);

const list = messages;
const loading = ref(false);
const senderValue = ref();
const senderRef = ref();
const submitBtnDisabled=ref(true);

const payload =ref({
  inputs: {},
  query: senderValue.value,
  response_mode: 'streaming',
  conversation_id: '',
  user: 'abc-123',
  files: [
  ],
});

const options = [
  {
    value: '广东客户占比',
    label: '广东客户占比',
  }
];



// 默认支持 SSE 协议
async function startSSE() {
  try {
    messages.value.push({
      key: messages.value.length + 1,
      role: 'user',
      content: senderValue.value,
      placement: 'end',
      loading: false,
      shape: 'corner',
      chartOption:'',
      variant: 'outlined',
      isMarkdown: false,
      typing: false,
      isFog: false,
      avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
      avatarSize: '24px',
      avatarGap: '12px',
    });
    payload.value.query = senderValue.value;
    senderRef.value.clear();
    messages.value.push({
      key: messages.value.length + 1,
      role: 'ai',
      content: '',
      loading: true,
      placement: 'start',
      shape: 'corner',
      chartOption:'',
      variant: 'outlined',
      isMarkdown: true,
      typing: true,
      isFog: true,
      avatar: 'https://avatars.githubusercontent.com/u/76239030?v=4',
      avatarSize: '24px',
      avatarGap: '12px',
    });

    const response = await fetch('http://192.168.3.140/v1/chat-messages', {
      headers: {
        'Authorization': `Bearer app-ynKn0d1eIUFOhwXMwKrunSV2`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload.value),
    });
    const readableStream = response.body!;
    await startStream({ readableStream });
  }
  catch (err) {
    console.error('Fetch error:', err);
  }
}

function handleSubmit() {
  console.log('submit', senderValue.value);
  // senderRef.value.submit();
  loading.value = true;
  startSSE();
}

const chartOption =ref();

function handleCancel() {
  console.log('cancel');
  // cancel();
  messages.value[messages.value.length-1].loading = false;
  if (messages.value[messages.value.length-1].content==''){
    messages.value[messages.value.length-1].content = '正在努力思考中...';
  }
  loading.value = false;
}

const finishLoading= () => {
    loading.value = false;
 };

const putChartOption= () => {
  loading.value = false;
  console.log('content++++', content.value);
  messages.value[messages.value.length - 1].chartOption = content.value;
  chartOption.value = JSON.parse(chartOption.value);
};

const avatar = ref('https://avatars.githubusercontent.com/u/76239030?v=4');
// const avartAi = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');

// 机器人的 content 计算属性
const content = computed(() => {
  if (!data.value.length)
    return '';
  let text = '';
  for (let index = 0; index < data.value.length; index++) {
    const chunk = data.value[index].data;
    try {
      let parse = JSON.parse(chunk);
      console.log('parse', parse.event);
      if (parse.event == "message") {
        const parsedChunk = JSON.parse(chunk).answer;
        text += parsedChunk;
      }
      if (parse.event === 'message_end') {
        console.log('+++++++++++', JSON.parse(chunk).event);
        finishLoading();
      }
      if (parse.event === 'workflow_finished'){
        console.log('+++++++++++', JSON.parse(chunk).event);
        putChartOption();
      }
    } catch (error) {
      if (chunk === 'message_end') {
        console.log('数据接收完毕');
      } else {
        console.error('解析数据时出错:', error);
      }
    }
  }
  console.log('Text:', text);
  return text;
});



watch(content, (newValue) => {
  if (newValue) {
    messages.value[messages.value.length - 1].content = newValue;
    messages.value[messages.value.length - 1].loading = false;
  }
});

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

      <iframe
          src="http://192.168.3.140/chatbot/cx8162q5oMxf3IMG"
          style="width: 100%; height: 100%; min-height: 700px"
          frameborder="0"
          allow="microphone">
      </iframe>

      <div style="display: flex; flex-direction: column; gap: 12px; ">
<!--        <Sender ref="senderRef" placeholder="请输入你的问题" v-model="senderValue" @submit="startSSE"/>-->
<!--        <MentionSender placeholder="可按/添加预设问题" ref="senderRef" v-model="senderValue"-->
<!--                       :loading="loading" :trigger-strings="['/']" :options="options"-->
<!--                       @submit="handleSubmit" @cancel="handleCancel"-->
<!--        />-->
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
.is-loaidng {
  animation: spin 1s linear infinite;
}
.action-list-self-wrap {
  display: flex;
  align-items: center;
  & > span {
    width: 120px;
    font-weight: 600;
    color: var(--el-color-primary);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>