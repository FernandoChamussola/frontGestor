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
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { getDashboard , updateCapital, deleteUser } from '../services/api'
import { useNavigate } from 'react-router-dom'

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MTS'
  }).format(value)
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
  const bgColor = useColorModeValue('white', 'gray.700')
  const [newCapital, setNewCapital] = useState(0)
  const [disable , setDisable] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const navigate = useNavigate()

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
      const newCapitalTotal = parseFloat(dashboard.capitalTotal) + parseFloat(newCapital)
      await updateCapital(newCapitalTotal.toFixed(2))
      setNewCapital(0)
      setDisable(false)
      window.location.reload()
      
    } catch (error) {
      setDisable(false)
      console.error('Erro ao atualizar capital:', error)
    }
  }

  const handleDeleteAll = async () => {
    try {
      await deleteUser()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao deletar todos os dados:', error)
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
              <FormLabel>Valor (positivo para adicionar, negativo para remover)</FormLabel>
              <Input type="number" onChange={(e) => setNewCapital(e.target.value)}/>
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

      <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reiniciar Sistema</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" mb={5}>
              <AlertIcon />
              <AlertTitle>Atenção!</AlertTitle>
              Essa ação vai deletar todos os dados do sistema, incluindo empréstimos e usuários.
            </Alert>
            <FormControl>
              <FormLabel>Você tem certeza que deseja continuar?</FormLabel>
              <Button colorScheme="red" onClick={() => setDeleteConfirm(true)}>Sim, deletar tudo</Button>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onCloseDelete}>
              Cancelar
            </Button>
            {deleteConfirm && (
              <Button colorScheme="red" onClick={() => handleDeleteAll()}>Deletar</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button mt={4} colorScheme="red" onClick={onOpenDelete}>Reiniciar Sistema</Button>
    </Box>
  )
}



export default Dashboard

