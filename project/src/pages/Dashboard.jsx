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
} from '@chakra-ui/react'
import { getDashboard } from '../services/api'

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const bgColor = useColorModeValue('white', 'gray.700')

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

  if (!dashboard) return null

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <Stat p={6} shadow="md" borderRadius="lg" bg={bgColor}>
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
    </Box>
  )
}

export default Dashboard