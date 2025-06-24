import React from 'react';

import { View, Text, Image, Dimensions } from 'react-native';

// Importando o Ionicons do expo-vector-icons
import {Ionicons} from '@expo/vector-icons';

// Importando o componente Tabs do expo-router
import { Tabs } from 'expo-router';

// pegando a largura da tela do dispositivo
const { width} = Dimensions.get('window');

export default function Layout() {
    return (
        <>
        {/* Definindo o estilo do TabBar  */}
        <Tabs screenOptions={{
            tabBarStyle:{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            backgroundColor: 'transparent',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
            elevation: 2,
            paddingBottom: 5,
        
        },
        tabBarLabelStyle: {
            fontSize: width * 0.020,
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
        tabBarActiveBackgroundColor:'#007fFF',
        tabBarInactiveBackgroundColor: '#fff',
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        }} >
        <Tabs.Screen

            name="index"
            options={{ title: 'Inicio',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={30} color={color}  />,

                headerTitleAlign:'center',

                headerTitle:()=>(
                    <View style={{flex:1,flexDirection: 'row', alignItems: 'center', height:35, justifyContent: 'center'}}>
                   <Image source={ require("../../assets/imagens/jes.png")} style={{width:35, height:35, resizeMode:"contain"} } />
                   <Text style={{ fontSize:(width * 0.050),fontWeight: 'bold' }}>
                    JES Segurança LTDA
                   </Text>
                   </View>
                )
            }}
            />
            
            <Tabs.Screen
                name="vigilantes"
                options={{ title: 'vigilantes', tabBarIcon: ({ color }) => <Ionicons name="person" size={30} color={color} />,
                headerTitleAlign: 'center',
                headerTitleStyle: {fontSize:(width * 0.049),fontWeight: 'bold', textTransform:'uppercase'},}}
               
            />
            
            <Tabs.Screen
                name="cadastrarVigilante"
                options={{ title:'cadastrar', tabBarIcon: ({ color }) => <Ionicons name="person-add" size={30} color={color}/>,
                headerTitleAlign: 'center',
                headerTitleStyle: {fontSize:(width * 0.050),fontWeight: 'bold',textTransform: 'uppercase' },}} 
                
            />

            <Tabs.Screen
                name="uniformes"
                options={{ title:'Uniformes', tabBarIcon: ({ color }) => <Ionicons name="shirt" size={30} color={color}/>,
                headerTitleAlign: 'center',
                headerTitleStyle: {fontSize:(width * 0.050),fontWeight: 'bold',textTransform: 'uppercase' },}} 
                
            />

        </Tabs>
        </>
    );
}