function getUserInfo() {
  $.ajax({
    type: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      //  renderAvatar渲染用户的头像
      // layer.msg('获取用户信息成功')
      renderAvatar(res.data)
    },
    // 如果不登录不能访问首页
    // complete: function (res) {
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // }
  })
}
function renderAvatar(user) {
  // 1、按照优先级显示，如果存在nickname也就是管理员名称优先显示，没有就显示用户名称
  let name = user.nickname || user.username
  // 2、渲染文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3、判断头像是否存在
  if (user.user_pic !== null) {
    // 如果不为空，将图片头像显示，文本头像隐藏
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    let first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}
$(function () {
  // 封装获取用户基本信息的函数
  getUserInfo()
  let layer = layui.layer

  // 封装渲染用户头像的函数


  // 点击退出，弹出退出登录的提示，清除token并跳转到登录页面，关闭提示框
  $('#btnLogout').click(function () {
    // 弹出退出登录的提示框
    // console.log(111);
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // console.log(index);
      // 清除token
      localStorage.removeItem('token')
      location.href = '/login.html'
      layer.close(index)
    })

  })
})