import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  Badge,
  Portal,
  Dialog,
  TextInput,
  Menu,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { format } from 'date-fns';
import { useSnackbar } from '@utils/useSnackbar';

interface EmailAccount {
  id: number;
  email_address: string;
  provider: string;
  is_active: boolean;
  last_synced_at?: string;
  created_at: string;
}

const PROVIDERS = [
  { value: 'gmail', label: 'Gmail (Google Account)' },
  { value: 'outlook', label: 'Outlook / Microsoft' },
  { value: 'icloud', label: 'iCloud Mail' },
];

export const EmailAccountManager: React.FC = () => {
  const snackbar = useSnackbar();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [newAccount, setNewAccount] = useState({
    email_address: '',
    provider: 'gmail',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // TODO: Use actual API call when connected
      // const response = await apiClient.getEmailAccounts();
      // setAccounts(response.data);
      setAccounts([]);
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to load email accounts', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.email_address) {
      snackbar.show({ title: 'Error', description: 'Please enter an email address', status: 'error' });
      return;
    }

    try {
      // TODO: Implement OAuth flow for actual email provider
      snackbar.show({
        title: 'Info',
        description: `OAuth flow for ${newAccount.provider} not yet implemented. This will be added in Phase 3.`,
        status: 'info',
        duration: 5000,
      });

      setNewAccount({ email_address: '', provider: 'gmail' });
      setDialogVisible(false);
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to add email account', status: 'error' });
    }
  };

  const handleRemoveAccount = async (id: number) => {
    try {
      // TODO: Call API when connected
      // await apiClient.removeEmailAccount(id);
      setAccounts(accounts.filter((a) => a.id !== id));
      snackbar.show({ title: 'Success', description: 'Email account removed', status: 'success', duration: 2000 });
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to remove email account', status: 'error' });
    }
  };

  const handleSyncAccount = async (id: number) => {
    try {
      setSyncing(id);
      // TODO: Call API when connected
      // await apiClient.syncEmailAccount(id);
      snackbar.show({ title: 'Info', description: 'Email sync not yet implemented. Will be added in Phase 3.', status: 'info' });
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to sync emails', status: 'error' });
    } finally {
      setSyncing(null);
    }
  };

  const selectedProviderLabel = PROVIDERS.find((p) => p.value === newAccount.provider)?.label;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text variant="titleMedium">Connected Email Accounts</Text>
        <Button mode="contained" onPress={() => setDialogVisible(true)}>
          + Add Account
        </Button>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : accounts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.muted}>No email accounts connected yet</Text>
          <Button mode="contained" onPress={() => setDialogVisible(true)}>
            Connect Your Email
          </Button>
        </View>
      ) : (
        accounts.map((account) => (
          <View key={account.id} style={styles.accountRow}>
            <View style={styles.headerRow}>
              <View style={{ gap: 4 }}>
                <View style={styles.inlineRow}>
                  <Text style={{ fontWeight: 'bold' }}>{account.email_address}</Text>
                  {account.is_active && <Badge style={styles.activeBadge}>Active</Badge>}
                </View>
                <Text style={styles.mutedSmall}>Provider: {account.provider.toUpperCase()}</Text>
                {account.last_synced_at && (
                  <Text style={styles.mutedSmall}>
                    Last synced: {format(new Date(account.last_synced_at), 'MMM dd, yyyy HH:mm')}
                  </Text>
                )}
              </View>

              <View style={styles.inlineRow}>
                <Button
                  mode="outlined"
                  compact
                  onPress={() => handleSyncAccount(account.id)}
                  loading={syncing === account.id}
                >
                  Sync
                </Button>
                <Button mode="text" textColor="#D32F2F" compact onPress={() => handleRemoveAccount(account.id)}>
                  Remove
                </Button>
              </View>
            </View>
          </View>
        ))
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Connect Email Account</Dialog.Title>
          <Dialog.Content>
            <View style={{ gap: 16 }}>
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>
                  Note: OAuth2 authentication will be implemented in Phase 3. Currently showing UI
                  placeholder.
                </Text>
              </View>

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TextInput
                    label="Email Provider"
                    value={selectedProviderLabel || ''}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" onPress={() => setMenuVisible(true)} />}
                    onPressIn={() => setMenuVisible(true)}
                  />
                }
              >
                {PROVIDERS.map((p) => (
                  <Menu.Item
                    key={p.value}
                    title={p.label}
                    onPress={() => {
                      setNewAccount({ ...newAccount, provider: p.value });
                      setMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              <TextInput
                label="Email Address"
                placeholder="your.email@gmail.com"
                value={newAccount.email_address}
                onChangeText={(v) => setNewAccount({ ...newAccount, email_address: v })}
              />

              <View style={styles.warnBox}>
                <Text style={styles.warnText}>
                  Click "Connect" to open your email provider's login. We'll never store your
                  password.
                </Text>
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddAccount}>Connect Account</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar {...snackbar.snackbarProps}>{snackbar.message}</Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  center: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
  },
  accountRow: {
    padding: 16,
    borderRadius: 12,
  },
  muted: {
    color: '#888',
  },
  mutedSmall: {
    color: '#888',
    fontSize: 12,
  },
  activeBadge: {
    backgroundColor: '#2E7D32',
  },
  noteBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
  },
  noteText: {
    color: '#0D47A1',
    fontSize: 13,
  },
  warnBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF8E1',
  },
  warnText: {
    color: '#856404',
    fontSize: 11,
  },
});
