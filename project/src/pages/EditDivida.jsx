import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, useToast } from '@chakra-ui/react';
import { updateDivida, getDividaDetalhes } from '../services/api';

function EditDivida() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    valorInicial: 0,
    taxaJuros: 0,
    dataVencimento: '',
    observacoes: '',
  });

  useEffect(() => {
    async function fetchDivida() {
      try {
        const response = await getDividaDetalhes(id);
        setFormData(response);
      } catch (error) {
        console.log(error);
      }
    }
    fetchDivida();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        valorInicial: Number(formData.valorInicial),
        taxaJuros: Number(formData.taxaJuros),
        dataVencimento: formData.dataVencimento,
        observacoes: formData.observacoes,
      };
      await updateDivida(id, updatedData);
      toast({
        title: 'Dívida atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dividas');
    } catch (error) {
      toast({
        title: 'Erro ao atualizar dívida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="valorInicial">
            <FormLabel>Valor Inicial</FormLabel>
            <Input type="number" name="valorInicial" value={formData.valorInicial} onChange={handleChange} />
          </FormControl>
          <FormControl id="taxaJuros">
            <FormLabel>Taxa de Juros (%)</FormLabel>
            <Input type="number" name="taxaJuros" value={formData.taxaJuros} onChange={handleChange} />
          </FormControl>
          <FormControl id="dataVencimento">
            <FormLabel>Data de Vencimento</FormLabel>
            <Input type="date" name="dataVencimento" value={formData.dataVencimento} onChange={handleChange} />
          </FormControl>
          <FormControl id="observacoes">
            <FormLabel>Observações</FormLabel>
            <Textarea name="observacoes" value={formData.observacoes} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue">Atualizar Dívida</Button>
        </VStack>
      </form>
    </Box>
  );
}

export default EditDivida;

