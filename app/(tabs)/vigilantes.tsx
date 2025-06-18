import React from 'react';
import { View,ScrollView} from 'react-native';

import FuncionariosScreen from "../../components/listaFuncionarios/FuncionariosScreen.js";


export default function Vigilantes() {
  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Você pode adicionar outros componentes aqui, se necessário */}
      <FuncionariosScreen/>
      </View>
    </ScrollView>
  );
}