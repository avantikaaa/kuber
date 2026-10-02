import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useAppNavigation, type AppRoute } from '@utils/navigation';

export const Navigation: React.FC = () => {
  const router = useAppNavigation();
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const go = (path: AppRoute) => {
    setMenuVisible(false);
    router.push(path);
  };

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <Appbar.Content title="💰 Finance Tracker" />
      <Appbar.Action icon="home" onPress={() => go('/')} />
      <Appbar.Action icon="plus" onPress={() => go('/add-transaction')} />
      <Appbar.Action icon="format-list-bulleted" onPress={() => go('/transactions')} />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<Appbar.Action icon="account" onPress={() => setMenuVisible(true)} />}
      >
        <Menu.Item onPress={() => go('/profile')} title="Profile" />
        <Menu.Item onPress={() => go('/login')} title="Login" />
      </Menu>
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 2,
  },
});
