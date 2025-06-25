import React, { useEffect, useState } from 'react';
// Importa os componentes necessários do React Native
// Importa o React e hooks necessários
// Importa componentes do React Native para construir a interface
import {
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Platform
} from 'react-native';

// Importa o ícone Ionicons do Expo para usar ícones
import { Ionicons } from '@expo/vector-icons';

// Importa o Expo Clipboard para copiar dados para a área de transferência
import * as Clipboard from 'expo-clipboard';

// Importa a biblioteca axios para fazer requisições HTTP
import axios from 'axios';

// Importa a função para formatar CPF
import formatarCpf from '../../utils/formataCPF';

// Importa o router do expo-router para navegação
import { router } from 'expo-router';

// Importa o componente de carregamento
import Carregando from '../../utils/carregando';

// Importa a função para formatar nomes
import formatarNome from '../../utils/formataNome';

export default function FuncionariosScreen() {

  // Define os estados necessários para o componente
  const [funcionarios, setFuncionarios] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [busca, setBusca] = useState('');
  
  // Define a função buscarFuncionarios fora do useEffect para que possa ser usada em outros lugares
  const buscarFuncionarios = async () => {
    try {

      setCarregando(true);

      // Faz uma requisição GET para a API para buscar a lista de funcionários
      // A URL da API é 'https://api-jesseguranca.onrender.com/'
      // Você pode substituir por sua própria URL de API se necessário
      const response = await axios.get('https://api-jesseguranca.onrender.com/');

      // Ordena a lista de funcionários pelo nome
      // Usando localeCompare para garantir a ordenação correta em português
      const listaOrdenada = response.data.sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
      );
      setFuncionarios(listaOrdenada);
    } 
    catch (_error) {
      Alert.alert('Erro ao carregar funcionários');
    }
     finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarFuncionarios();
  }, []);

  const alternarSelecao = (cpf) => {
    // Alterna a seleção de um funcionário com base no CPF
    // Se o CPF já estiver selecionado, remove-o da lista
    // Caso contrário, adiciona o CPF à lista de selecionados
    setSelecionados((prev) =>
      // Verifica se o CPF já está selecionado
      prev.includes(cpf) ? prev.filter((item) => item !== cpf) : [...prev, cpf]
    );
  };
 
  // Função para copiar os funcionários selecionados
  // Filtra os funcionários selecionados e formata os dados para copiar
  // Exibe um alerta se não houver funcionários selecionados
  // Caso contrário, copia os dados formatados para a área de transferência
  const copiarSelecionados = async () => {

    const dados = funcionarios

      // Filtra os funcionários selecionados
      .filter((f) => selecionados.includes(f.cpf))

      // Formata os dados para copiar
      .map((f) => `NOME: ${f.nome}\nCPF: ${formatarCpf(f.cpf)}\n`)
      .join('\n');

    // Verifica se há funcionários selecionados
    // Se não houver, exibe um alerta
    // Caso contrário, copia os dados formatados para a área de transferência
    if (dados.trim().length === 0) {
      Alert.alert('Nenhum funcionário selecionado.');
      return;
    }
    // Copia os dados formatados para a área de transferência
    await Clipboard.setStringAsync(dados);
    Alert.alert('Copiado!', 'Funcionários copiados com CPF formatado.');
    setMenuVisivel(false);
  };

  const selecionarTodos = () => {
    if (selecionados.length === funcionarios.length) {
      setSelecionados([]);
    } else {
      const cpfs = funcionarios.map((f) => f.cpf);
      setSelecionados(cpfs);
    }
    setMenuVisivel(false);
  };
  // Filtra os funcionários com base na busca
  // Verifica se o nome ou CPF contém a string de busca
  // Converte ambos para minúsculas para comparação case-insensitive
  const funcionariosFiltrados = funcionarios.filter((f) =>
  f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cpf.includes(busca)
);
  // Renderiza o componente
  // Se estiver carregando, exibe o componente de carregamento
  // Caso contrário, renderiza a lista de funcionários
  if (carregando) {
    return <Carregando />;
  }
  return (

    <View style={{ width: '100%', height: '100%' }}>
      {/* Título fixo no topo da tela */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de Funcionários</Text>
       <TextInput
      placeholder="Buscar por Nome ou CPF"
      placeholderTextColor="#999"
      style={styles.inputBusca}
      value={busca}
      onChangeText={setBusca}
       />
      </View>
      {/* Lista */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          data={funcionariosFiltrados}
        keyExtractor={(item) => item.cpf.toString()}
        renderItem={({ item }) => {
          const selecionado = selecionados.includes(item.cpf);

          return (
            <Pressable 
              onPress={() => alternarSelecao(item.cpf)}
              style={styles.card}
            >
              <View style={[styles.checkbox, { backgroundColor: selecionado ? '#007AFF' : '#FFF' }]}>
                {selecionado && <Text style={styles.checkmark}><Ionicons name="checkmark" size={18} color="#FFF" /></Text>}
              </View>

              <View style={{ maxWidth: '85%' }}>
                
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16 }}>
                  Nome: {formatarNome(item.nome)}
                </Text>

                <Text style={{ fontSize: 14, color: '#666' }}>Cpf: {item.cpf}</Text>

                  <TouchableOpacity onPress={() => router.push({ pathname: '../editarFuncionario',
                   params: { id: item.id, nome: item.nome, cpf: item.cpf } })} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="pencil-sharp" size={20} color="#000" />
                
                  <Text style={{paddingTop: 15}} />
                  <Text style={{ marginLeft: 3, fontSize: 15 }}>Editar </Text>
                
                  </TouchableOpacity>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Botão flutuante fixo no canto inferior direito */}
      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => setMenuVisivel(!menuVisivel)}
      >
        <Text style={{ color: 'Black',fontWeight:'bold', fontSize: 40 }}> {menuVisivel === true ? <Ionicons name="close" style={{ fontSize: 40 }} /> :<Ionicons name="ellipsis-vertical-circle" style={{ fontSize: 40 }} /> }</Text>
      </TouchableOpacity>

      {/* Menu Modal flutuante */}
      <Modal transparent={true} visible={menuVisivel} animationType={Platform.OS === 'ios' ? 'fade' : 'none'}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setMenuVisivel(false)}
          activeOpacity={1}
        >
          <View style={styles.menuFlutuante}>
            <Button
              title={selecionados.length === funcionarios.length ? 'Limpar Seleção' : 'Selecionar Todos'}
              onPress={selecionarTodos}
            />
            <View style={{ height: 12 }} />
            <Button title="Copiar selecionados" onPress={copiarSelecionados} />
            
            <View style={{ height: 12 }} />
            <Button title="Atualizar lista" onPress={() => buscarFuncionarios(Alert.alert('Lista atualizada!'), setMenuVisivel(false))} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Estilos separados para clareza
const styles = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 27,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 4,
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 420 : 690, // Ajusta a posição para iOS e Android
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
    shadowColor: 'transparent',
  },
  menuFlutuante: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 270 : 510, // Ajusta a posição para iOS e Android
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 6,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inputBusca: {
  marginTop: 10,
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  backgroundColor: '#fff',
  fontSize: 16,
}

});
