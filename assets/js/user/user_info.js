$(function () {
  let form = layui.form
  let layer = layui.layer
  // 表单添加验证
  form.verify({
    nickname: function (value) {
      if (value.value > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })
  // 封装函数，初始化用户的基本信息
  initUserInfo()
  function initUserInfo() {
    $.ajax({
      type: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        console.log(res);
        form.val('formUserInfo', res.data)

      }

    })
  }
  // 点击重置，恢复到修改前的状态
  $('#btnReset').click(function (e) {
    // 阻止表单的默认行为
    e.preventDefault()
    // 重新渲染用户基本信息的函数
    initUserInfo()
  })
  // 确认修改功能的实现
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('更新用户信息成功！')
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()

      }
    })
  })

})