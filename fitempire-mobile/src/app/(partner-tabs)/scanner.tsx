import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { QrCode, Camera as CameraIcon, X, Zap } from 'lucide-react-native';
import { CameraView, Camera } from 'expo-camera';
import { useAuth } from '@/services/auth-context';
import { apiClient } from '@/services/api';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function PartnerScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const { user } = useAuth();
  const scheme = useColorScheme();
  const theme = useTheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (processing) return;
    setScanned(true);
    setProcessing(true);
    setCameraActive(false);

    try {
      // Hit backend API using our dynamically resolved API client
      const res = await apiClient.post('/bookings/verify-qr', {
        qrToken: data,
        gymId: user?.gymId || '00000000-0000-0000-0000-000000000000'
      });
      
      if(res.data.success || res.status === 200) {
        Alert.alert("Success!", "Member verified and checked in.", [{ text: 'OK', onPress: () => setScanned(false) }]);
      } else {
        Alert.alert("Failed", res.data.message || "Invalid or expired QR code.", [{ text: 'Try Again', onPress: () => setScanned(false) }]);
      }
    } catch (e: any) {
      console.warn(e);
      Alert.alert("Error", e.response?.data?.message || "Could not verify QR code. Please check connection.", [{ text: 'OK', onPress: () => setScanned(false) }]);
    } finally {
      setProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText themeColor="textSecondary">Requesting camera permission...</ThemedText>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText style={{ color: '#EF4444' }}>No access to camera</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {cameraActive ? (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.overlayContainer}>
            {/* Top Bar */}
            <BlurView intensity={30} tint="dark" style={[styles.topBar, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
              <View style={styles.headerRow}>
                <ThemedText style={{ color: '#FFF', fontSize: 18, fontWeight: '700' }}>Scan Member Pass</ThemedText>
                <TouchableOpacity onPress={() => setCameraActive(false)} style={styles.closeBtn}>
                  <X size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </BlurView>

            {/* Target Area */}
            <View style={styles.targetWrapper}>
              <View style={styles.targetBox}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              <ThemedText style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
                Align the QR code within the frame
              </ThemedText>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.scannerShell}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Check-in Scanner</ThemedText>
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              Scan your members' QR codes to securely verify their bookings and mark attendance.
            </ThemedText>
          </View>

          <View style={styles.illustrationContainer}>
            <LinearGradient
              colors={[colors.primary + '20', 'transparent']}
              style={styles.illustrationGlow}
            >
              <View style={[styles.qrBox, { borderColor: colors.primary }]}>
                <QrCode size={120} color={colors.primary} />
                <LinearGradient
                  colors={['transparent', colors.primary + '80', 'transparent']}
                  style={styles.scanLine}
                />
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity 
            style={[styles.activateBtn, { backgroundColor: colors.primary }]} 
            onPress={() => {
                setScanned(false);
                setCameraActive(true);
            }}
          >
            <CameraIcon size={24} color="#FFF" style={{ marginRight: 12 }} />
            <ThemedText style={styles.btnText}>Open Camera to Scan</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  scannerShell: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  header: {
    marginBottom: 40,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: { 
    fontSize: 16, 
    lineHeight: 24,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationGlow: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBox: {
    width: 160,
    height: 160,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
    top: '40%',
  },
  activateBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 20, 
    borderRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '700' 
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBox: {
    width: 260,
    height: 260,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#4F46E5',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  bottomBar: {
    padding: 40,
    paddingBottom: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
});
