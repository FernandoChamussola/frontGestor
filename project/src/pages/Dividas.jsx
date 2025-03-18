import { useEffect, useState } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Switch,
  Flex,
  Badge,
} from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { getDividas, registrarPagamento, downloadPDF } from '../services/api'
import { Link } from 'react-router-dom';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  }).format(value)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function Dividas() {
  const [dividas, setDividas] = useState([])
  const [filteredDividas, setFilteredDividas] = useState([])
  const [selectedDivida, setSelectedDivida] = useState(null)
  const [valorPagamento, setValorPagamento] = useState('')
  const [loading, setLoading] = useState(false)
  const [mostrarQuitadas, setMostrarQuitadas] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const fetchDividas = async () => {
    try {
      const data = await getDividas()
      setDividas(data)
      applyFilter(data, mostrarQuitadas)
    } catch (error) {
      toast({
        title: 'Erro ao carregar dívidas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const applyFilter = (data, showPaid) => {
    if (showPaid) {
      setFilteredDividas(data)
    } else {
      // Filtra apenas as dívidas não quitadas (assumindo que 'QUITADA' é o status para dívidas pagas)
      setFilteredDividas(data.filter(divida => divida.status !== 'QUITADA'))
    }
  }

  const isOverdue = (dataVencimento) => {
    const today = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < today;
  }

  useEffect(() => {
    fetchDividas()
  }, [])

  useEffect(() => {
    applyFilter(dividas, mostrarQuitadas)
  }, [mostrarQuitadas])

  const handlePagamento = async () => {
    if (!selectedDivida || !valorPagamento) return

    const valorPagoTotal = selectedDivida.valorPago + Number(valorPagamento)
    const valorInicialComJuros = selectedDivida.valorInicial + (selectedDivida.valorInicial * selectedDivida.taxaJuros / 100)

    if (valorPagoTotal > valorInicialComJuros) {
      toast({
        title: 'Valor do pagamento excede o valor total da dívida',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true)
    try {
      await registrarPagamento(selectedDivida.id, Number(valorPagamento))
      await fetchDividas()
      onClose()
      toast({
        title: 'Pagamento registrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao registrar pagamento',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
      setValorPagamento('')
    }
  }

  const handleDownloadPDF = async () => {
    try {
      await downloadPDF();
    } catch (error) {
      toast({
        title: 'Erro ao baixar PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading>Dívidas</Heading>
        <Button
          leftIcon={<FiDownload />}
          onClick={handleDownloadPDF}
          colorScheme="green"
        >
          Exportar PDF
        </Button>
      </HStack>

      <Flex justifyContent="flex-end" mb={4}>
        <FormControl display="flex" alignItems="center" width="auto">
          <FormLabel htmlFor="mostrar-quitadas" mb="0">
            Mostrar dívidas quitadas
          </FormLabel>
          <Switch 
            id="mostrar-quitadas" 
            isChecked={mostrarQuitadas} 
            onChange={() => setMostrarQuitadas(!mostrarQuitadas)}
            colorScheme="green"
          />
        </FormControl>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Devedor</Th>
            <Th>Valor Inicial</Th>
            <Th>Valor a pagar</Th>
            <Th>Valor Pago</Th>
            <Th>Vencimento</Th>
            <Th>Status</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDividas.map((divida) => {
            const overdueDebt = isOverdue(divida.dataVencimento) && divida.status !== 'QUITADA';
            
            return (
              <Tr 
                key={divida.id} 
                backgroundColor={overdueDebt ? 'red.50' : 'inherit'}
              >
                <Td color={overdueDebt ? 'red.600' : 'inherit'}>
                  {divida.devedor.nome}
                </Td>
                <Td color={overdueDebt ? 'red.600' : 'inherit'}>
                  {formatCurrency(divida.valorInicial)}
                </Td>
                <Td color={overdueDebt ? 'red.600' : 'inherit'}>
                  {formatCurrency(divida.valorAtual + divida.valorAtual * (divida.taxaJuros / 100))}
                </Td>
                <Td color={overdueDebt ? 'red.600' : 'inherit'}>
                  {formatCurrency(divida.valorPago)}
                </Td>
                <Td color={overdueDebt ? 'red.600' : 'inherit'}>
                  {formatDate(divida.dataVencimento)}
                  {overdueDebt && (
                    <Badge ml={2} colorScheme="red">
                      Em atraso
                    </Badge>
                  )}
                </Td>
                <Td color={overdueDebt ? 'red.600' : 'inherit'}>
                  {divida.status}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme={overdueDebt ? "red" : "green"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDivida(divida);
                      onOpen();
                    }}
                    isDisabled={divida.status === 'QUITADA'}
                  >
                    Registrar Pagamento
                  </Button>
                </Td>
                <td>
                  <Link to={`/dividasDetalhes/${divida.id}`}>
                  <Button variant="link" size="sm" colorScheme="blue">
                    Detalhes
                  </Button>
                  </Link>
                </td>

                <td>
                  <Link to={`/editar/${divida.id}`}>
                  <Button variant="link" size="sm" colorScheme="orange">
                    Editar
                  </Button>
                  </Link>
                </td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Valor do Pagamento</FormLabel>
              <Input
                type="number"
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
                placeholder="0,00"
              />
            </FormControl>

            <Button
              mt={4}
              colorScheme="green"
              onClick={handlePagamento}
              isLoading={loading}
              w="full"
            >
              Confirmar Pagamento
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Dividas