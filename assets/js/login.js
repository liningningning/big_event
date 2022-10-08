$(function () {
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()

  })

  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()

  })
  // 密码和确认密码的正则
  let form = layui.form
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能出现空格'],
    // 判断两次密码一致
    repwd: function (value) {
      let pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码输入不一致'
      }
    }
  })

  // 点击注册，发送后台请求
  let layer = layui.layer
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    console.log(data);
    $.ajax({
      type: "POST",  //默认get
      url: "/api/reguser",  //默认当前页
      data: data,  //格式{key:value}

      success: res => {  //请求成功回调
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功，请登录！')
        // console.log($(this));
        $(this)[0].reset()
        $('#link_login').click()
      },
    })
  })

  // 点击登录发送post请求，将用户名和密码传到后台进行验证
  $('#form_login').submit(function (e) {
    e.preventDefault()
    $.ajax({
      type: "POST",  //默认get
      url: "/api/login",  //默认当前页
      data: $(this).serialize(),  //格式{key:value}
      success: function (res) {  //请求成功回调
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      },

    })
  })
})