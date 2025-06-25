import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function UniformesScreen() {
  const [uniformes, setUniformes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://seu-servidor.com/uniformes'; // substitua pelo seu backend real

  // Carrega os dados da API
  const carregarUniformes = async () => {
    try {
      const response = await axios.get(API_URL);
      setUniformes(response.data);
    } catch (error) {
      console.error('Erro ao buscar uniformes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Envia alteração (+ ou -) para a API
  const alterarQuantidade = async (id, tipo) => {
    try {
      await axios.post(`${API_URL}/${id}/${tipo}`);
      carregarUniformes(); // Atualiza os dados após a modificação
    } catch (error) {
      console.error(`Erro ao ${tipo} quantidade:`, error);
    }
  };

  useEffect(() => {
    carregarUniformes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name={item.icon} size={30} color="#444" />
      <Text style={styles.nome}>{item.nome}</Text>
      <View style={styles.controles}>
        <TouchableOpacity onPress={() => alterarQuantidade(item.id, 'remove')}>
          <Ionicons name="remove-circle" size={30} color="#e74c3c" />
        </TouchableOpacity>

        <Text style={styles.quantidade}>{item.quantidade}</Text>

        <TouchableOpacity onPress={() => alterarQuantidade(item.id, 'add')}>
          <Ionicons name="add-circle" size={30} color="#2ecc71" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Controle de Uniformes</Text>
      <FlatList
        data={uniformes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#f9f9f9' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  nome: { fontSize: 18, marginTop: 8, marginBottom: 12 },
  controles: { flexDirection: 'row', alignItems: 'center' },
  quantidade: { fontSize: 20, fontWeight: 'bold', minWidth: 30, textAlign: 'center', marginHorizontal: 10 },
});
