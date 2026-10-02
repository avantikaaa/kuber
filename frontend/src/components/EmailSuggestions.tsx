import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  Card,
  ActivityIndicator,
  Portal,
  Dialog,
  Menu,
  TextInput,
  Snackbar,
} from 'react-native-paper';
import { useCategories } from '@hooks/useCategories';
import { useSnackbar } from '@utils/useSnackbar';
import type { Category } from '../types';

interface EmailSuggestion {
  id: number;
  email_id: string;
  email_subject: string;
  email_body: string;
  created_at: string;
}

export const EmailSuggestions: React.FC = () => {
  const snackbar = useSnackbar();
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailSuggestion | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [importing, setImporting] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const { data: categories = [] as Category[] } = useCategories();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      // TODO: Use actual API when connected
      // const response = await apiClient.getEmailSuggestions();
      // setSuggestions(response.data);
      setSuggestions([]);
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to load email suggestions', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (emailId: string) => {
    if (!categoryId) {
      snackbar.show({ title: 'Error', description: 'Please select a category', status: 'error' });
      return;
    }

    try {
      setImporting(true);
      // TODO: Call API when connected
      // await apiClient.createTransactionFromEmail(emailId, { categoryId: parseInt(categoryId) });

      snackbar.show({
        title: 'Info',
        description: 'Email import not yet fully implemented. Will be added in Phase 3.',
        status: 'info',
      });

      setSuggestions(suggestions.filter((s) => s.email_id !== emailId));
      setDialogVisible(false);
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to import email', status: 'error' });
    } finally {
      setImporting(false);
    }
  };

  const handleSkip = async (emailId: string) => {
    try {
      // TODO: Call API when connected
      // await apiClient.skipEmailSuggestion(emailId);
      setSuggestions(suggestions.filter((s) => s.email_id !== emailId));
      snackbar.show({ title: 'Success', description: 'Email skipped', status: 'success', duration: 2000 });
    } catch (error) {
      snackbar.show({ title: 'Error', description: 'Failed to skip email', status: 'error' });
    }
  };

  const handleQuickAdd = (email: EmailSuggestion) => {
    setSelectedEmail(email);
    setCategoryId('');
    setDialogVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (suggestions.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.muted}>No pending email imports</Text>
        <Text style={styles.mutedSmall}>
          Connect an email account and sync to see transaction suggestions
        </Text>
      </View>
    );
  }

  const selectedCategoryLabel = categories.find((c: Category) => String(c.id) === categoryId)?.name;

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Suggested from Email</Text>

      {suggestions.map((email) => (
        <Card key={email.id} style={styles.card}>
          <Card.Content>
            <Text variant="titleSmall">{email.email_subject}</Text>
            <Text numberOfLines={2} style={styles.mutedBody}>
              {email.email_body}
            </Text>
            <View style={styles.cardActions}>
              <Button mode="contained" onPress={() => handleQuickAdd(email)} compact>
                Quick Add
              </Button>
              <Button mode="outlined" onPress={() => handleSkip(email.email_id)} compact>
                Skip
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Import from Email</Dialog.Title>
          <Dialog.Content>
            {selectedEmail && (
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={styles.mutedSmallBold}>EMAIL SUBJECT</Text>
                  <Text>{selectedEmail.email_subject}</Text>
                </View>

                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TextInput
                      label="Category *"
                      value={selectedCategoryLabel || ''}
                      editable={false}
                      right={<TextInput.Icon icon="menu-down" onPress={() => setMenuVisible(true)} />}
                      onPressIn={() => setMenuVisible(true)}
                    />
                  }
                >
                  {categories.map((cat: Category) => (
                    <Menu.Item
                      key={cat.id}
                      title={cat.name}
                      onPress={() => {
                        setCategoryId(String(cat.id));
                        setMenuVisible(false);
                      }}
                    />
                  ))}
                </Menu>

                <View style={styles.noteBox}>
                  <Text style={styles.noteText}>
                    Note: Email parsing is not fully implemented yet. A basic transaction will be
                    created. Full extraction coming in Phase 3.
                  </Text>
                </View>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={() => selectedEmail && handleImport(selectedEmail.email_id)}
              loading={importing}
              disabled={importing}
            >
              Import Transaction
            </Button>
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
  card: {
    width: '100%',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
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
  },
  muted: {
    color: '#888',
    marginBottom: 8,
  },
  mutedSmall: {
    color: '#aaa',
    fontSize: 12,
  },
  mutedSmallBold: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 12,
  },
  mutedBody: {
    color: '#666',
    marginTop: 4,
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
});
