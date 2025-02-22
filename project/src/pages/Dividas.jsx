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
  Center,
  VStack,
  Text,
} from '@chakra-ui/react'
import { FiDownload } from 'react-icons/fi'
import { getDividas, registrarPagamento, downloadPDF } from '../services/api'

// Componente do anúncio em tela cheia
const FullScreenAd = ({ isOpen, onClose, onAdComplete }) => {
  const [adStatus, setAdStatus] = useState('Carregando anúncio...');
  const [countdown, setCountdown] = useState(5);
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

  useEffect(() => {
    if (isOpen) {
      // Iniciar contagem regressiva
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Limpar timer
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown === 0) {
      setTimeout(onAdComplete, 1000);
    }
  }, [countdown, onAdComplete]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <Center minH="100vh" position="relative">
          <Box
            w="100%"
            h="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isDevelopment ? (
              // Placeholder para desenvolvimento
              <VStack spacing={4}>
                <Box
                  w="80%"
                  maxW="800px"
                  h="400px"
                  border="2px dashed"
                  borderColor="blue.400"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  p={4}
                >
                  <Text fontSize="xl">📢 Anúncio em Tela Cheia</Text>
                  <Text>Ambiente de desenvolvimento</Text>
                  <Text mt={4}>Aguarde {countdown} segundos...</Text>
                </Box>
              </VStack>
            ) : (
              // Anúncio real para produção
              <Box
                w="80%"
                maxW="800px"
                h="400px"
                position="relative"
              >
                <ins
                  className="adsbygoogle"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                  }}
                  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                  data-ad-slot="YYYYYYYYYYYY"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
                <Text 
                  position="absolute" 
                  bottom="4" 
                  right="4" 
                  bg="blackAlpha.700" 
                  color="white" 
                  px={3} 
                  py={1} 
                  borderRadius="md"
                >
                  {countdown}s
                </Text>
              </Box>
            )}
          </Box>
        </Center>
      </ModalContent>
    </Modal>
  );
};

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
  const { 
    isOpen: isAdOpen, 
    onOpen: onAdOpen, 
    onClose: onAdClose 
  } = useDisclosure()
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
    // Abrir o anúncio primeiro
    onAdOpen();
  }

  const handleAdComplete = async () => {
    // Fechar o anúncio e iniciar o download
    onAdClose();
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
              isLoading={loading}
              w="full"
            >
              Confirmar Pagamento
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <FullScreenAd 
        isOpen={isAdOpen} 
        onClose={onAdClose}
        onAdComplete={handleAdComplete}
      />
    </Box>
  )
}

export default Dividas