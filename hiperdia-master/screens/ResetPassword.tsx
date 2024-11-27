import { API_BASE_URL } from '@env';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const route = useRoute();
  const { token } = route.params;  // Token JWT vindo do link de redefinição

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password/${token}`, { password });
      Alert.alert('Sucesso', response.data.message);
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao redefinir senha.');
    }
  };

  return (
    <View>
      <Text>Digite sua nova senha:</Text>
      <TextInput
        placeholder="Nova Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Redefinir Senha" onPress={handleSubmit} />
    </View>
  );
};

export default ResetPassword;
