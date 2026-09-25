import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function CameraScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      if (route.params?.onPhotoTaken) {
        route.params.onPhotoTaken({
          uri: photo.uri,
          lat: location?.coords.latitude,
          lng: location?.coords.longitude,
          timestamp: new Date().toISOString()
        });
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.geoOverlay}>
            <Ionicons name="location" size={16} color={COLORS.saffron} />
            <Text style={styles.geoText}>
              {location 
                ? `LAT: ${location.coords.latitude.toFixed(5)} | LNG: ${location.coords.longitude.toFixed(5)}`
                : 'Acquiring location...'}
            </Text>
          </View>
          
          <Text style={styles.timeOverlay}>{new Date().toLocaleString()}</Text>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: COLORS.ink },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between', padding: 20 },
  backBtn: { marginTop: 30, alignSelf: 'flex-start', padding: 10 },
  geoOverlay: { position: 'absolute', top: 80, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5 },
  geoText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' },
  timeOverlay: { position: 'absolute', top: 115, left: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 5, color: COLORS.white, fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' },
  controls: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.saffron },
  btn: { backgroundColor: COLORS.saffron, padding: 15, borderRadius: 10, alignSelf: 'center' },
  btnText: { color: COLORS.white, fontWeight: 'bold' }
});
