// app/(tabs)/AIChatbotScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

const GEMINI_API_KEY = 'AIzaSyDoyfyvcavQ60HEzKipVE9HALI8_C7GyHk'; // replace with your key

const AIChatbotScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [listening, setListening] = useState(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Voice recognition setup
  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value?.[0]) setInput(event.value[0]);
    };
    Voice.onSpeechError = (e) => console.error('Voice error', e);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const toggleListening = async () => {
    try {
      if (!listening) {
        setListening(true);
        await Voice.start('en-US');
      } else {
        setListening(false);
        await Voice.stop();
      }
    } catch (err) {
      console.error(err);
      setListening(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://api.gemini.ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      const data = await response.json();

      if (!data.reply) {
        throw new Error('No reply from Gemini AI');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to get AI response');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.aiText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />

        <TouchableOpacity style={styles.micButton} onPress={toggleListening}>
          <Text style={{ color: '#fff' }}>{listening ? '🎙️' : '🎤'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 6,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
  micButton: {
    marginLeft: 10,
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AIChatbotScreen;
