import ax from '../axios'

// 获取文章列表
export function getAllArticles ( params ) {
  return ax.get('/articles/all', { params })
    .then(res => res.data)
    .catch(e => console.error(e))
}

export function getArticle ( aid ) {
  return ax.get(`/articles/${aid}`)
    .then(res=> {
      return res.data
    })
    .catch(e => console.error(e))
}

export function saveArticle (params) {
  return ax.post(`/articles/save`,params)
  .then(res=> {
    return res.data
  })
  .catch(e => console.error(e))
}

export function patchArticle (params) {
  return ax.patch(`/articles/save/${params.aid}`,params)
  .then(res=> {
    return res.data
  })
  .catch(e => console.error(e))
}

export function getTags ( params ) {
  return ax.get('/articles/tags', {params})
    .then(res => res.data)
    .catch(e => console.error(e))
}


// 修改文章状态
export function patchArt ( params ) {
  return ax.patch(`/articles/save/${params.article.aid}`, params)
    .then(res => res.data)
    .catch(e => console.error(e))
}
