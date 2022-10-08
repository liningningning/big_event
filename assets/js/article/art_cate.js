$(function () {
  initArtCateList()
  let layer = layui.layer
  let form = layui.form
  let indexAdd = null
  // 获取文章分类，发起ajax请求
  function initArtCateList() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        // 成功之后将数据渲染到页面，使用模板字符串
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }

    })
  }
  // 点击添加类别，显示弹出层
  $('#btnAddCate').on('click', function () {

    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })
  // 点击弹出层里的确认修改，触发提交事件发起ajax请求
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        // 根据索引号关闭弹出层
        layer.close(indexAdd)
        // 重新渲染分类表格
        initArtCateList()
      }
    })
  })
  // 点击编辑，弹出弹出层，获取当前的类别内容，要将id参数传进去
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function (e) {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
    })
    let id = $(this).attr('data-id')
    // 发起ajax请求对应的数据分类
    $.ajax({
      type: 'Get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })
  // 为按钮绑定事件提交
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  $('body').on('click', '.btn-delete', function (e) {
    // console.log(111);
    let id = $(this).attr('data-id')
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })


})