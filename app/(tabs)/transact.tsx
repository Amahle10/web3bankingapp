// app/(tabs)/transact.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const TransactScreen: React.FC = () => {
  const [mode, setMode] = useState<'Pay' | 'Receive' | 'Deposit'>('Pay');
  const [amount, setAmount] = useState<string>('');
  const [recipientHash, setRecipientHash] = useState<string>('');
  const [hash, setHash] = useState<string>('ABC123XYZ');

  const handleSend = () => {
    if (!amount || !recipientHash) {
      Alert.alert('Error', 'Enter both amount and recipient hash.');
      return;
    }
    Alert.alert('Success', `Sent R${amount} to ${recipientHash}`);
    setAmount('');
    setRecipientHash('');
  };

  const handleDeposit = () => {
    if (!amount) {
      Alert.alert('Error', 'Enter deposit amount.');
      return;
    }
    Alert.alert('Success', `R${amount} deposited successfully.`);
    setAmount('');
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    Alert.alert('Copied!', 'Your wallet hash has been copied.');
  };

  const modeIcons = {
    Pay: <Ionicons name="card" size={28} color={mode === 'Pay' ? '#0F3D3E' : '#E0E0E0'} />,
    Receive: <MaterialIcons name="qr-code" size={28} color={mode === 'Receive' ? '#0F3D3E' : '#E0E0E0'} />,
    Deposit: <FontAwesome5 name="coins" size={28} color={mode === 'Deposit' ? '#0F3D3E' : '#E0E0E0'} />,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Top spacing (golden ratio feel) */}
      <View style={{ height: '18%' }} />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Transact</Text>
        <Text style={styles.subtitleText}>Pay, Receive, or Deposit funds easily</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeContainer}>
        {(['Pay', 'Receive', 'Deposit'] as const).map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeButton, mode === m && styles.activeMode]}
            onPress={() => setMode(m)}
          >
            {modeIcons[m]}
            <Text style={[styles.modeText, mode === m && styles.activeModeText]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PAY MODE */}
      {mode === 'Pay' && (
        <View style={styles.card}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Recipient Hash / Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipient hash"
            value={recipientHash}
            onChangeText={setRecipientHash}
          />

          <TouchableOpacity
            style={[styles.actionButton, { marginTop: 20 }]}
            onPress={handleSend}
          >
            <Text style={styles.actionText}>Confirm & Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButtonOutline, { marginTop: 10 }]}>
            <Text style={styles.actionTextOutline}>
              <Ionicons name="qr-code" size={16} color="#00FFD5" /> Scan QR Code
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DEPOSIT MODE */}
      {mode === 'Deposit' && (
        <View style={styles.card}>
          <Text style={styles.label}>Deposit Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={[styles.actionButton, { marginTop: 20 }]} onPress={handleDeposit}>
            <Text style={styles.actionText}>Deposit Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* RECEIVE MODE */}
      {mode === 'Receive' && (
        <View style={styles.card}>
          <Text style={styles.label}>Your QR / Wallet Hash</Text>
          <View style={styles.qrBox}>
            <QRCode value={hash} size={160} />
            <TouchableOpacity onPress={copyHash}>
              <Text style={styles.hashText}>{hash}</Text>
              <Text style={styles.copyText}>(Tap to copy)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3D3E', paddingHorizontal: 20 },
  titleContainer: { marginBottom: 30 },
  titleText: { fontSize: 28, fontWeight: '700', color: '#00FFD5' },
  subtitleText: { fontSize: 16, color: '#E0E0E0', marginTop: 6 },

  modeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  modeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#1F7C7A',
  },
  activeMode: { backgroundColor: '#00FFD5' },
  modeText: { fontSize: 14, color: '#E0E0E0', marginTop: 4 },
  activeModeText: { color: '#0F3D3E', fontWeight: '700' },

  card: {
    backgroundColor: '#1F7C7A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontSize: 16, fontWeight: '600', color: '#E0E0E0', marginBottom: 12 },
  input: {
    backgroundColor: '#E5E5E5',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#0F3D3E',
  },

  qrBox: { alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingVertical: 15 },
  hashText: { marginTop: 12, fontSize: 14, fontWeight: '700', color: '#E0E0E0', textAlign: 'center' },
  copyText: { fontSize: 12, color: '#A0A0A0', textAlign: 'center' },

  actionButton: {
    backgroundColor: '#00FFD5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionText: { color: '#0F3D3E', fontSize: 16, fontWeight: '600' },

  actionButtonOutline: {
    borderWidth: 2,
    borderColor: '#00FFD5',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionTextOutline: { color: '#00FFD5', fontSize: 14, fontWeight: '600' },
});

export default TransactScreen;
