// 验证是否有登录，如果没有则跳转到登录页面，如果有登录，则获取到用户的登录信息
(async function () {
  // 直接去请求登陆用户的数据，这个api会传入token到服务器端，如果token有效，则可以收到resp.data, 反之则没有
  const resp = await API.proFile();
  const user = resp.data;
  if (!user) {
    alert("请先登录");
    location.href = "./login.html";
    return;
  }
  //   要用到的所有dom元素的集合
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    container: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    sendBtn: $(".msg-container button"),
    mesageContainer: $(".msg-container"),
  };
  //   以下代码环境一定是登陆状态下的

  setUserInfo(); // 设置用户侧边栏显示信息，函数定义在下边
  // 注销登录
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html";
  };

  //   加载历史记录
  loadHistory();

  // 加载历史记录
  async function loadHistory() {
    const resp = await API.getHistory();
    console.log(resp);
    for (let item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  //   设置用户信息
  function setUserInfo() {
    // 这里只能用innreText去进行添加，不能用innerHTML,
    // 因为如果使用innerHTML，当用户在注册时输入的代码时，这些代码在登录的时候是会执行的，导致一些xxs攻击
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  //   传入消息对象，将其添加到页面中
  /*
    消息对象的属性：
        content: "你几岁啦"
        createdAt: 1651213235
        from: "linzy"
        to: null 
  */
  async function addChat(chatInfo) {
    // 创建用户或机器人气泡
    const div = $$$("div");
    div.className = "chat-item";
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const div_img = $$$("img");
    div_img.className = "chat-avatar";
    div_img.src = `./asset/${
      chatInfo.from ? "avatar.png" : "robot-avatar.jpg"
    }`;

    const div_Content = $$$("div");
    div_Content.className = "chat-content";
    div_Content.innerText = chatInfo.content;

    const div_time = $$$("div");
    div_time.className = "chat-date";
    div_time.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(div_img);
    div.appendChild(div_Content);
    div.appendChild(div_time);

    doms.container.appendChild(div);
  }

  //   让滚动条滚动到最下方的
  function scrollBottom() {
    doms.container.scrollTop = doms.container.scrollHeight;
  }
  // 格式化时间戳
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    //   单位数月时在前面补充0
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDay().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}-${minute}-${second}`;
  }
  //  发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    // 为了让用户点击发送后，输入的消息以最快的速度显示在页面，所以这里在网络请求之前就先将它展示在页面
    // 网络请求在背后慢慢请求回答
    addChat({
      from: user.nickname,
      tp: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();

    const resp = await API.sendMessage(content);
    addChat({
      from: null,
      to: user.nickname,
      ...resp.data,
    });
    scrollBottom();
  }

  //   给表单绑定提交事件
  doms.mesageContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
})();
