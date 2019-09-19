
import * as article from './module/article'
import * as qn from './module/qn'
import * as comment from './module/comment'
import * as user from './module/user'


export default {
  ...article,
  ...qn,
  ...comment,
  ...user
}
