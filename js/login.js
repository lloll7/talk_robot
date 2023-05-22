// 登录账号的验证
const loginIdValidator = new FieldValidator("#txtLoginId", async function (
  val
) {
  if (!val) {
    return "账号不能为空！";
  }
});

// 登录密码的验证
const txtLoginPwdValidator = new FieldValidator("#txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form"); // 获取注册表单元素
// 对表单绑定提交事件
form.onsubmit = async function (e) {
  // 取消提交默认事件
  e.preventDefault();

  const result = await FieldValidator.validate(
    loginIdValidator,
    txtLoginPwdValidator
  );

  if (!result) {
    return; // "验证未通过";
  }
  //   传入表单的dom，得到表单的数据对象
  const formData = new FormData(form);
  //   formData.entries()， 可以得到结构为[["a": 1], ["b": 2]]的数据，而用Object.formentries()可以将其转换为{ a:1,b:2 }的格式
  const formDataArr = Object.fromEntries(formData.entries());

  const resp = await API.login(formDataArr);

  if (resp.code === 0) {
    alert("登陆成功， 跳转到首页");
    location.href = "./index.html";
  } else {
    loginIdValidator.err.innerText = "登录失败， 账号或者密码错误";
    txtLoginPwdValidator.input.value = "";
  }
};
