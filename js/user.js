// 表单验证类
/**
 * @description:
 * @param {String} txtId 文本框的Id
 * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
 * @return {*}
 */
class FieldValidator {
  constructor(txtId, validatorFunc) {
    this.input = $(txtId);
    this.err = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    // 当失去焦点时进行验证
    this.input.onblur = () => {
      this.validate();
    };
  }

  // 验证函数，成功返回true，失败返回false
  // 带有async的函数返回的一定是一个Promise对象，状态取决于该函数内部的返回值
  async validate() {
    // await其实就是then，它会将Promise对象的结果数据返回，而不是返回Promise对象
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.err.innerText = err;
      return false;
    } else {
      this.err.innerText = "";
      return true;
    }
  }
  /**
   * 对传入的所有验证器进行统一验证, 如果所有的验证均通过则返回true， 否则返回false
   * @param {FieldValidator[]} validators
   */
  static async validate(...validators) {
    // 获取所有验证器的验证后的Promise对象
    const proms = validators.map((item) => item.validate()); // proms => [Promise...., Promise....]
    // 见每个验证器的成功与否， 转为布尔值并依次存入数组
    const results = await Promise.all(proms); // results => [true, false, false, .....]
    // 如果所有验证器的结果都是true则返回true， 否则返回false
    return results.every((item) => item);
  }
}
