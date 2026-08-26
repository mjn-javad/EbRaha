import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/v1/brandPopular",
  withCredentials: true, // ✅ مهم: این گزینه باعث ارسال خودکار کوکی‌ها میشه
});

export default apiClient;
