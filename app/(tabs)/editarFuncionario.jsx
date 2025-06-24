import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function EditarFuncionario() {

  const { id, nome, cpf } = useLocalSearchParams();
  const [novoNome, setNovoNome] = useState(nome);
  const [novoCpf, setNovoCpf] = useState(cpf);
  const router = useRouter();

  const salvarEdicao = async () => {
    try {
      await axios.put(`https://api-jesseguranca.onrender.com/${id}`, {
        nome: novoNome,
        cpf: novoCpf,
      });

      Alert.alert('Sucesso', 'Funcionário atualizado!');
      router.back(); // volta para tela anterior
    } catch (_error) {
      Alert.alert('Erro', 'Não foi possível atualizar');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Editar Funcionário</Text>

      <TextInput
        placeholder="Nome"
        value={novoNome}
        onChangeText={setNovoNome}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="CPF"
        value={novoCpf}
        onChangeText={setNovoCpf}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Salvar Alterações" onPress={salvarEdicao} />
    </View>
  );
}
