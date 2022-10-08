$.ajaxPrefilter(function (options) {
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  // indexof 如果没有找到值返回-1
  // 如果请求的字符串中包含my这个字符，
  if (options.url.indexOf('/my/') !== -1) {
    // 执行
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }


})