import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { QrCode, Camera as CameraIcon } from 'lucide-react-native';
import { CameraView, Camera } from 'expo-camera';
import { useAuth } from '@/services/auth-context';

export default function PartnerScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  const { user } = useAuth(); // Has the gymId

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    setCameraActive(false);

    try {
      Alert.alert("Processing", "Verifying QR Code...");
      
      // Hit backend API
      const res = await fetch('http://localhost:8080/api/v1/bookings/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrToken: data,
          gymId: user?.gymId || '00000000-0000-0000-0000-000000000000'
        })
      });
      const resData = await res.json();
      
      if(resData.success) {
        Alert.alert("Success!", "User checked in successfully.");
      } else {
        Alert.alert("Failed", resData.message || "Invalid or expired QR code.");
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Could not reach server.");
    }
  };

  if (hasPermission === null) {
    return <ThemedView style={styles.container}><ThemedText>Requesting camera permission...</ThemedText></ThemedView>;
  }
  if (hasPermission === false) {
    return <ThemedView style={styles.container}><ThemedText>No access to camera</ThemedText></ThemedView>;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Scan Check-in</ThemedText>
        <ThemedText style={styles.subtitle}>Scan member's QR code to mark attendance</ThemedText>
      </View>

      {cameraActive ? (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => setCameraActive(false)}
          >
            <ThemedText style={styles.btnText}>Cancel Scan</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scannerShell}>
          <QrCode size={100} color="#3B82F6" style={{ opacity: 0.5 }} />
          <TouchableOpacity 
            style={styles.activateBtn} 
            onPress={() => {
                setScanned(false);
                setCameraActive(true);
            }}
          >
            <CameraIcon size={20} color="#FFF" style={{ marginRight: 8 }} />
            <ThemedText style={styles.btnText}>Tap to open Camera</ThemedText>
          </TouchableOpacity>
          {scanned && (
            <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} color="#3B82F6" />
          )}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', padding: 24, paddingTop: 60 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  subtitle: { fontSize: 16, color: '#9CA3AF', marginTop: 8 },
  scannerShell: { flex: 1, backgroundColor: '#111827', borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.2)', borderStyle: 'dashed' },
  activateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginTop: 32, marginBottom: 20 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cameraContainer: { flex: 1, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end', padding: 24 },
  cancelBtn: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 }
});
