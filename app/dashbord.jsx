import React, { useState, useRef, useEffect } from 'react';

import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP

// Importa os componentes necessários do React Native
// View para contêineres, Text para textos, FlatList para listas roláveis,
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Importa o Ionicons do Expo Vector Icons para ícones
// Neste caso, estamos usando ícones de camisa e pessoas
// para representar uniformes e vigilantes, respectivamente
import { Ionicons } from '@expo/vector-icons';

// Importa o hook useNavigation do React Navigation
// para permitir a navegação entre telas
import { useNavigation } from '@react-navigation/native'; // Importa hook navigation

// Obtém a largura da tela do dispositivo
// para definir o tamanho do carrossel
const { width } = Dimensions.get('window');

const imagem1 = require('../assets/imagens/jes.png');
const imagem2 = require('../assets/imagens/jescopy.png');
const imagem3 = require('../assets/imagens/jescopy2.png');
// Cria um array de imagens para o carrossel
// As imagens são importadas de um diretório local
// Você pode substituir por suas próprias imagens
// Certifique-se de que as imagens estão no diretório correto
// e que os caminhos estão corretos
const imagens = [imagem1, imagem2, imagem3];

function Dashboard() {

  // Estado para controlar o índice atual do carrossel
  // e referência para o FlatList
  const [indexAtual, setIndexAtual] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation(); // Hook para navegação
  const [quantidadeVigilantes, setQuantidadeVigilantes] = useState(0);
  const [quantidadeEquipamentos, setQuantidadeEquipamentos] = useState(0);

  // Efeito para carregar a quantidade de equipamentos
  const API_URL_EQUIPAMENTOS = 'https://api-jesseguranca.onrender.com/equipamentos';

  const carregarEquipamentos = async () => {
    try {
      const response = await axios.get(API_URL_EQUIPAMENTOS);
      setQuantidadeEquipamentos(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
    } finally {
      carregarEquipamentos(); // Chama a função para carregar os equipamentos
    }
  };

  // Efeito para carregar a quantidade de vigilantes
  const API_URL_VIGILANTES = 'https://api-jesseguranca.onrender.com/funcionarios';

  const carregarVigilantes = async () => {
    try {
      const response = await axios.get(API_URL_VIGILANTES);
      setQuantidadeVigilantes(response.data.length);
    } catch (error) {
      console.error('Erro ao buscar vigilantes:', error);
    } finally {
      carregarVigilantes(); // Chama a função para carregar os vigilantes
    }
  };

  // Função para lidar com o scroll do FlatList
  // Atualiza o índice atual com base na posição do scroll
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndexAtual(index);
  };
    
  // Efeito para auto-scroll do carrossel a cada 4 segundos
  // Atualiza o índice atual e faz o FlatList rolar para o próximo item
  // Reseta para o primeiro item quando chega ao final
  useEffect(() => {
    const intervalo = setInterval(() => {
      let proximoIndex = indexAtual + 1;
      if (proximoIndex >= imagens.length) {
        proximoIndex = 0;
      }
      // Rola o FlatList para o próximo índice
      // O método scrollToIndex é usado para rolar para o índice especificado
      // O parâmetro animated define se a rolagem deve ser suave ou instantânea
      flatListRef.current?.scrollToIndex({ index: proximoIndex, animated: true });
      setIndexAtual(proximoIndex);
    }, 10000); // 10 segundos

    // Limpa o intervalo quando o componente é desmontado
    // para evitar vazamentos de memória
    return () => clearInterval(intervalo);
  }, [indexAtual]);

  return (
    <View style={{ flex: 1 }}>
      {/* Carrossel de imagens */}
      {/* FlatList é usado para criar um carrossel horizontal de imagens */}
      {/* O onScroll é usado para capturar o evento de rolagem e atualizar o índice atual */}
      {/* O pagingEnabled permite que o FlatList role uma página por vez */}
      {/* O showsHorizontalScrollIndicator desativa o indicador de rolagem horizontal */}
      <FlatList
        ref={flatListRef}
        data={imagens}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ImageBackground source={item} style={styles.imagemFundo} />
        )}
      />

      {/* Cards fixos sobre o carrossel */}
      <View style={styles.overlay}>

        {/* Card para Uniformes */}
        {/* Exibe a quantidade de uniformes e um ícone */}
        {/* Ao clicar, navega para a tela de uniformes */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('equipamentos')} // nome da tela dos equipamentos
        >
          <Ionicons name="shirt" size={40} color="#fff" />
          <Text style={styles.valor}>{quantidadeEquipamentos}</Text>
          <Text style={styles.label}>Equipamentos</Text>

        </TouchableOpacity>

        <TouchableOpacity
         
         style={styles.card}
          onPress={() => navigation.navigate('vigilantes')} // nome da tela dos vigilantes
        >
          <Ionicons name="people" size={40} color="#fff" />
          <Text style={styles.valor}>{quantidadeVigilantes}</Text>
          <Text style={styles.label}>Vigilantes</Text>

        </TouchableOpacity>

      </View>

      {/* Dots indicativos */}
      <View style={styles.dots}>
        {imagens.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === indexAtual ? '#fff' : '#888' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagemFundo: {
    width: width,
    height: '93%',
  },
  overlay: {
    position: 'absolute',
    bottom: 300,
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.86)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBlockColor: '#fff',
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 3,
  },
  card: {
    alignItems: 'center',
  },
  valor: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    color: '#ccc',
    fontSize: 16,
  },
  dots: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Dashboard;
