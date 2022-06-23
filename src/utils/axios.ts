import axios from "axios";
import { useCookies } from "vue3-cookies";
// import qs from "qs"; // qs.stringify(data)可以把data变成&连接的

// axios.defaults.baseURL = ''  //正式
axios.defaults.baseURL = 'http://localhost:9000'; //测试

//post请求头
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
//允许跨域携带cookie信息
axios.defaults.withCredentials = true;
//设置超时
axios.defaults.timeout = 15000;

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    if (response.data.code === 1000){
      const { cookies } = useCookies();
      cookies.set("token",response.data.data.token,0);
    }
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  error => {
    // alert(JSON.stringify(error));
    console.log(error);
  }
);
export default axios;
