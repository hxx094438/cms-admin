import ax from '../axios'

// 获取文章列表
export function getAllArticles ( params ) {
  return ax.get('/articles/all', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}


// 修改文章状态
export function patchArt ( params ) {
  console.log('params',params)
  return ax.patch(`/articles/save/${params.article.aid}`, params)
    .then(res => res.data)
    .catch(e => console.error(e))
}