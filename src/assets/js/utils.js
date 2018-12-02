// 景安服务器 
import { getQueryString } from './mUtils'

const baseUrl = 'http://202.102.254.18:8088';
let token = getQueryString('token') || ''
var utils = {
    token: token,
    baseUrl: baseUrl
}
export default utils