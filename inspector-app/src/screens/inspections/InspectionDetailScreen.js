import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function InspectionDetailScreen({ route, navigation }) {
  const { inspection } = route.params;
  const [checklist, setChecklist] = useState(inspection.checklist);
  const [evidences, setEvidences] = useState(inspection.evidences || []);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleApprove = () => {
    Alert.alert('Inspection Approved', 'The inspection report has been securely hashed and submitted to the nodal officer.');
    navigation.goBack();
  };

  // When returning from Camera Screen, it will pass the photo back.
  // Using React Navigation's `addListener('focus')` or passing a callback.
  // For simplicity in this mock, we assume navigating to camera.

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{inspection.businessName}</Text>
        <Text style={styles.subtitle}>{inspection.id} • {inspection.type}</Text>
        <Text style={styles.address}><Ionicons name="location" /> {inspection.address}</Text>
      </View>

      <Text style={styles.sectionTitle}>Verification Checklist</Text>
      <View style={styles.card}>
        {checklist.map(item => (
          <TouchableOpacity key={item.id} style={styles.checkItem} onPress={() => toggleCheck(item.id)}>
            <Ionicons name={item.checked ? "checkbox" : "square-outline"} size={24} color={item.checked ? COLORS.green : COLORS.slate} />
            <Text style={[styles.checkText, item.checked && styles.checkedText]}>{item.task}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Evidence Collection</Text>
      <View style={styles.evidenceContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CameraScreen', { 
            onPhotoTaken: (photo) => setEvidences([...evidences, photo]) 
          })}
        >
          <Ionicons name="camera" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Capture Photo (Geotagged)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.navy }]}>
          <Ionicons name="document-text" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Scan Document</Text>
        </TouchableOpacity>
      </View>

      {evidences.length > 0 && (
        <View style={styles.photosGrid}>
          {evidences.map((ev, idx) => (
            <View key={idx} style={styles.photoWrapper}>
              <Image source={{ uri: ev.uri }} style={styles.photo} />
              <View style={styles.geoOverlay}>
                <Text style={styles.geoText}>{ev.lat?.toFixed(4)}, {ev.lng?.toFixed(4)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: COLORS.rust }]} onPress={() => Alert.alert('Rejected')}>
          <Text style={styles.submitText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: COLORS.green }]} onPress={handleApprove}>
          <Text style={styles.submitText}>Approve & Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.ink },
  subtitle: { fontSize: 14, color: COLORS.slate, marginTop: 4 },
  address: { fontSize: 14, color: COLORS.saffron, marginTop: 8, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.ink, marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 10, padding: 15, elevation: 1 },
  checkItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkText: { fontSize: 15, color: COLORS.ink, marginLeft: 10, flex: 1 },
  checkedText: { textDecorationLine: 'line-through', color: COLORS.slate },
  evidenceContainer: { marginHorizontal: 20, gap: 10 },
  actionButton: { backgroundColor: COLORS.saffron, padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  actionText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 20, marginTop: 15 },
  photoWrapper: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  photo: { width: '100%', height: '100%' },
  geoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 4 },
  geoText: { color: COLORS.white, fontSize: 10, textAlign: 'center' },
  footer: { flexDirection: 'row', padding: 20, gap: 15, marginTop: 20 },
  submitBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' }
});
