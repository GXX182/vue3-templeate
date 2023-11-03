import axios from 'axios'

// 给axios设置一些默认行为
// eslint-disable-next-line no-undef
switch (process.env.NODE_ENV) {
  case 'production':
    axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API //测试机ip
    break
  case 'development':
    axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API
    break
}

// // 设置超时时间
axios.defaults.timeout = 30000
// // 设置跨域是否需要携带凭证
axios.defaults.withCredentials = false

// // 设置请求拦截器，
axios.interceptors.request.use(
  (config) => {
    // 进行token校验（JWT）：接收服务器返回的token，存储到本地，每次发送请求，都需要带上token
    const token = localStorage.getItem('token')
    const loginId = localStorage.getItem('loginId')
    token && (config.headers.token = token)
    loginId && (config.headers.loginid = loginId)
    // config需要返回
    return config
  },
  (error) => {
    // 请求错误的操作，返回报错信息
    return Promise.reject(error)
  }
)

// // 设置响应拦截器
// /**
//  * response 包含内容：
//  * response: {
//  *  data: 响应主体内容，一般都是后端返回的数据
//  *  status： 服务器相应的状态码
//  *  statusText: 响应状态码的描述，
//  *  headers：服务器响应头
//  *  config: 之前发送请求是发送给服务器的配置对象
//  *  request: 原生的ajax对象
//  * }
//  *
//  */
axios.interceptors.response.use((response) => {
  // console.log('axios-response--->', response)
  // if (response.data?.data?.token) {
  //   localStorage.setItem('token', response.data.data.token)
  // }
  if (response.data.code !== 200) {
    alert(response?.data?.msg)
  }

  if (response.data.msg == 'token无效,请重新登录') {
    localStorage.setItem('token', '')
    window.location.reload()
  }
  return response.data
})
export default axios
