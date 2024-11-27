import { API_BASE_URL } from '@env';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text'; // Importando o TextInputMask

import axios from 'axios';

export default function SignUpScreen({ navigation }) {
  const route = useRoute();
  const { role } = route.params || {}; // Obtém 'role' das props de navegação
  const [selectedRole, setSelectedRole] = useState(role || "Paciente");

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const [riskFactors, setRiskFactors] = useState('');
  const [medications, setMedications] = useState('');
  const [crm, setCrm] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (role) {
        setSelectedRole(role); // Define o valor recebido ao carregar a tela
      }
  }, [role]);

  const handleSignUp = async () => {
    // Validações básicas

    if(selectedRole === 'Paciente'){
        if (email === '' || name === '' || age === '' || gender === '' || phone === '' || address === '' || uf === '' || cep === '' || riskFactors === '' || medications === '' || password === '' || confirmPassword === '') {
              Alert.alert('Erro', 'Por favor, preencha todos os campos.');
              return;
        }
    } else if(selectedRole === 'Médico'){
        if (email === '' || name === '' || age === '' || gender === '' || phone === '' || address === '' || uf === '' || cep === '' || crm === '' || password === '' || confirmPassword === '') {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

     let userData = {
        name,
        email,
        password,
        age,
        gender,
        phone,
        address,
        uf,
        cep,
        doctor: selectedRole === 'Médico' ? 1 : 0,
      };

      if (selectedRole === 'Paciente') {
        userData = { ...userData, riskFactors, medications };
      } else if (selectedRole === 'Médico') {
        userData = { ...userData, crm };
      }

    console.log('Dados enviados:', userData); // Log dos dados enviados

      try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);

            console.log('Resposta da API:', response); // Log da resposta da API

        if (response.status === 201) {
          Alert.alert('Sucesso', response.data.message);
          navigation.navigate('LoginScreen');
        } else {
          Alert.alert('Erro', 'Houve um problema ao registrar.');
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Não foi possível conectar ao servidor.';
        Alert.alert('Erro', message);
      } finally {
        setLoading(false);
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar-se</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

     <TextInput
             style={styles.input}
             placeholder="Idade"
             keyboardType="numeric"
             value={age}
             onChangeText={setAge}
           />

     <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Selecione o sexo" color="#666666" value="" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Feminino" value="Feminino" />
              </Picker>
      </View>

      <TextInputMask
              style={styles.input}
              type={'cel-phone'}
              options={{
                maskType: 'BRL',  // Máscara para celular do Brasil
                withDDD: true,     // Inclui o DDD no número
                dddMask: '(99) '
              }}
              placeholder="Celular"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="UF"
        value={uf}
        onChangeText={setUf}
      />

      <TextInputMask
              style={styles.input}
              type={'zip-code'}  // Máscara de CEP
              placeholder="CEP"
              value={cep}
              onChangeText={setCep}
              keyboardType="numeric"
            />

            {selectedRole === 'Paciente' && (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Fatores de risco"
                        value={riskFactors}
                        onChangeText={setRiskFactors}
                      />

                      <TextInput
                        style={styles.input}
                        placeholder="Remédios de uso contínuo"
                        value={medications}
                        onChangeText={setMedications}
                      />
                    </>
            )}

        {selectedRole === 'Médico' && (
            <TextInput // Apenas médico
                          style={styles.input}
                          placeholder="CRM"
                          value={crm}
                          onChangeText={setCrm}
                        />
        )}

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

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.loginText}>Já tem uma conta? Faça Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  loginText: {
    color: '#1E90FF',
    textAlign: 'center',
    marginTop: 10,
  },
   pickerContainer: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 15,
      borderRadius: 5,
      justifyContent: 'center',
    }
});
