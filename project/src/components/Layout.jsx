import React from 'react';
import { Box, Flex, IconButton, useColorMode, VStack, Heading, Button, Link, useDisclosure } from '@chakra-ui/react';
import { FiSun, FiMoon, FiMenu, FiLogOut, FiHome, FiDollarSign, FiPlusCircle } from 'react-icons/fi';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: <FiHome />, label: 'Dashboard' },
    { path: '/dividas', icon: <FiDollarSign />, label: 'Dívidas' },
    { path: '/nova-divida', icon: <FiPlusCircle />, label: 'Nova Dívida' },
    { path: '/contato', icon: <FiPlusCircle />, label: 'Contacto' },
    { path: '/sobre-o-app', icon: <FiHome />, label: 'Sobre o app' },
    { path: '/politicas-de-seguranca', icon: <FiLogOut />, label: 'Politicas de Seguranca' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box
      w={{ base: "full", md: "250px" }}
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      position="fixed"
      h="100vh"
      overflowY="auto"
      transform={{ base: isOpen ? "translateX(0)" : "translateX(-100%)", md: "translateX(0)" }}
      transition="transform 0.3s ease"
      zIndex={20}
    >
      <VStack spacing={4} align="stretch" minH="100%" p={5}>
        <Heading 
          size="md" 
          textAlign="center"
          color={colorMode === 'light' ? 'gray.700' : 'white'}
        >
          Gestor Agiota
        </Heading>
        
        <VStack spacing={2} align="stretch">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              as={RouterLink}
              to={item.path}
              leftIcon={item.icon}
              variant="ghost"
              justifyContent="flex-start"
              w="full"
              color={colorMode === 'light' ? 'gray.700' : 'gray.100'}
              _hover={{
                bg: colorMode === 'light' ? 'gray.200' : 'gray.700'
              }}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
            >
              {item.label}
            </Button>
          ))}
        </VStack>

        <Box mt="auto">
          <VStack spacing={4} mt={4}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="outline"
              colorScheme={colorMode === 'light' ? 'gray' : 'white'}
            />
            <Button
              leftIcon={<FiLogOut />}
              onClick={handleLogout}
              variant="ghost"
              w="full"
              colorScheme="red"
            >
              Sair
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  return (
    <Flex minH="100vh">
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={15}
          display={{ base: "block", md: "none" }}
          onClick={onClose}
        />
      )}

      <IconButton
        icon={<FiMenu />}
        onClick={onOpen}
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top={4}
        left={4}
        zIndex={30}
        aria-label="Open menu"
      />

      <Sidebar isOpen={isOpen} onClose={onClose} />

      <Box 
        ml={{ base: 0, md: "250px" }}
        p={8}
        pt={{ base: 16, md: 8 }}
        w="full"
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
      >
        <Flex direction="column" minH="calc(100vh - 16px)">
          <Box flex="1">
            {children}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Layout;

