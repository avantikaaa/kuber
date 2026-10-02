import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Menu,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import { EmailAccountManager } from '../components/EmailAccountManager';
import { useSnackbar } from '@utils/useSnackbar';

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'GBP', label: 'GBP (£)' },
];

const TABS = [
  { value: 'profile', label: 'Profile' },
  { value: 'preferences', label: 'Preferences' },
  { value: 'email', label: 'Email' },
  { value: 'account', label: 'Account' },
];

export const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const snackbar = useSnackbar();
  const [tab, setTab] = useState('profile');
  const [currencyMenuVisible, setCurrencyMenuVisible] = useState(false);

  const [profileData, setProfileData] = useState({
    username: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
  });

  const [settings, setSettings] = useState({
    theme: 'system',
    currency: 'USD',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // TODO: Implement profile update in Phase 1
    console.log('Save profile (not implemented yet)', profileData);
    snackbar.show({ title: 'Info', description: 'Profile update will be implemented in Phase 1', status: 'info' });
    setIsLoading(false);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // TODO: Implement settings update in Phase 1
    console.log('Save settings (not implemented yet)', settings);
    snackbar.show({ title: 'Info', description: 'Settings update will be implemented in Phase 1', status: 'info' });
    setIsLoading(false);
  };

  const selectedCurrencyLabel = CURRENCIES.find((c) => c.value === settings.currency)?.label;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">Profile & Settings</Text>

      <SegmentedButtons value={tab} onValueChange={setTab} buttons={TABS} />

      {tab === 'profile' && (
        <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={styles.panelHeading}>
            Profile Information
          </Text>
          <View style={styles.formGap}>
            <TextInput
              label="Username"
              value={profileData.username}
              onChangeText={(v) => setProfileData((prev) => ({ ...prev, username: v }))}
            />
            <TextInput label="Email (Read-only)" value={profileData.email} disabled />
            <TextInput label="Phone (Read-only)" value={profileData.phone} disabled />
            <Button mode="contained" onPress={handleSaveProfile} loading={isLoading} disabled={isLoading}>
              Save Profile
            </Button>
          </View>
        </View>
      )}

      {tab === 'preferences' && (
        <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={styles.panelHeading}>
            Preferences
          </Text>
          <View style={styles.formGap}>
            <SegmentedButtons
              value={settings.theme}
              onValueChange={(v) => setSettings((prev) => ({ ...prev, theme: v }))}
              buttons={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]}
            />
            <Menu
              visible={currencyMenuVisible}
              onDismiss={() => setCurrencyMenuVisible(false)}
              anchor={
                <TextInput
                  label="Default Currency"
                  value={selectedCurrencyLabel || ''}
                  editable={false}
                  right={<TextInput.Icon icon="menu-down" onPress={() => setCurrencyMenuVisible(true)} />}
                  onPressIn={() => setCurrencyMenuVisible(true)}
                />
              }
            >
              {CURRENCIES.map((c) => (
                <Menu.Item
                  key={c.value}
                  title={c.label}
                  onPress={() => {
                    setSettings((prev) => ({ ...prev, currency: c.value }));
                    setCurrencyMenuVisible(false);
                  }}
                />
              ))}
            </Menu>
            <Button mode="contained" onPress={handleSaveSettings} loading={isLoading} disabled={isLoading}>
              Save Settings
            </Button>
          </View>
        </View>
      )}

      {tab === 'email' && <EmailAccountManager />}

      {tab === 'account' && (
        <View style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
          <Text variant="titleMedium" style={styles.panelHeading}>
            Account
          </Text>
          <View style={styles.formGap}>
            <Button mode="outlined">Change Password</Button>
            <Button mode="outlined" textColor="#E65100">
              Export Data
            </Button>
            <Button mode="outlined" textColor="#D32F2F">
              Sign Out
            </Button>
          </View>
        </View>
      )}

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Note: Full profile & settings functionality will be implemented in Phase 1. Email
          accounts placeholder showing Phase 3 UI.
        </Text>
      </View>

      <Snackbar {...snackbar.snackbarProps}>{snackbar.message}</Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  panel: {
    padding: 24,
    borderRadius: 12,
  },
  panelHeading: {
    marginBottom: 24,
    fontWeight: 'bold',
  },
  formGap: {
    gap: 16,
  },
  noteBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFECB3',
  },
  noteText: {
    color: '#856404',
    fontSize: 13,
  },
});

export default ProfilePage;
