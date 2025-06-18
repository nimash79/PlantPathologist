import config from "./config.json";
import http from "./httpService";

export const createChatRoom = (phone_numbers) => {
  return http.post(`${config.url}/api/v1/chat/create-room`, JSON.stringify({ phone_numbers }));
};

export const getChat = (roomId) => {
  return http.get(`${config.url}/api/v1/chat/get-chat/${roomId}`);
};

export const getChats = () => {
  return http.get(`${config.url}/api/v1/chat/get-chats`);
};

export const getMessagesCount = (mobile) => {
  return http.get(`${config.url}/api/v1/chat/usermessagescount/${mobile}`);
};

export const uploadFileToChat = (formData, setProgress) => {
  return http.post(`${config.url}/api/v1/chat/upload_file/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: progressEvent => {
      setProgress(
        Math.round(progressEvent.loaded / progressEvent.total * 100)
      );
    },
  });
};
