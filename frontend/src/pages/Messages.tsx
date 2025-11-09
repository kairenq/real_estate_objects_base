import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, List, ListItem, ListItemText, Typography, Box, TextField, IconButton, CircularProgress, Badge, Divider } from '@mui/material';
import { Send, Chat } from '@mui/icons-material';
import { messagesAPI } from '../services/api';
import type { Conversation, Message } from '../types';
import { useAuth } from '../context/AuthContext';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000); // обновление каждые 5 сек
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id);
    }
  }, [selectedConv]);

  const loadConversations = async () => {
    try {
      const convs = await messagesAPI.getConversations();
      setConversations(convs);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setLoading(false);
    }
  };

  const loadMessages = async (convId: number) => {
    try {
      const msgs = await messagesAPI.getMessages(convId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSend = async () => {
    if (!selectedConv || !newMessage.trim()) return;

    try {
      await messagesAPI.sendMessage({
        conversation_id: selectedConv.id,
        content: newMessage,
      });
      setNewMessage('');
      loadMessages(selectedConv.id);
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
        Сообщения
      </Typography>

      {conversations.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Chat sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            Нет активных диалогов
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2} sx={{ height: 'calc(100vh - 250px)' }}>
          {/* Список диалогов */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '100%', overflow: 'auto' }}>
              <List>
                {conversations.map((conv) => (
                  <React.Fragment key={conv.id}>
                    <ListItem
                      button
                      selected={selectedConv?.id === conv.id}
                      onClick={() => setSelectedConv(conv)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {conv.real_estate_title}
                            </Typography>
                            {conv.unread_count! > 0 && (
                              <Badge badgeContent={conv.unread_count} color="error" />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {user?.id === conv.buyer_id ? conv.seller_username : conv.buyer_username}
                            </Typography>
                            {conv.last_message && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {conv.last_message}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Чат */}
          <Grid item xs={12} md={8}>
            {selectedConv ? (
              <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6">{selectedConv.real_estate_title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.id === selectedConv.buyer_id ? selectedConv.seller_username : selectedConv.buyer_username}
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          justifyContent: isOwn ? 'flex-end' : 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: '70%',
                            bgcolor: isOwn ? 'primary.main' : 'grey.200',
                            color: isOwn ? 'white' : 'text.primary',
                          }}
                        >
                          <Typography variant="body2">{msg.content}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                            {new Date(msg.created_at).toLocaleString('ru-RU')}
                          </Typography>
                        </Paper>
                      </Box>
                    );
                  })}
                </Box>

                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <IconButton color="primary" onClick={handleSend}>
                    <Send />
                  </IconButton>
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Выберите диалог
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Messages;
