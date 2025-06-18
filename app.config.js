export default {
  expo: {
    // Nome do aplicativo (exibido no dispositivo)
    name: "JES",

    // Slug do projeto (usado em builds e em links do Expo)
    slug: "JES",

    // Versão exibida na loja (Android/iOS)
    version: "1.0.0",

    // Orientação da tela (portrait = vertical)
    orientation: "portrait",

    // Caminho para o ícone do app
    icon: "./assets/imagens/jes.png",

    // Deep linking scheme personalizado (ex: jes://rota)
    scheme: "jes",

    // Estilo da interface do usuário (claro, escuro ou automático)
    userInterfaceStyle: "automatic",

    // Tela de carregamento (splash screen) ao abrir o app
    splash: {
      image: "./assets/imagens/jes.png", // Imagem exibida na splash
      resizeMode: "contain",             // Ajusta a imagem dentro da tela
      backgroundColor: "#ffffff",        // Cor de fundo da splash
    },

    // Ativa a nova arquitetura do React Native (TurboModules + Fabric)
    newArchEnabled: true,

    // Configurações específicas para iOS
    ios: {
      supportsTablet: true,                       // Suporte a iPads
      bundleIdentifier: "com.jes.seguranca",      // Identificador único para o app iOS
      buildNumber: "1.0.0",                        // Número da build para App Store
    },

    // Configurações específicas para Android
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/imagens/jes.png", // Ícone adaptável (imagem da frente)
        backgroundColor: "#ffffff",                  // Cor de fundo do ícone
      },
      package: "com.jes.seguranca",  // Nome do pacote Android (sem acento)
      versionCode: 1,                // Código incremental para identificar builds na Play Store
      edgeToEdgeEnabled: true,       // Habilita o layout em tela cheia (ocultando barra superior/inferior)
    },

    // Configurações para versão web do app
    web: {
      bundler: "metro",                         // Empacotador utilizado (metro = padrão Expo)
      output: "static",                         // Tipo de saída web (páginas estáticas)
      favicon: "./assets/images/favicon.png",   // Ícone exibido na aba do navegador
    },

    // Plugins adicionais usados no projeto
    plugins: [
      "expo-router", // Roteamento baseado em arquivos
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png", // Splash alternativo usado por plugin
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],

    // Ativa recursos experimentais do Expo Router
    experiments: {
      typedRoutes: true, // Ativa suporte a rotas com tipagem TypeScript
    },
    extra: {
  eas: {
    projectId: "6f442fe7-1082-4418-9fd7-b98ee6a08c52"
  }
}
  },
};
