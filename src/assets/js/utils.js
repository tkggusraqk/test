// 景安服务器 
import { getQueryString } from './mUtils'

const baseUrl = 'http://122.114.5.87:8081';
let token = getQueryString('token') || ''
var utils = {
    token: token,
    baseUrl: baseUrl
}
export default utils