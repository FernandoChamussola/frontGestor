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
} from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { getDividas, registrarPagamento, downloadPDF } from '../services/api'

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
  const [selectedDivida, setSelectedDivida] = useState(null)
  const [valorPagamento, setValorPagamento] = useState('')
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const fetchDividas = async () => {
    try {
      const data = await getDividas()
      setDividas(data)
    } catch (error) {
      toast({
        title: 'Erro ao carregar dívidas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    fetchDividas()
  }, [])

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
      await downloadPDF()
    } catch (error) {
      toast({
        title: 'Erro ao baixar PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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
          {dividas.map((divida) => (
            <Tr key={divida.id}>
              <Td>{divida.devedor.nome}</Td>
              <Td>{formatCurrency(divida.valorInicial)}</Td>
              <Td>
                {formatCurrency(divida.valorAtual + divida.valorAtual * (divida.taxaJuros / 100))}
              </Td>
              <Td>{formatCurrency(divida.valorPago)}</Td>
              <Td>{formatDate(divida.dataVencimento)}</Td>
              <Td>{divida.status}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => {
                    setSelectedDivida(divida)
                    onOpen()
                  }}
                >
                  Registrar Pagamento
                </Button>
              </Td>
            </Tr>
          ))}
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