import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../theme/colors';

export default function CheckInScreen({ route, navigation }) {
  const { inspection } = route.params;
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location required', 'GPS location is required to verify officer presence at the site.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  const handleCheckIn = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCheckedIn(true);
    setCheckInTime(new Date());
  };

  const handleProceed = () => {
    navigation.navigate('ChecklistScreen', { inspection, checkInTime: checkInTime?.toISOString() });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Inspection Summary Card */}
      <View style={styles.card}>
        <View style={styles.deptTag}>
          <Ionicons name="business" size={14} color={COLORS.saffron} />
          <Text style={styles.deptText}>{inspection.department}</Text>
        </View>
        <Text style={styles.businessName}>{inspection.businessName}</Text>
        <Text style={styles.inspType}>{inspection.type}</Text>
        <View style={styles.row}>
          <Ionicons name="location" size={16} color={COLORS.saffron} />
          <Text style={styles.addressText}>{inspection.address}</Text>
        </View>
        {inspection.isJoint && (
          <View style={styles.jointBadge}>
            <Ionicons name="people" size={14} color={COLORS.navy} />
            <Text style={styles.jointText}>Joint Inspection — {inspection.jointDepartments?.length} Departments</Text>
          </View>
        )}
      </View>

      {/* GPS Status */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>GPS Verification</Text>
        {loading ? (
          <View style={styles.gpsPending}>
            <Ionicons name="locate" size={24} color={COLORS.saffron} />
            <Text style={styles.gpsStatus}>Acquiring GPS signal...</Text>
          </View>
        ) : (
          <View style={styles.gpsOk}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.green} />
            <View>
              <Text style={styles.gpsStatus}>Location Acquired</Text>
              <Text style={styles.gpsCoords}>
                {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.gpsAccuracy}>Accuracy: ±{location.coords.accuracy?.toFixed(0)}m</Text>
            </View>
          </View>
        )}
      </View>

      {/* Inspection Workflow Steps */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Inspection Workflow</Text>
        {[
          { label: 'Officer Attendance (Check-In)', icon: 'person-circle', active: true },
          { label: 'Verification Checklist', icon: 'checkbox', active: false },
          { label: 'Field Observations', icon: 'eye', active: false },
          { label: 'Compliance Assessment', icon: 'shield-checkmark', active: false },
          { label: 'Report & Recommendation', icon: 'document-text', active: false },
          { label: 'Department Decision', icon: 'briefcase', active: false },
        ].map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={[styles.stepDot, step.active && styles.stepDotActive]}>
              <Ionicons name={step.icon} size={16} color={step.active ? COLORS.white : COLORS.slate} />
            </View>
            {idx < 5 && <View style={styles.stepLine} />}
            <Text style={[styles.stepLabel, step.active && styles.stepLabelActive]}>{step.label}</Text>
          </View>
        ))}
      </View>

      {/* Check-In Button */}
      {!checkedIn ? (
        <TouchableOpacity
          style={[styles.checkInBtn, loading && styles.btnDisabled]}
          onPress={handleCheckIn}
          disabled={loading}
        >
          <Ionicons name="finger-print" size={24} color={COLORS.white} />
          <Text style={styles.checkInText}>Confirm Presence & Check In</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <View style={styles.checkedInConfirm}>
            <Ionicons name="checkmark-circle" size={28} color={COLORS.green} />
            <View>
              <Text style={styles.checkedInTitle}>Checked In Successfully</Text>
              <Text style={styles.checkedInTime}>{checkInTime?.toLocaleTimeString()} · GPS Verified</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
            <Text style={styles.proceedText}>Proceed to Checklist</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  deptTag: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  deptText: { fontSize: 12, color: COLORS.saffron, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  businessName: { fontSize: 20, fontWeight: 'bold', color: COLORS.ink, marginBottom: 4 },
  inspType: { fontSize: 14, color: COLORS.slate, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  addressText: { fontSize: 13, color: COLORS.slate, flex: 1 },
  jointBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: '#06038D12', padding: 8, borderRadius: 8 },
  jointText: { fontSize: 13, color: COLORS.navy, fontWeight: '600' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },
  gpsPending: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gpsOk: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  gpsStatus: { fontSize: 15, fontWeight: '600', color: COLORS.ink },
  gpsCoords: { fontSize: 13, fontFamily: 'monospace', color: COLORS.slate, marginTop: 2 },
  gpsAccuracy: { fontSize: 12, color: COLORS.green, marginTop: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 0 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.line, justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: COLORS.saffron },
  stepLine: { position: 'absolute', left: 15, top: 32, width: 2, height: 18, backgroundColor: COLORS.line },
  stepLabel: { fontSize: 14, color: COLORS.slate, paddingVertical: 14 },
  stepLabelActive: { color: COLORS.ink, fontWeight: '700' },
  checkInBtn: { backgroundColor: COLORS.saffron, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, elevation: 3 },
  btnDisabled: { opacity: 0.5 },
  checkInText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
  checkedInConfirm: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#12880715', padding: 16, borderRadius: 12, marginBottom: 12 },
  checkedInTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.green },
  checkedInTime: { fontSize: 13, color: COLORS.slate, marginTop: 2 },
  proceedBtn: { backgroundColor: COLORS.ink, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  proceedText: { color: COLORS.white, fontSize: 17, fontWeight: 'bold' },
});
