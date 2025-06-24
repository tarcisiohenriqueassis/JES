  
import React from 'react';
import { View, Text, ActivityIndicator,StyleSheet } from 'react-native';

export default function Carregando() {
  // Componente de carregamento para ser usado enquanto os dados estão sendo buscados
  // Exibe um indicador de carregamento e uma mensagem
  return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Carregando funcionários...</Text>
      </View>
    );

}


const styles = StyleSheet.create({

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
