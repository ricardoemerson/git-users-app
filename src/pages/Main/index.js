import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container, Form, Input, SubmitButton, List, User, Avatar, Name, Bio, ProfileButton, ProfileButtonText,
} from './styles';
import api from '../../services/api';


export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const users = await AsyncStorage.getItem('users');

      if (users) {
        setUsers(JSON.parse(users));
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    async function saveUsers() {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }

    saveUsers();
  }, [users]);

  async function handleSubmit() {
    setLoading(true);

    const response = await api.get(`/users/${ newUser }`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setLoading(false);
    setNewUser('');

    Keyboard.dismiss();
  }

  function handleNavigate(user) {
    navigation.navigate('User', { user });
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={ false }
          autoCapitalize="none"
          placeholder="Adicionar Usuário"
          value={ newUser }
          onChangeText={ text => setNewUser(text) }
          returnKeyType="send"
          onSubmitEditing={ handleSubmit }
        />
        <SubmitButton loading={ loading } onPress={ handleSubmit }>
          { loading
            ? <ActivityIndicator color="#fff" />
            : <Icon name="add" size={ 20 } color="#fff" /> }
        </SubmitButton>
      </Form>

      <List
        data={ users }
        keyExtractor={ user => user.login }
        renderItem={ ({ item }) => (
          <User>
            <Avatar source={ { uri: item.avatar } } />
            <Name>{ item.name }</Name>
            <Bio>{ item.bio }</Bio>

            <ProfileButton onPress={ () => handleNavigate(item) }>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        ) }
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Git Users',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
