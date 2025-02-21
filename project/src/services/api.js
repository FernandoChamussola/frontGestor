import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (email, senha) => {
  const response = await api.post('/auth/login', { email, senha })
  localStorage.setItem('token', response.data.token)
  return response.data
}

export const register = async (nome, email, senha,capitalTotal) => {
  const response = await api.post('/auth/register', { nome, email, senha,capitalTotal })
  localStorage.setItem('token', response.data.token)
  return response.data
}

export const getDividas = async () => {
  const response = await api.get('/dividas')
  return response.data
}

export const createDivida = async (data) => {
  const response = await api.post('/dividas', data)
  return response.data
}

export const registrarPagamento = async (dividaId, valor) => {
  const response = await api.post(`/dividas/${dividaId}/pagamento`, { valor })
  return response.data
}

export const getDashboard = async () => {
  const response = await api.get('/relatorios/dashboard')
  return response.data
}

export const downloadPDF = async () => {
  const response = await api.get('/relatorios/devedores/pdf', {
    responseType: 'blob'
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'devedores.pdf')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export default api