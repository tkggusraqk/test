// 景安服务器 
import { getQueryString } from './mUtils'

const baseUrl = 'http://122.114.5.87:8081';
let token = getQueryString('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1MDk2MGIzLTA1MGQtNGJkOC04MmRkLWI5ZmQ5MzhlYzQyYyIsInBhcnR5X2NvZGUiOiIiLCJvcmdfaWQiOjcsIm5hbWUiOiLnqIvmlrDmlawiLCJwYXJ0eV9vcmciOiLlhZrlp5Tlip7lhazlrqTlhZrmlK_pg6giLCJtb2JpbGUiOiIxNzYzMDUwMzY2OSIsInBvbGl0aWNhbF9zdGF0dXMiOiLkuK3lhbHlhZrlkZgiLCJnZW5kZXIiOjAsImVtYWlsIjoiIiwiam9pbl90aW1lIjoiMjAxMS0wOC0wMSIsImhlYWRfaW1nIjpudWxsLCJwaG90byI6Ii9oZWFkZXJzLzlmOTBkZmJjLWY3OWMtNGQ2Yy1hMmJlLWU4ZmE1NDFjMzNmYi5wbmciLCJpc01hbmFnZXIiOnRydWUsImxvZ2luX3R5cGUiOiJhcHAiLCJpYXQiOjE1NDA4MTg3MDAsImV4cCI6MTU0MTQyMzUwMH0.-RKnvxbB17uFoVKxQHEKg7uokK3k-ayWdN1SY9GvPJo'
var utils = {
    token: token,
    baseUrl: baseUrl
}
export default utils