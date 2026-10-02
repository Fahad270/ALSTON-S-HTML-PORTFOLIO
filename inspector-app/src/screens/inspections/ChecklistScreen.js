import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../theme/colors';

export default function ChecklistScreen({ route, navigation }) {
  const { inspection, checkInTime } = route.params;
  const [checklist, setChecklist] = useState(inspection.checklist);
  const [evidences, setEvidences] = useState(inspection.evidences || []);

  const setCompliance = (id, value) => {
    Haptics.selectionAsync();
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, compliance: value } : item));
  };

  const allAnswered = checklist.every(item => item.compliance !== null);
  const compliantCount = checklist.filter(i => i.compliance === 'compliant').length;
  const nonCompliantCount = checklist.filter(i => i.compliance === 'non_compliant').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Progress Header */}
      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Checklist Progress</Text>
          <Text style={styles.progressCount}>{checklist.filter(i => i.compliance !== null).length}/{checklist.length}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${(checklist.filter(i => i.compliance !== null).length / checklist.length) * 100}%`
          }]} />
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.green} />
            <Text style={[styles.summaryText, { color: COLORS.green }]}>{compliantCount} Compliant</Text>
          </View>
          <View style={styles.summaryChip}>
            <Ionicons name="close-circle" size={14} color={COLORS.rust} />
            <Text style={[styles.summaryText, { color: COLORS.rust }]}>{nonCompliantCount} Non-Compliant</Text>
          </View>
        </View>
      </View>

      {/* Checklist Items */}
      {checklist.map((item, idx) => (
        <View key={item.id} style={[
          styles.checkCard,
          item.compliance === 'compliant' && styles.checkCardGreen,
          item.compliance === 'non_compliant' && styles.checkCardRed,
        ]}>
          <View style={styles.checkHeader}>
            <View style={styles.checkNum}>
              <Text style={styles.checkNumText}>{idx + 1}</Text>
            </View>
            <Text style={styles.checkTask}>{item.task}</Text>
          </View>

          {/* Compliance Buttons */}
          <View style={styles.complianceBtns}>
            <TouchableOpacity
              style={[styles.compBtn, item.compliance === 'compliant' && styles.compBtnGreen]}
              onPress={() => setCompliance(item.id, 'compliant')}
            >
              <Ionicons name="checkmark" size={18} color={item.compliance === 'compliant' ? COLORS.white : COLORS.green} />
              <Text style={[styles.compBtnText, item.compliance === 'compliant' && { color: COLORS.white }]}>Compliant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.compBtn, item.compliance === 'non_compliant' && styles.compBtnRed]}
              onPress={() => setCompliance(item.id, 'non_compliant')}
            >
              <Ionicons name="close" size={18} color={item.compliance === 'non_compliant' ? COLORS.white : COLORS.rust} />
              <Text style={[styles.compBtnText, item.compliance === 'non_compliant' && { color: COLORS.white }]}>Non-Compliant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.compBtn, item.compliance === 'na' && styles.compBtnGray]}
              onPress={() => setCompliance(item.id, 'na')}
            >
              <Text style={[styles.compBtnText, item.compliance === 'na' && { color: COLORS.white }]}>N/A</Text>
            </TouchableOpacity>
          </View>

          {/* Photo evidence button per item */}
          <TouchableOpacity
            style={styles.photoBtn}
            onPress={() => navigation.navigate('CameraScreen', {
              onPhotoTaken: (photo) => setEvidences(prev => [...prev, { ...photo, checklistId: item.id, caption: item.task }])
            })}
          >
            <Ionicons name="camera-outline" size={16} color={COLORS.saffron} />
            <Text style={styles.photoBtnText}>Add Photo Evidence</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.nextBtn, !allAnswered && styles.btnDisabled]}
        disabled={!allAnswered}
        onPress={() => navigation.navigate('ObservationsScreen', {
          inspection, checkInTime, checklist, evidences
        })}
      >
        <Text style={styles.nextBtnText}>Save & Continue to Observations</Text>
        <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  progressCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 14, fontWeight: '600', color: COLORS.ink },
  progressCount: { fontSize: 14, fontWeight: 'bold', color: COLORS.saffron },
  progressBar: { height: 6, backgroundColor: COLORS.line, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.saffron, borderRadius: 3 },
  summaryRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  summaryChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryText: { fontSize: 13, fontWeight: '600' },
  checkCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 1, borderWidth: 1.5, borderColor: COLORS.line },
  checkCardGreen: { borderColor: COLORS.green, backgroundColor: '#12880708' },
  checkCardRed: { borderColor: COLORS.rust, backgroundColor: '#B4342A08' },
  checkHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  checkNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.ink, justifyContent: 'center', alignItems: 'center' },
  checkNumText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  checkTask: { fontSize: 15, color: COLORS.ink, flex: 1, lineHeight: 22 },
  complianceBtns: { flexDirection: 'row', gap: 8 },
  compBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 10, borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.line },
  compBtnGreen: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  compBtnRed: { backgroundColor: COLORS.rust, borderColor: COLORS.rust },
  compBtnGray: { backgroundColor: COLORS.slate, borderColor: COLORS.slate },
  compBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.slate },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.line },
  photoBtnText: { fontSize: 13, color: COLORS.saffron, fontWeight: '600' },
  nextBtn: { backgroundColor: COLORS.ink, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 },
  btnDisabled: { opacity: 0.4 },
  nextBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
