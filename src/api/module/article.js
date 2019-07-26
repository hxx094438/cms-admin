import ax from '../axios'

// 获取文章列表
export function getAllArticles ( params ) {
  return ax.get('/articles/all', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}
