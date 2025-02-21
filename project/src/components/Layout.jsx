import { Box, Flex, IconButton, useColorMode, VStack, Heading, Button } from '@chakra-ui/react'
import { FiSun, FiMoon, FiHome, FiDollarSign, FiPlusCircle, FiLogOut } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <Flex>
      <Box
        w="250px"
        h="100vh"
        bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
        p={5}
        position="fixed"
      >
        <VStack spacing={8} align="stretch">
          <Heading size="md" textAlign="center">Gestor Agiota</Heading>
          
          <VStack spacing={4} align="stretch">
            <Button
              as={Link}
              to="/"
              leftIcon={<FiHome />}
              variant="ghost"
              justifyContent="flex-start"
            >
              Dashboard
            </Button>
            
            <Button
              as={Link}
              to="/dividas"
              leftIcon={<FiDollarSign />}
              variant="ghost"
              justifyContent="flex-start"
            >
              Dívidas
            </Button>
            
            <Button
              as={Link}
              to="/nova-divida"
              leftIcon={<FiPlusCircle />}
              variant="ghost"
              justifyContent="flex-start"
            >
              Nova Dívida
            </Button>
          </VStack>

          <VStack mt="auto" spacing={4}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
            />
            
            <Button
              leftIcon={<FiLogOut />}
              onClick={handleLogout}
              variant="ghost"
              w="full"
            >
              Sair
            </Button>
          </VStack>
        </VStack>
      </Box>

      <Box ml="250px" p={8} w="full">
        {children}
      </Box>
    </Flex>
  )
}

export default Layout