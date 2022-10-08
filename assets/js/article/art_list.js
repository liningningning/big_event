$(function () {
  // 定义美化时间的过滤器
  template.defaults.imports.dataFromate = function (date) {
    const time = new Date(date)
    let y = time.getFullYear()
    let m = String(time.getMonth() + 1).padStart(2, '0')
    let d = String(time.getDate()).padStart(2, '0')
    let hh = String(time.getHours())
    let mm = String(time.getMinutes())
    let ss = String(time.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }
  let layer = layui.layer
  // 获取表格数据
  initTable()
  function initTable() {
    $.ajax({
      type: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 渲染页面
        // 使用模板引擎渲染页面
        let htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }

    })
  }
  // 请求文章分类，封装函数
  initCate()
  let form = layui.form
  function initCate() {
    $.ajax({
      type: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }
  // 筛选对应的文章
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    let cate_id = $('[name=cate_id]').val()
    let state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })
  // 分页功能的实现
  let laypage = layui.laypage
  function renderPage(total) {
    // console.log(total);
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // jump回调函数
      jump: function (obj, first) {
        // 把当前最新的页码值，赋值给q这个查询参数中
        q.pagenum = obj.curr
        // 把最新的条目数赋值到q这个参数对象中
        q.pagesize = obj.limit
        if (!first) {
          initTable()
        }
      }
    })
  }
  // 删除功能
  $('tbody').on('click', '#btn-delete', function () {
    var len = $('.btn-delete').length
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })
})