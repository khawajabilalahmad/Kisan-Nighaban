import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Send, Bot, User } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { sendChatMessage } from '../services/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I am your AI Climate Assistant. How can I help you protect your crops today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), text: inputText.trim(), sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage.text);
      const aiMessage = { 
        id: (Date.now() + 1).toString(), 
        text: response.reply || "I'm sorry, I couldn't understand that.", 
        sender: 'ai', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { 
        id: (Date.now() + 1).toString(), 
        text: "Sorry, I am having trouble connecting to my brain right now.", 
        sender: 'ai', 
        timestamp: new Date(),
        isError: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
        {!isUser && (
          <View style={styles.avatarAI}>
            <Bot size={16} color="white" />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAI, item.isError && styles.messageBubbleError]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAI]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        {loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>AI is typing...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about weather, crops, or pests..."
            placeholderTextColor={theme.colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardView: { flex: 1 },
  chatContent: { padding: theme.spacing.md, paddingBottom: 20 },
  
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAI: { justifyContent: 'flex-start' },
  
  avatarAI: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 8, marginBottom: 4,
  },
  
  messageBubble: {
    maxWidth: '80%', padding: 12, borderRadius: 16,
  },
  messageBubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleAI: {
    backgroundColor: theme.colors.surfaceSolid,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: theme.colors.borderLight,
  },
  messageBubbleError: {
    backgroundColor: theme.colors.dangerBg,
    borderColor: theme.colors.dangerBorder,
  },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTextUser: { color: 'white' },
  messageTextAI: { color: theme.colors.text },
  
  loadingIndicator: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.sm,
  },
  loadingText: { marginLeft: 8, fontSize: 13, color: theme.colors.textMuted },
  
  inputContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1, borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSolid,
    borderWidth: 1, borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12,
    minHeight: 48, maxHeight: 120,
    fontSize: 16, color: theme.colors.text,
  },
  sendButton: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  }
});
