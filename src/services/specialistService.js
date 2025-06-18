import config from "./config.json";
import http from "./httpService";

export const getAllSpecialists = () => {
    return http.get(`${config.url}/api/v1/accounts/all_specialist/`);
}