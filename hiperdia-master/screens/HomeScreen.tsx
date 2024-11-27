import { API_BASE_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Ícones
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ route }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Função para buscar informações do usuário logado
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setName(data?.name); //
        } else {
          Alert.alert('Erro', 'Não foi possível carregar as informações do usuário.');
        }
      } else {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      Alert.alert('Erro', 'Erro ao buscar informações do usuário.');
    } finally {
      setLoading(false);
    }
  };


  // Função de logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove o token JWT
      navigation.navigate('LoginScreen'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
      Alert.alert('Erro', 'Erro ao realizar logout.');
    }
  };

  // Executa a busca das informações do usuário quando a tela carrega
  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
     <View style={styles.container}>
          {/* Ícone de logout no canto superior direito */}
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <MaterialIcons name="logout" size={30} color="black" />
          </TouchableOpacity>

          {/* Saudação ao usuário logado */}
          <Text style={styles.welcome}>Bem-vindo, {name}!</Text>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     justifyContent: 'center',
     padding: 20,
     backgroundColor: '#fff',
   },
   welcome: {
     fontSize: 22,
     textAlign: 'center',
     marginBottom: 30,
   },
   logoutIcon: {
     position: 'absolute',
     top: 40, // Ajuste conforme necessário
     right: 20, // Ajuste conforme necessário
   },
   loadingContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
});
