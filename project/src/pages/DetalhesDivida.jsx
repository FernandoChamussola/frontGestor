import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Text, VStack, HStack, Badge, IconButton } from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { getDividaDetalhes } from '../services/api'
import { Link } from 'react-router-dom'

export default function DetalhesDivida() {
  const [divida, setDivida] = useState({
    devedor: { nome: '' },
    valorInicial: 0,
    taxaJuros: 0,
    dataEmprestimo: new Date(),
    dataVencimento: new Date(),
    status: 'ATIVA',
    observacoes: '',
  })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchDivida() {
      try {
        const response = await getDividaDetalhes(id)
        setDivida(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDivida()
  }, [id])

  const calcularValorComJuros = () => {
    const juros = divida.valorInicial * (divida.taxaJuros / 100)
    return divida.valorInicial + juros
  }

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <HStack justify="space-between" w="100%">
        <Text fontSize="2xl" fontWeight="bold">
          {divida.devedor?.nome}
        </Text>
        <Badge
          variant="outline"
          colorScheme={divida.status === 'ATIVA' ? 'green' : 'red'}
        >
          {divida.status}
        </Badge>
      </HStack>

      <VStack align="start" spacing={2} mt={2} w="100%">
        <Text>
          Valor Inicial: R$ {divida.valorInicial?.toFixed(2)}
        </Text>
        <Text>
          Taxa de Juros: {divida.taxaJuros?.toFixed(2)}%
        </Text>
        <Text>
          Valor com Juros: R$ {calcularValorComJuros().toFixed(2)}
        </Text>
        <Text>
          Data de Empréstimo: {new Date(divida.dataEmprestimo).toLocaleDateString()}
        </Text>
        <Text>
          Data de Vencimento: {new Date(divida.dataVencimento).toLocaleDateString()}
        </Text>
        <Text>
          Observações: {divida.observacoes}
        </Text>
      </VStack>

      <HStack justify="space-between" mt={4} w="100%">
        <IconButton
          icon={<FiDownload />}
          aria-label="Imprimir Página"
          variant="outline"
          colorScheme="blue"
          onClick={() => window.print()}
        />
      </HStack>

        <Link to="/dividas">
        voltar
        </Link>
    </Box>
  )
}

