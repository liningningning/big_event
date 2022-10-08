$(function () {
  // 初始化富文本编辑器
  initEditor()
  // 获取文章类别，发送ajax请求
  initCate()
  let layer = layui.layer
  let form = layui.form
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // console.log(res);
        // 渲染到第二行选择文章类别中
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()

      }
    })
  }

  // 实现基本的裁剪效果
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 点击上传文件出发inout ：file事件可以选择上传文件
  $('#btnChooseImage').click(function () {
    $('#coverFile').click()
  })
  // 给上传文件绑定change事件
  $('#coverFile').change(function (e) {
    let file = e.target.files[0]
    if (file.length === 0) {
      return
    }
    // 根据文件创建对应的url地址
    let newImgURL = URL.createObjectURL(file)
    // 创建裁剪区域
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)
  })
  // 初始状态
  let art_state = '已发布'
  $('#btnSave2').click(function () {
    art_state = '草稿'
  })
  // 给表单添加提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 创建表单对象
    let fd = new FormData($(this)[0])
    // 把状态追加到fd中
    fd.append('state', art_state)
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 6. 发起 ajax 数据请求
        // 封装函数发起ajax请求
        publishArticle(fd)
      })
  })
  function publishArticle(fd) {
    $.ajax({
      type: 'POST',
      url: '/my/article/add',
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})