// 注册账号的验证
const loginIdValidator = new FieldValidator("#txtLoginId", async function (
  val
) {
  if (!val) {
    return "账号不能为空！";
  }
  // 如果不为空，则要调用exit接口判断账号是否存在
  const resp = await API.exit(val);
  if (resp.data) {
    return "该账号已存在";
  }
});

// 注册昵称的验证
const txtNicknameValidator = new FieldValidator("#txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});

// 注册密码的验证
const txtLoginPwdValidator = new FieldValidator("#txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

// 再次输入密码的验证
const txtLoginPwdConfirmValidator = new FieldValidator(
  "#txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== txtLoginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

const form = $(".user-form"); // 获取注册表单元素
// 对表单绑定提交事件
form.onsubmit = async function (e) {
  // 取消提交默认事件
  e.preventDefault();
  // 统计所有验证器的结果
  const result = await FieldValidator.validate(
    loginIdValidator,
    txtNicknameValidator,
    txtLoginPwdValidator,
    txtLoginPwdConfirmValidator
  );
  if (!result) {
    return "验证未通过";
  }
  //   传入表单的dom，得到表单的数据对象
  const formData = new FormData(form);
  //   formData.entries()， 可以得到结构为[["a": 1], ["b": 2]]的数据，而用Object.formentries()可以将其转换为{ a:1,b:2 }的格式
  const formDataArr = Object.fromEntries(formData.entries());

  const resp = await API.reg(formDataArr);
  //   登录成功则跳转页面
  if (resp.code === 0) {
    alert("登陆成功， 跳转到登录页面");
    location.href = "./login.html";
  }
};
