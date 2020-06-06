import React, { useLayoutEffect, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  Button,
} from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

// Use https://developer.github.com/v4/explorer/
// to quickly figure out queries.
const REPOS = gql`
  {
    organization(login: "cyberstefantv") {
      repositories(first: 20) {
        nodes {
          id
          name
          nameWithOwner
          url
        }
      }
    }
  }
`;

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export const HomeScreen = ({ navigation }) => {
  const [fetchRepos, { called, loading, error, data }] = useLazyQuery(REPOS);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => {
            fetchRepos();
          }}
          title="Reload"
        />
      ),
    });
  }, [navigation, fetchRepos]);

  if (!called || loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data.organization.repositories.nodes}
          renderItem={({ item }) => <Item title={item.name} />}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
