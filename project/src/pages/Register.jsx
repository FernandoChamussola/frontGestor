import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
} from '@chakra-ui/react'
import { register } from '../services/api'

function Register() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [capitalTotal,setcapitalTotal] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(nome, email, senha,capitalTotal)
      navigate('/login')
    } catch (error) {
      toast({
        description: error.response?.data?.error || 'Ocorreu um erro ao criar sua conta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={20}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">Registro</Heading>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Capital</FormLabel>
                <Input
                  type="number"
                  value={capitalTotal}
                  onChange={(e) => setcapitalTotal(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={loading}
              >
                Registrar
              </Button>
            </VStack>
          </form>

          <Text textAlign="center">
            Já tem uma conta?{' '}
            <Link as={RouterLink} to="/login" color="green.500">
              Faça login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default Register