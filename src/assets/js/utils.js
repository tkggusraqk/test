// 景安服务器 
import { getQueryString } from './mUtils'

const baseUrl = 'http://122.114.5.87:8081';
let token = getQueryString('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1MDk2MGIzLTA1MGQtNGJkOC04MmRkLWI5ZmQ5MzhlYzQyYyIsInBhcnR5X2NvZGUiOiIiLCJvcmdfaWQiOjcsIm5hbWUiOiLnqIvmlrDmlawiLCJwYXJ0eV9vcmciOiLlhZrlp5Tlip7lhazlrqTlhZrmlK_pg6giLCJtb2JpbGUiOiIxNzYzMDUwMzY2OSIsInBvbGl0aWNhbF9zdGF0dXMiOiLkuK3lhbHlhZrlkZgiLCJnZW5kZXIiOjAsImVtYWlsIjoiIiwiam9pbl90aW1lIjoiMjAxMS0wOC0wMSIsImhlYWRfaW1nIjpudWxsLCJwaG90byI6Ii9oZWFkZXJzLzlmOTBkZmJjLWY3OWMtNGQ2Yy1hMmJlLWU4ZmE1NDFjMzNmYi5wbmciLCJsb2dpbl90eXBlIjoiYXBwIiwiaXNNYW5hZ2VyIjp0cnVlLCJpYXQiOjE1NDI1MTU5NjEsImV4cCI6MTU0MzEyMDc2MX0.ayWKDxrYpP8xHwquSGdlLj-IB2KmzM51NFZttEBj4fQ'
var utils = {
    token: token,
    baseUrl: baseUrl
}
export default utils