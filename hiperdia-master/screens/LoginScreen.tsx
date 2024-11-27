import { API_BASE_URL } from '@env';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Paciente'); // Estado para selecionar Médico ou Paciente

  const handleLogin = async () => {
    try {
      setLoading(true); // Ativar o indicador de carregamento
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, doctor: selectedRole === 'Médico' ? 1 : 0 }),
      });

      if (response.status === 200) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.token); // Salva o token no AsyncStorage
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Erro', 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Erro ao realizar login.');
    } finally {
      setLoading(false); // Desativar o indicador de carregamento
    }
  };

  const handleRegister = () => {
    navigation.navigate('SignUpScreen', { role: selectedRole }); // Navega para a tela de cadastro e passa a role selecionada
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar como {selectedRole.toLowerCase()}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.registerText}>Não tem uma conta? Registre-se como {selectedRole.toLowerCase()}</Text>
      </TouchableOpacity>

      <View style={styles.roleSelectionContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'Médico' && styles.selectedRoleButton,
          ]}
          onPress={() => setSelectedRole('Médico')}
        >
          <Text
            style={[
              styles.roleButtonText,
              selectedRole === 'Médico' && styles.selectedRoleButtonText,
            ]}
          >
            MÉDICO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'Paciente' && styles.selectedRoleButton,
          ]}
          onPress={() => setSelectedRole('Paciente')}
        >
          <Text
            style={[
              styles.roleButtonText,
              selectedRole === 'Paciente' && styles.selectedRoleButtonText,
            ]}
          >
            PACIENTE
          </Text>
        </TouchableOpacity>
      </View>
{
//       <Text style={styles.selectedRoleText}>
//         Login como: {selectedRole}
//       </Text>
    }
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  registerText: {
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: 10,
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderColor: '#1E90FF',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  selectedRoleButton: {
    backgroundColor: '#1E90FF',
  },
  roleButtonText: {
    color: '#1E90FF',
    fontSize: 16,
  },
  selectedRoleButtonText: {
    color: '#fff', // Texto branco quando o botão é selecionado
  },
  selectedRoleText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1E90FF',
    marginTop: 20,
  },
});
