import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../theme/colors';

const COMPLIANCE_COLORS = {
  compliant: COLORS.green,
  partial: COLORS.saffron,
  non_compliant: COLORS.rust,
};

const COMPLIANCE_LABELS = {
  compliant: 'Fully Compliant',
  partial: 'Partially Compliant',
  non_compliant: 'Non-Compliant',
};

const RECOMMENDATION_OPTIONS = {
  compliant: ['Grant NOC / Approval', 'Grant with standard conditions'],
  partial: ['Conditional NOC — rectify within 30 days', 'Conditional NOC — joint re-inspection in 15 days'],
  non_compliant: ['Reject — significant violations found', 'Reject — re-apply after rectification'],
};

export default function ReportScreen({ route, navigation }) {
  const { inspection, checkInTime, checklist, evidences, observations, overallCompliance } = route.params;
  const [recommendation, setRecommendation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const recOptions = RECOMMENDATION_OPTIONS[overallCompliance] || [];
  const compColor = COMPLIANCE_COLORS[overallCompliance] || COLORS.slate;
  const compLabel = COMPLIANCE_LABELS[overallCompliance] || '';

  const handleSubmit = async () => {
    Alert.alert(
      'Submit Report',
      'This report will be digitally signed and submitted to the Sub Regional Officer. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Report',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSubmitted(true);
          }
        }
      ]
    );
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.green} />
        <Text style={styles.successTitle}>Report Submitted!</Text>
        <Text style={styles.successSubtitle}>
          Your visit report has been securely hashed and forwarded to the Sub Regional Officer for Department Decision.
        </Text>
        <View style={styles.hashCard}>
          <Text style={styles.hashLabel}>Report Hash (SHA-256)</Text>
          <Text style={styles.hashValue}>a3f9e1d8c24b...7f02</Text>
        </View>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.homeBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Report Header */}
      <View style={[styles.reportHeader, { borderTopColor: compColor }]}>
        <Text style={styles.reportTitle}>FIELD VISIT REPORT</Text>
        <Text style={styles.reportSubtitle}>Maharashtra Integrated Management Information System (IMIS)</Text>
      </View>

      {/* Inspection Details Section */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Inspection Details</Text>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Report ID</Text><Text style={styles.detailVal}>{inspection.id}-RPT</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Business</Text><Text style={styles.detailVal}>{inspection.businessName}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Department</Text><Text style={styles.detailVal}>{inspection.department}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Type</Text><Text style={styles.detailVal}>{inspection.type}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Address</Text><Text style={styles.detailVal}>{inspection.address}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Check-In Time</Text><Text style={styles.detailVal}>{checkInTime ? new Date(checkInTime).toLocaleString() : 'N/A'}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Officer</Text><Text style={styles.detailVal}>Vikram Deshmukh (EMP-204)</Text></View>
      </View>

      {/* Checklist Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Verification Checklist ({checklist.length} items)</Text>
        {checklist.map((item, idx) => (
          <View key={item.id} style={styles.checkRow}>
            <Ionicons
              name={item.compliance === 'compliant' ? 'checkmark-circle' : item.compliance === 'non_compliant' ? 'close-circle' : 'remove-circle'}
              size={18}
              color={item.compliance === 'compliant' ? COLORS.green : item.compliance === 'non_compliant' ? COLORS.rust : COLORS.slate}
            />
            <Text style={styles.checkTask}>{item.task}</Text>
            <Text style={[styles.checkStatus, {
              color: item.compliance === 'compliant' ? COLORS.green : item.compliance === 'non_compliant' ? COLORS.rust : COLORS.slate
            }]}>
              {item.compliance === 'compliant' ? 'OK' : item.compliance === 'non_compliant' ? 'Fail' : 'N/A'}
            </Text>
          </View>
        ))}
      </View>

      {/* Observations */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Field Observations</Text>
        <Text style={styles.observationsText}>{observations}</Text>
      </View>

      {/* Evidence Photos */}
      {evidences.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Photographic Evidence ({evidences.length} photos)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {evidences.map((ev, idx) => (
                <View key={idx} style={styles.thumbCard}>
                  <Image source={{ uri: ev.uri }} style={styles.thumb} />
                  <Text style={styles.thumbGeo}>
                    {ev.lat ? `${ev.lat.toFixed(4)}, ${ev.lng.toFixed(4)}` : 'No GPS'}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Overall Compliance Badge */}
      <View style={[styles.complianceBanner, { backgroundColor: `${compColor}15`, borderColor: compColor }]}>
        <Ionicons name="shield-checkmark" size={28} color={compColor} />
        <View>
          <Text style={styles.complianceBannerLabel}>Overall Compliance</Text>
          <Text style={[styles.complianceBannerValue, { color: compColor }]}>{compLabel}</Text>
        </View>
      </View>

      {/* Recommendation */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Recommendation to Sub Regional Officer</Text>
        {recOptions.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.recOption, recommendation === opt && { borderColor: COLORS.ink, backgroundColor: '#0B203610' }]}
            onPress={() => setRecommendation(opt)}
          >
            <Ionicons name={recommendation === opt ? 'radio-button-on' : 'radio-button-off'} size={20} color={recommendation === opt ? COLORS.ink : COLORS.slate} />
            <Text style={[styles.recOptionText, recommendation === opt && { color: COLORS.ink, fontWeight: '700' }]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, !recommendation && styles.btnDisabled]}
        disabled={!recommendation}
        onPress={handleSubmit}
      >
        <Ionicons name="send" size={20} color={COLORS.white} />
        <Text style={styles.submitBtnText}>Sign & Submit to Department</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By submitting, you confirm this report is accurate and was prepared during a physical site visit in accordance with MPCB / Maharashtra Labour / Maha Fire Service procedures.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  reportHeader: { backgroundColor: COLORS.ink, borderRadius: 12, padding: 20, borderTopWidth: 4, alignItems: 'center' },
  reportTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 },
  reportSubtitle: { fontSize: 12, color: '#9FB0C2', marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  detailKey: { fontSize: 13, color: COLORS.slate, flex: 1 },
  detailVal: { fontSize: 13, color: COLORS.ink, fontWeight: '600', flex: 2, textAlign: 'right' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  checkTask: { fontSize: 13, color: COLORS.ink, flex: 1 },
  checkStatus: { fontSize: 12, fontWeight: 'bold' },
  observationsText: { fontSize: 14, color: COLORS.ink, lineHeight: 22 },
  thumbCard: { alignItems: 'center' },
  thumb: { width: 100, height: 100, borderRadius: 8 },
  thumbGeo: { fontSize: 9, color: COLORS.slate, marginTop: 4, fontFamily: 'monospace' },
  complianceBanner: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18, borderRadius: 12, borderWidth: 2 },
  complianceBannerLabel: { fontSize: 12, color: COLORS.slate, fontWeight: '600', textTransform: 'uppercase' },
  complianceBannerValue: { fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  recOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.line, marginBottom: 10 },
  recOptionText: { fontSize: 14, color: COLORS.slate, flex: 1 },
  submitBtn: { backgroundColor: COLORS.saffron, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 3 },
  btnDisabled: { opacity: 0.4 },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  disclaimer: { fontSize: 11, color: COLORS.slate, textAlign: 'center', lineHeight: 17 },
  successContainer: { flex: 1, backgroundColor: COLORS.paper, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 20 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.ink },
  successSubtitle: { fontSize: 15, color: COLORS.slate, textAlign: 'center', lineHeight: 22 },
  hashCard: { backgroundColor: COLORS.ink, padding: 16, borderRadius: 12, width: '100%' },
  hashLabel: { fontSize: 12, color: '#9FB0C2', marginBottom: 6 },
  hashValue: { fontSize: 14, color: COLORS.saffron, fontFamily: 'monospace' },
  homeBtn: { backgroundColor: COLORS.saffron, padding: 16, borderRadius: 12, width: '100%', alignItems: 'center' },
  homeBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
