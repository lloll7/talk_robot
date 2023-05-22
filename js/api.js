/* 
    api接口
*/
var API = (function () {
  // 定义公共的常量
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";
  // get请求封装
  function get(path) {
    let headers = {};
    // 为验证登录信息, 发送消息等需要登录的authorization(令牌)值的api做准备
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    // 这里的异步方法在后面调用的时候await了，所有这里直接返回异步方法就好
    return fetch(BASE_URL + path, { headers }); // 这里{headers}使用的是对象字面量, 相当于{headers:headers}
  }
  // post请求封装
  function post(path, bodyObj) {
    // 之所以将headers单独分离出来,是为了再判断token是否存在之后再决定传不传入authorization
    let headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }

  // 注册
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();

    // const resp = await fetch(BASE_URL + "/api/user/reg", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(userInfo),
    // });
    // const body = await resp.json();
    // console.log(body);
  }

  // 登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);

    const result = await resp.json();

    /* 这里不用疑惑执行post接口时没有token, 因为确实登陆之前肯定是没有token的 */
    // 登录成功后,将令牌保存起来(localStorage)
    if (result.code === 0) {
      const authorization = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, authorization);
    }

    return result;

    // const resp = await fetch(BASE_URL + "/api/user/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     [TOKEN_KEY]: localStorage.getItem(TOKEN_KEY),
    //   },
    //   body: JSON.stringify(loginInfo),
    // });
    // const body = await resp.json();

    // return body;
  }

  // 检验账号是否存在
  async function exit(loginId) {
    const result = await get(`/api/user/exists?loginId=${loginId}`);
    return await result.json();

    // return result.code === 0;
  }

  // 当前登录的用户信息
  async function proFile() {
    const resp = await get("/api/user/profile");

    return await resp.json();

    // const resp = await fetch(BASE_URL + "/api/user/", {
    //   method: "GET",
    //   headers: {
    //     authorization: `Beader ${localStorage.getItem(TOKEN_KEY)}`,
    //   },
    // });

    // const body = await resp.json();
    // console.log(body);
  }

  // 发送消息
  async function sendMessage(content) {
    const resp = await post("/api/chat", { content });
    return await resp.json();
  }

  // 获取聊天记录
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return await resp.json();
  }

  // 注销登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }

  // 将所有接口都暴露出去
  return {
    reg,
    login,
    exit,
    proFile,
    sendMessage,
    getHistory,
    loginOut,
  };
})();
