import { API_BASE_URL } from '@env';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      Alert.alert('Sucesso', response.data.message);
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao solicitar redefinição de senha.');
    }
  };

  return (
    <View>
      <Text>Digite seu e-mail para redefinir a senha:</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Redefinir Senha" onPress={handleSubmit} />
    </View>
  );
};

export default ForgotPassword;
