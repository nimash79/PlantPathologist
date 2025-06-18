import config from "./config.json";
import http from "./httpService";

export const getDailyText = () => {
    return http.get(`${config.url}/api/v1/settings/daily_text`);
}