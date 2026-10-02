import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MOCK_INSPECTIONS } from '../../data/mockData';

const STAGE_FLOW = [
  { key: 'not_started', label: 'Officer Attendance', icon: 'person-circle-outline' },
  { key: 'checklist', label: 'Checklist', icon: 'checkbox-outline' },
  { key: 'observations', label: 'Observations', icon: 'eye-outline' },
  { key: 'report', label: 'Report', icon: 'document-text-outline' },
  { key: 'submitted', label: 'Submitted', icon: 'send' },
];

export default function InspectionDetailScreen({ route, navigation }) {
  const { inspection } = route.params;

  const getStageIndex = (stage) => {
    const map = { not_started: 0, checked_in: 0, checklist: 1, observations: 2, report: 3, submitted: 4 };
    return map[stage] ?? 0;
  };
  const currentStageIdx = getStageIndex(inspection.stage);

  const handleBegin = () => {
    if (inspection.isJoint) {
      navigation.navigate('JointInspectionScreen', { inspection });
    } else {
      navigation.navigate('CheckIn', { inspection });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Top Badge */}
      <View style={[styles.statusBanner, { backgroundColor: inspection.status === 'Completed' ? '#12880715' : '#CC6D1D15' }]}>
        <Ionicons name={inspection.status === 'Completed' ? 'checkmark-circle' : 'time'} size={20} color={inspection.status === 'Completed' ? COLORS.green : COLORS.saffron} />
        <Text style={[styles.statusBannerText, { color: inspection.status === 'Completed' ? COLORS.green : COLORS.saffron }]}>
          {inspection.status === 'Completed' ? 'Inspection Completed' : 'Awaiting Inspection'}
        </Text>
        {inspection.isJoint && (
          <View style={styles.jointTag}>
            <Ionicons name="people" size={13} color={COLORS.navy} />
            <Text style={styles.jointTagText}>Joint</Text>
          </View>
        )}
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <Text style={styles.businessName}>{inspection.businessName}</Text>
        <Text style={styles.inspType}>{inspection.type}</Text>
        <View style={styles.infoRow}><Ionicons name="business" size={14} color={COLORS.saffron} /><Text style={styles.infoText}>{inspection.department}</Text></View>
        <View style={styles.infoRow}><Ionicons name="location" size={14} color={COLORS.saffron} /><Text style={styles.infoText}>{inspection.address}</Text></View>
        <View style={styles.infoRow}><Ionicons name="calendar" size={14} color={COLORS.saffron} /><Text style={styles.infoText}>{inspection.date}</Text></View>
        {inspection.isJoint && (
          <View style={styles.deptChips}>
            {inspection.jointDepartments?.map((d, i) => (
              <View key={i} style={styles.deptChip}><Text style={styles.deptChipText}>{d}</Text></View>
            ))}
          </View>
        )}
      </View>

      {/* Workflow Pipeline */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Inspection Workflow</Text>
        <View style={styles.pipeline}>
          {STAGE_FLOW.map((stage, idx) => {
            const done = idx < currentStageIdx;
            const active = idx === currentStageIdx;
            return (
              <View key={stage.key} style={styles.pipelineStep}>
                <View style={[styles.pipeDot, done && styles.pipeDotDone, active && styles.pipeDotActive]}>
                  <Ionicons name={done ? 'checkmark' : stage.icon} size={16} color={done || active ? COLORS.white : COLORS.slate} />
                </View>
                <Text style={[styles.pipeLabel, done && styles.pipeLabelDone, active && styles.pipeLabelActive]}>{stage.label}</Text>
                {idx < STAGE_FLOW.length - 1 && <View style={[styles.pipeConnector, done && styles.pipeConnectorDone]} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* Completed Report Preview */}
      {inspection.stage === 'submitted' && (
        <View style={[styles.card, styles.reportCard]}>
          <Text style={styles.sectionLabel}>Submitted Report</Text>
          <Text style={styles.reportObs}>{inspection.observations}</Text>
          {inspection.recommendation && (
            <View style={styles.recBox}>
              <Ionicons name="document-text" size={16} color={COLORS.saffron} />
              <Text style={styles.recText}>{inspection.recommendation}</Text>
            </View>
          )}
        </View>
      )}

      {/* CTA */}
      {inspection.status !== 'Completed' && (
        <TouchableOpacity style={styles.beginBtn} onPress={handleBegin}>
          <Ionicons name={inspection.isJoint ? 'people' : 'finger-print'} size={22} color={COLORS.white} />
          <Text style={styles.beginBtnText}>{inspection.isJoint ? 'Join Inspection' : 'Begin Inspection'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10 },
  statusBannerText: { fontSize: 15, fontWeight: '700', flex: 1 },
  jointTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#06038D15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  jointTagText: { fontSize: 12, color: COLORS.navy, fontWeight: 'bold' },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  businessName: { fontSize: 20, fontWeight: 'bold', color: COLORS.ink, marginBottom: 4 },
  inspType: { fontSize: 14, color: COLORS.slate, marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  infoText: { fontSize: 14, color: COLORS.slate, flex: 1 },
  deptChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  deptChip: { backgroundColor: '#06038D10', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  deptChipText: { fontSize: 12, color: COLORS.navy, fontWeight: '600' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  pipeline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pipelineStep: { flex: 1, alignItems: 'center', position: 'relative' },
  pipeDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.line, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  pipeDotDone: { backgroundColor: COLORS.green },
  pipeDotActive: { backgroundColor: COLORS.saffron },
  pipeLabel: { fontSize: 10, color: COLORS.slate, textAlign: 'center', lineHeight: 14 },
  pipeLabelDone: { color: COLORS.green, fontWeight: '600' },
  pipeLabelActive: { color: COLORS.saffron, fontWeight: '700' },
  pipeConnector: { position: 'absolute', top: 17, left: '60%', right: '-40%', height: 2, backgroundColor: COLORS.line },
  pipeConnectorDone: { backgroundColor: COLORS.green },
  reportCard: { borderWidth: 1.5, borderColor: COLORS.green },
  reportObs: { fontSize: 14, color: COLORS.ink, lineHeight: 22, marginBottom: 12 },
  recBox: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#CC6D1D10', padding: 12, borderRadius: 8 },
  recText: { fontSize: 14, color: COLORS.ink, flex: 1, fontWeight: '500' },
  beginBtn: { backgroundColor: COLORS.saffron, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, elevation: 3 },
  beginBtnText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
});
