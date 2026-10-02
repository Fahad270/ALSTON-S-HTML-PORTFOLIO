import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../theme/colors';

export default function ObservationsScreen({ route, navigation }) {
  const { inspection, checkInTime, checklist, evidences: initialEvidences } = route.params;
  const [observations, setObservations] = useState('');
  const [overallCompliance, setOverallCompliance] = useState(null);
  const [evidences, setEvidences] = useState(initialEvidences || []);

  const nonCompliantItems = checklist.filter(i => i.compliance === 'non_compliant');
  const compliantItems = checklist.filter(i => i.compliance === 'compliant');

  const selectCompliance = (val) => {
    Haptics.selectionAsync();
    setOverallCompliance(val);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Checklist Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionLabel}>Checklist Summary</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { borderColor: COLORS.green }]}>
            <Text style={[styles.summaryCount, { color: COLORS.green }]}>{compliantItems.length}</Text>
            <Text style={styles.summaryBoxLabel}>Compliant</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: COLORS.rust }]}>
            <Text style={[styles.summaryCount, { color: COLORS.rust }]}>{nonCompliantItems.length}</Text>
            <Text style={styles.summaryBoxLabel}>Non-Compliant</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: COLORS.slate }]}>
            <Text style={[styles.summaryCount, { color: COLORS.slate }]}>
              {checklist.filter(i => i.compliance === 'na').length}
            </Text>
            <Text style={styles.summaryBoxLabel}>N/A</Text>
          </View>
        </View>

        {nonCompliantItems.length > 0 && (
          <View style={styles.issuesBox}>
            <Text style={styles.issuesTitle}><Ionicons name="warning" /> Issues Found:</Text>
            {nonCompliantItems.map(item => (
              <View key={item.id} style={styles.issueRow}>
                <Ionicons name="ellipse" size={8} color={COLORS.rust} />
                <Text style={styles.issueText}>{item.task}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Field Observations Text */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Field Observations</Text>
        <Text style={styles.helpText}>
          Describe your on-site findings. This will be included verbatim in the official visit report submitted to the Sub Regional Officer.
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={6}
          placeholder="e.g., The premises were found in general compliance with fire safety norms. However, fire extinguishers in Zone B were found expired. Emergency exit on the north side was partially blocked by storage..."
          placeholderTextColor={COLORS.line}
          value={observations}
          onChangeText={setObservations}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{observations.length} chars</Text>
      </View>

      {/* Site Evidence Photos */}
      <View style={styles.card}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>Site Evidence Photos</Text>
          <TouchableOpacity
            style={styles.addPhotoBtn}
            onPress={() => navigation.navigate('CameraScreen', {
              onPhotoTaken: (photo) => setEvidences(prev => [...prev, photo])
            })}
          >
            <Ionicons name="camera" size={16} color={COLORS.white} />
            <Text style={styles.addPhotoBtnText}>Add Photo</Text>
          </TouchableOpacity>
        </View>

        {evidences.length === 0 ? (
          <View style={styles.emptyPhotos}>
            <Ionicons name="images-outline" size={40} color={COLORS.line} />
            <Text style={styles.emptyPhotosText}>No photos captured yet</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.photoRow}>
              {evidences.map((ev, idx) => (
                <View key={idx} style={styles.photoCard}>
                  <Image source={{ uri: ev.uri }} style={styles.photo} />
                  <View style={styles.geoOverlay}>
                    <Text style={styles.geoText}>
                      {ev.lat ? `${ev.lat.toFixed(4)}, ${ev.lng.toFixed(4)}` : 'No GPS'}
                    </Text>
                  </View>
                  {ev.timestamp && (
                    <Text style={styles.photoTime}>
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Overall Compliance Decision */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Overall Compliance Assessment</Text>
        <Text style={styles.helpText}>
          Your assessment will be sent to the department for final decision.
        </Text>
        <View style={styles.complianceOptions}>
          {[
            { key: 'compliant', label: 'Fully Compliant', icon: 'checkmark-circle', color: COLORS.green },
            { key: 'partial', label: 'Partially Compliant', icon: 'alert-circle', color: COLORS.saffron },
            { key: 'non_compliant', label: 'Non-Compliant', icon: 'close-circle', color: COLORS.rust },
          ].map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.complianceOpt, overallCompliance === opt.key && { borderColor: opt.color, backgroundColor: `${opt.color}10` }]}
              onPress={() => selectCompliance(opt.key)}
            >
              <Ionicons name={opt.icon} size={26} color={overallCompliance === opt.key ? opt.color : COLORS.line} />
              <Text style={[styles.complianceOptText, overallCompliance === opt.key && { color: opt.color }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.nextBtn, (!observations.trim() || !overallCompliance) && styles.btnDisabled]}
        disabled={!observations.trim() || !overallCompliance}
        onPress={() => navigation.navigate('ReportScreen', {
          inspection, checkInTime, checklist, evidences, observations, overallCompliance
        })}
      >
        <Text style={styles.nextBtnText}>Preview & Submit Report</Text>
        <Ionicons name="document-text" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  summaryCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  helpText: { fontSize: 13, color: COLORS.slate, lineHeight: 20, marginBottom: 12, marginTop: -8 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryBox: { flex: 1, borderWidth: 1.5, borderRadius: 10, padding: 12, alignItems: 'center' },
  summaryCount: { fontSize: 28, fontWeight: 'bold' },
  summaryBoxLabel: { fontSize: 12, color: COLORS.slate, marginTop: 4, fontWeight: '500' },
  issuesBox: { marginTop: 14, backgroundColor: '#B4342A08', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#B4342A30' },
  issuesTitle: { fontSize: 13, fontWeight: '700', color: COLORS.rust, marginBottom: 8 },
  issueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  issueText: { fontSize: 13, color: COLORS.ink, flex: 1 },
  textArea: { borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 10, padding: 14, fontSize: 14, color: COLORS.ink, minHeight: 140, lineHeight: 22 },
  charCount: { fontSize: 12, color: COLORS.slate, textAlign: 'right', marginTop: 6 },
  addPhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.saffron, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  addPhotoBtnText: { color: COLORS.white, fontSize: 13, fontWeight: 'bold' },
  emptyPhotos: { height: 100, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyPhotosText: { color: COLORS.slate, fontSize: 14 },
  photoRow: { flexDirection: 'row', gap: 10 },
  photoCard: { width: 120, position: 'relative' },
  photo: { width: 120, height: 120, borderRadius: 8 },
  geoOverlay: { position: 'absolute', bottom: 22, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.65)', padding: 4 },
  geoText: { color: COLORS.white, fontSize: 9, textAlign: 'center', fontFamily: 'monospace' },
  photoTime: { fontSize: 11, color: COLORS.slate, textAlign: 'center', marginTop: 4 },
  complianceOptions: { gap: 10 },
  complianceOpt: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.line },
  complianceOptText: { fontSize: 15, fontWeight: '600', color: COLORS.slate },
  nextBtn: { backgroundColor: COLORS.ink, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 },
  btnDisabled: { opacity: 0.4 },
  nextBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
