import ax from '../axios'

// 登录
export function login (
  params
) {
  return ax.post('/login', params)
            .then(res => res.data)
            .catch(e => console.error(e))
}