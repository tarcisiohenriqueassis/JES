import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import axios from 'axios';

export default function FuncionariosScreen() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [menuVisivel, setMenuVisivel] = useState(false);

  useEffect(() => {
    const buscarFuncionarios = async () => {
      try {
        const response = await axios.get('https://api-jesseguranca.onrender.com');
        const listaOrdenada = response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
        );
        setFuncionarios(listaOrdenada);
      } catch (error) {
        Alert.alert('Erro ao carregar funcionários');
      } finally {
        setCarregando(false);
      }
    };

    buscarFuncionarios();
  }, []);

  const alternarSelecao = (cpf) => {
    setSelecionados((prev) =>
      prev.includes(cpf) ? prev.filter((item) => item !== cpf) : [...prev, cpf]
    );
  };

  const formatarCpf = (cpf) => {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const copiarSelecionados = async () => {
    const dados = funcionarios
      .filter((f) => selecionados.includes(f.cpf))
      .map((f) => `NOME: ${f.nome}\nCPF: ${formatarCpf(f.cpf)}\n`)
      .join('\n');

    if (dados.trim().length === 0) {
      Alert.alert('Nenhum funcionário selecionado.');
      return;
    }

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

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Carregando funcionários...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Título fixo no topo da tela */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de Funcionários</Text>
      </View>

      {/* Lista */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        data={funcionarios}
        keyExtractor={(item) => item.cpf.toString()}
        renderItem={({ item }) => {
          const selecionado = selecionados.includes(item.cpf);

          return (
            <Pressable
              onPress={() => alternarSelecao(item.cpf)}
              style={styles.card}
            >
              <View style={[styles.checkbox, { backgroundColor: selecionado ? '#007AFF' : '#FFF' }]}>
                {selecionado && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <View style={{ maxWidth: '85%' }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 16 }}>
                  Nome: {item.nome}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Cpf: {item.cpf}</Text>
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
        <Text style={{ color: 'Black',fontWeight:'bold', fontSize: 40 }}>⋮</Text>
      </TouchableOpacity>

      {/* Menu Modal flutuante */}
      <Modal transparent={true} visible={menuVisivel} animationType="fade">
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
            <View style={{ height: 10 }} />
            <Button title="Copiar selecionados" onPress={copiarSelecionados} />
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
    bottom: 690,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
  },
  menuFlutuante: {
    position: 'absolute',
    bottom: 323,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
