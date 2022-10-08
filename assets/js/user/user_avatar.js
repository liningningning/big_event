$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 给上传按钮添加模拟点击事件
  $('#btnChooseImage').click(function () {
    $('#file').click()
  })
  // 为文件选择框绑定change事件
  $('#file').on('change', function (e) {
    console.log();
    let filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('请选择照片')
    }
    // 拿到用户选择的文件
    let file = filelist[0]
    // 将文件转化为路径
    let imgURL = URL.createObjectURL(file)
    console.log(imgURL);
    // 重新初始化路径
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', imgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域

  })
  let layer = layui.layer
  // 点击确定发送请求，将裁剪的照片上传到服务器
  $('#btnUpload').click(function () {
    let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    $.ajax({
      type: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        window.parent.getUserInfo()
      }
    })
  })
  
})