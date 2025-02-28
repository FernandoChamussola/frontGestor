import { useEffect, useState } from 'react'
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import { getDashboard , updateCapital } from '../services/api'
import { useDisclosure } from '@chakra-ui/react'

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue('white', 'gray.700')
  const [newCapital, setNewCapital] = useState(0)
  const [disable , setDisable] = useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard()
        setDashboard(data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      }
    }

    fetchDashboard()
    const interval = setInterval(fetchDashboard, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateCapital = async () => {
    try {
      setDisable(true)
      setNewCapital(dashboard.capitalTotal + newCapital)
      await updateCapital(newCapital)
      setNewCapital(0)
      setDisable(false)
      window.location.reload()
      
    } catch (error) {
      setDisable(false)
      console.error('Erro ao atualizar capital:', error)
    }
  }
  if (!dashboard) return null

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <Stat p={6} shadow="md" borderRadius="lg" bg={bgColor} onClick={onOpen}>
          <StatLabel fontSize="lg">Capital Total</StatLabel>
          <StatNumber>{formatCurrency(dashboard.capitalTotal)}</StatNumber>
        </Stat>

        <Stat p={6} shadow="md" borderRadius="lg" bg={bgColor}>
          <StatLabel fontSize="lg">Capital Investido</StatLabel>
          <StatNumber>{formatCurrency(dashboard.capitalInvestido)}</StatNumber>
          <StatHelpText>Em empréstimos ativos</StatHelpText>
        </Stat>

        <Stat p={6} shadow="md" borderRadius="lg" bg={bgColor}>
          <StatLabel fontSize="lg">Lucro Total</StatLabel>
          <StatNumber>{formatCurrency(dashboard.lucroTotal)}</StatNumber>
        </Stat>

        <Stat p={6} shadow="md" borderRadius="lg" bg={bgColor}>
          <StatLabel fontSize="lg">Total Pendente</StatLabel>
          <StatNumber>{formatCurrency(dashboard.totalPendente)}</StatNumber>
          <StatHelpText>A receber</StatHelpText>
        </Stat>

        <Stat p={6} shadow="md" borderRadius="lg" bg={bgColor}>
          <StatLabel fontSize="lg">Capital Disponível</StatLabel>
          <StatNumber>{formatCurrency(dashboard.capitalDisponivel)}</StatNumber>
          <StatHelpText>Para novos empréstimos</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Capital</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Valor(posetivo para adicionar , negativo para remover)</FormLabel>
              <Input type="number" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="teal" onClick={() => handleUpdateCapital()} disabled={disable}>Adicionar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}



export default Dashboard

