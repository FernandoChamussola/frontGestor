import axios from 'axios'

const api = axios.create({
   baseURL: 'https://gestor-agiota.onrender.com/api'
  //baseURL: 'http://localhost:3000/api'
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
  localStorage.setItem('userId', response.data.id)
  
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

export const getDividaDetalhes = async (id) => {
 // const usuarioId = localStorage.getItem('userId')
  const response = await api.get(`/dividas/detalhes/${id}`)
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

export const updateCapital = async (capitalTotal) => {
  const userId = localStorage.getItem('userId')
  const data = {
    userId,
    capitalTotal
  }
  const response = await api.post(`/usuarios/atualizar/capital`, data)
  console.log(response.data.message)
  return response.data
}

export const mensagemm = async (dados) => {
  const data = {
    nome : dados.nome,
    email : dados.email,
    mensagem : dados.mensagem
  }
  const response = await api.post('/mensagem', data)
  return response.data
}

export const deleteUser = async () => {
  const id = localStorage.getItem('userId')
  try {
    const usuario = await api.put(`/usuarios/${id}/reiniciar`)
    if (usuario.status === 404) {
      return { error: 'Usuário não encontrado' }
    }

    return { message: 'Usuário e suas informações apagados com sucesso' }
  } catch (error) {
    return { error: 'Erro ao apagar usuário' }
  }
}

export const updateDivida = async (id, data) => {
  const response = await api.put(`/dividas/${id}`, data)
  return response.data
}

export default api

