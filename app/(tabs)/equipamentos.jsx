import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome6, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function EquipamentosScreen() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://api-jesseguranca.onrender.com/equipamentos';

  const carregarEquipamentos = async () => {
    try {
      const response = await axios.get(API_URL);
      setEquipamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const alterarQuantidade = async (id, tipo) => {
    try {
      await axios.post(`${API_URL}/${id}/${tipo}`);
      carregarEquipamentos();
    } catch (error) {
      console.error(`Erro ao ${tipo} quantidade:`, error);
    }
  };

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  // 🎯 Dicionário de ícones por nome e biblioteca
  const getIcon = (nome) => {
    const key = (nome || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove acentos

    switch (key) {
      case 'capacete':
        return { lib: FontAwesome6, name: 'helmet-un' };
      case 'bone':
        return { lib: MaterialCommunityIcons, name: 'hat-fedora' };
      case 'gandola':
      case 'camisa':
        return { lib: FontAwesome5, name: 'tshirt' };
      case 'calca':
        return { lib: Ionicons, name: 'walk-outline' };
      case 'coturno':
        return { lib: FontAwesome5, name: 'shoe-prints' };
      case 'tonfa':
        return { lib: Ionicons, name: 'alert' };
      case 'cinto tatico':
      case 'cinto':
        return { lib: MaterialCommunityIcons, name: 'belt' };
      case 'radio':
        return { lib: MaterialCommunityIcons, name: 'radio-handheld' };
      default:
        return { lib: Ionicons, name: 'cube-outline' };
    }
  };

  const renderItem = ({ item }) => {
    const icon = getIcon(item.nome);
    const IconComponent = icon.lib;

    return (
      <View style={styles.card}>
        <IconComponent name={icon.name} size={30} color="#444" />
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
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 60 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Controle de Uniformes</Text>

      {equipamentos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum equipamento encontrado.</Text>
      ) : (
        <FlatList
          data={equipamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#f9f9f9' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  vazio: { textAlign: 'center', fontSize: 16, color: '#999', marginTop: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  nome: { fontSize: 18, marginTop: 8, marginBottom: 12, textTransform: 'capitalize', color: '#333' },
  controles: { flexDirection: 'row', alignItems: 'center' },
  quantidade: { fontSize: 20, fontWeight: 'bold', minWidth: 30, textAlign: 'center', marginHorizontal: 10 },
});
