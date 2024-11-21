import axios, { AxiosInstance } from 'axios';

enum excludedEndpoint {
    LOGIN = '/signin',
    REGISTER = '/signup',
    OTP_VERIFY = '/handleOtp'
} 

export const Instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

Instance.interceptors.request.use(
    (config) => {
    if (config.url?.endsWith(excludedEndpoint.LOGIN) || config.url?.endsWith(excludedEndpoint.REGISTER)||config.url?.split('?')[0]?.endsWith(excludedEndpoint.OTP_VERIFY)) return  config
    const token = localStorage.getItem('tokens')?JSON.parse(localStorage.getItem('tokens')!!): null
    config.headers.Authorization = `bearer ${token.access_token}`
    return config;
  },
  function (error) {   


    return Promise.reject(error);
  }
);

Instance.interceptors.response.use(
    response => {
      return response
    },
    (error) => {
      console.log(error)

      const request = error.config
      if (error.response.status === 401 && !request._retry) {
        request._retry = true
        const token = localStorage.getItem('tokens')?JSON.parse(localStorage.getItem('tokens')!!): null

        if(token?.refresh_token) return axios
          .post('/auth/token', {
            token: token?.refresh_token
          })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem("tokens",JSON.stringify(res.data))
              axios.defaults.headers.common['Authorization'] =
                'bearer ' + res.data.access_token
              return axios(request)
            }
          })
      }

     Promise.reject(error)
         
    }
  )