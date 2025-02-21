import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Dividas from './pages/Dividas'
import NovaDivida from './pages/NovaDivida'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <Box minH="100vh">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/dividas" element={
          <PrivateRoute>
            <Layout>
              <Dividas />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/nova-divida" element={
          <PrivateRoute>
            <Layout>
              <NovaDivida />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Box>
  )
}

export default App