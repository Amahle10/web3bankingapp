// app/(tabs)/transact.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const TransactScreen: React.FC = () => {
  const [mode, setMode] = useState<'Pay' | 'Receive' | 'Deposit'>('Pay');
  const [amount, setAmount] = useState<string>('');
  const [recipientHash, setRecipientHash] = useState<string>('');
  const [hash, setHash] = useState<string>('ABC123XYZ'); // User wallet hash

  const handleSend = () => {
    if (!amount || !recipientHash) {
      Alert.alert('Error', 'Please enter both amount and recipient hash.');
      return;
    }
    Alert.alert('Success', `Sent R${amount} to ${recipientHash}`);
  };

  const handleDeposit = () => {
    if (!amount) {
      Alert.alert('Error', 'Enter amount to deposit.');
      return;
    }
    Alert.alert('Success', `R${amount} deposit successful.`);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(hash);
    Alert.alert('Copied!', 'Your wallet hash has been copied.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Header */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to your Wallet</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeContainer}>
        {['Pay', 'Receive', 'Deposit'].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.modeButton, mode === m && styles.activeMode]}
            onPress={() => setMode(m as 'Pay' | 'Receive' | 'Deposit')}
          >
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
            keyboardType="numeric"
            placeholder="0.00"
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
        </View>
      )}

      {/* DEPOSIT MODE */}
      {mode === 'Deposit' && (
        <View style={styles.card}>
          <Text style={styles.label}>Deposit Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={[styles.actionButton, { marginTop: 20 }]}
            onPress={handleDeposit}
          >
            <Text style={styles.actionText}>Deposit Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* QR / Hash Display */}
      {mode !== 'Deposit' && (
        <View style={styles.card}>
          <Text style={styles.label}>
            {mode === 'Pay' ? 'Scan QR to Pay' : 'Your QR / Hash'}
          </Text>

          <View style={styles.qrBox}>
            {mode === 'Receive' ? (
              <>
                <QRCode value={hash} size={160} />
                <TouchableOpacity onPress={copyHash}>
                  <Text style={styles.hashText}>{hash}</Text>
                  <Text style={styles.copyText}>(Tap to copy)</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.infoText}>Scan recipient QR</Text>
            )}
          </View>
        </View>
      )}

      {/* ACTION BUTTONS */}
      <View style={styles.buttonContainer}>
        {mode === 'Pay' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Scan QR Code</Text>
          </TouchableOpacity>
        )}

        {mode === 'Pay' && (
          <TouchableOpacity
            style={styles.actionButtonOutline}
            onPress={handleSend}
          >
            <Text style={styles.actionTextOutline}>Pay by Hash</Text>
          </TouchableOpacity>
        )}

        {mode === 'Receive' && (
          <TouchableOpacity
            style={styles.actionButtonOutline}
            onPress={copyHash}
          >
            <Text style={styles.actionTextOutline}>Copy Hash / Show QR</Text>
          </TouchableOpacity>
        )}

        {mode === 'Deposit' && (
          <TouchableOpacity
            style={styles.actionButtonOutline}
            onPress={handleDeposit}
          >
            <Text style={styles.actionTextOutline}>Confirm Deposit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F3D3E', padding: 20 },
  welcomeContainer: { marginBottom: 20, alignItems: 'center' },
  welcomeText: { fontSize: 22, fontWeight: '700', color: '#00FFD5' },
  modeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    backgroundColor: '#1F7C7A',
  },
  activeMode: { backgroundColor: '#00FFD5' },
  modeText: { fontSize: 16, color: '#E0E0E0', fontWeight: '600' },
  activeModeText: { color: '#0F3D3E' },
  card: {
    backgroundColor: '#1F7C7A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  label: { fontSize: 16, fontWeight: '600', color: '#E0E0E0', marginBottom: 12 },
  input: {
    backgroundColor: '#E5E5E5',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#0F3D3E',
  },
  qrBox: { alignItems: 'center', justifyContent: 'center', marginTop: 10, paddingVertical: 15 },
  hashText: { marginTop: 12, fontSize: 14, fontWeight: '700', color: '#E0E0E0', textAlign: 'center' },
  copyText: { fontSize: 12, color: '#A0A0A0', textAlign: 'center' },
  infoText: { fontSize: 14, color: '#A0A0A0', fontWeight: '500' },
  buttonContainer: { marginTop: 10, gap: 15 },
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
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionTextOutline: { color: '#00FFD5', fontSize: 16, fontWeight: '600' },
});

export default TransactScreen;
