import axios from 'axios';

const apiUrl = 'http://192.168.3.140/v1/chat-messages';
const apiKey = 'app-mp1zOEFWQ8ICIsGQ4ZepYpp9'; // API 密钥

/**
 * 发送查询请求
 * @param {string} query - 查询字符串
 * @returns {Promise} - Axios 请求的 Promise
 */
export const sendQuery = async (query) => {
    const requestData = {
        inputs: {},
        query: query, // 动态传入的 query 参数
        response_mode: "blocking",
        conversation_id: "",
        user: "abc-123",
        files: []
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(apiUrl, requestData, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return "系统繁忙";
    }
};

/**
 * 获取建议消息
 * @param {string} messageId - 消息 ID
 * @returns {Promise} - Axios 请求的 Promise
 */
export const getSuggestedMessage = async (messageId) => {
    const url = `http://192.168.3.140/v1/messages/${messageId}/suggested?user=abc-123`;
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
};
