import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from '@chakra-ui/react'
import { createDivida } from '../services/api'

function NovaDivida() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    const data = {
      nomeDevedor: formData.get('nomeDevedor'),
      telefone: formData.get('telefone'),
      endereco: formData.get('endereco'),
      valorInicial: Number(formData.get('valorInicial')),
      taxaJuros: Number(formData.get('taxaJuros')),
      dataVencimento: formData.get('dataVencimento'),
      observacoes: formData.get('observacoes'),
    }

    try {
      await createDivida(data)
      toast({
        title: 'Dívida criada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dividas')
    } catch (error) {
      toast({
        title: 'Erro ao criar dívida',
        description: error.response?.data?.error || 'Ocorreu um erro ao criar a dívida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Nova Dívida</Heading>

      <Box p={6} borderWidth={1} borderRadius="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome do Devedor</FormLabel>
              <Input name="nomeDevedor" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Telefone</FormLabel>
              <Input name="telefone" type="tel" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Endereço</FormLabel>
              <Input name="endereco" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Valor Inicial</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField name="valorInicial" />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Taxa de Juros (%)</FormLabel>
              <NumberInput min={0} max={100}>
                <NumberInputField name="taxaJuros" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Data de Vencimento</FormLabel>
              <Input name="dataVencimento" type="date" />
            </FormControl>

            <FormControl>
              <FormLabel>Observações</FormLabel>
              <Textarea name="observacoes" />
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              size="lg"
              width="full"
              
            >
              Criar Dívida
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}

export default NovaDivida