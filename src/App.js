import 'react-native-gesture-handler';
import React from 'react';
import { Button, Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { HomeScreen } from './HomeScreen';

const Stack = createStackNavigator();

let token = '';

const client = new ApolloClient({
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
  uri: 'https://api.github.com/graphql',
});

const showSetTokenAlert = () => {
  Alert.prompt(
    'Set Token',
    'Enter a GitHub API token so that you can use the app.',
    (text) => {
      token = text;
    },
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerLeft: () => (
                <Button onPress={showSetTokenAlert} title="Set Token" />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
