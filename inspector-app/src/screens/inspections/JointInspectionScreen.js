import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function JointInspectionScreen({ route, navigation }) {
  const { inspection } = route.params;

  const depts = [
    { name: 'MPCB', officer: 'Dr. Anand Kulkarni', status: 'Checked In', icon: 'leaf', color: COLORS.green },
    { name: 'Industry & Labour', officer: 'Vikram Deshmukh', status: 'En Route', icon: 'briefcase', color: COLORS.saffron },
    { name: 'Fire Safety', officer: 'R. K. Shinde', status: 'Pending', icon: 'flame', color: COLORS.rust },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.header}>
        <Ionicons name="people" size={24} color={COLORS.saffron} />
        <Text style={styles.headerTitle}>Joint Industrial Inspection</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}><Text style={styles.infoKey}>Business</Text><Text style={styles.infoVal}>{inspection.businessName}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoKey}>Date & Time</Text><Text style={styles.infoVal}>{inspection.date}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoKey}>Address</Text><Text style={styles.infoVal}>{inspection.address}</Text></View>
        <View style={styles.infoRow}><Text style={styles.infoKey}>Departments</Text><Text style={styles.infoVal}>{inspection.jointDepartments?.length || 3}</Text></View>
      </View>

      <Text style={styles.sectionLabel}>Department Officers</Text>
      {depts.map((dept, idx) => (
        <View key={idx} style={[styles.deptCard, { borderLeftColor: dept.color }]}>
          <View style={styles.deptIconWrap}>
            <Ionicons name={dept.icon} size={20} color={dept.color} />
          </View>
          <View style={styles.deptInfo}>
            <Text style={styles.deptName}>{dept.name}</Text>
            <Text style={styles.deptOfficer}>{dept.officer}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${dept.color}15` }]}>
            <Text style={[styles.statusText, { color: dept.color }]}>{dept.status}</Text>
          </View>
        </View>
      ))}

      <View style={styles.noteCard}>
        <Ionicons name="information-circle" size={18} color={COLORS.navy} />
        <Text style={styles.noteText}>
          Joint inspections require all department officers to be on-site before the checklist can begin. The joint report will be co-signed by all officers and submitted to the respective Sub Regional Officers.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => navigation.navigate('CheckIn', { inspection })}
      >
        <Ionicons name="finger-print" size={20} color={COLORS.white} />
        <Text style={styles.startBtnText}>Begin My Department Check-In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, backgroundColor: COLORS.ink, borderRadius: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  infoCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  infoKey: { fontSize: 13, color: COLORS.slate },
  infoVal: { fontSize: 13, color: COLORS.ink, fontWeight: '600', flex: 1, textAlign: 'right' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.5 },
  deptCard: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, borderLeftWidth: 4, elevation: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  deptIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.paper, justifyContent: 'center', alignItems: 'center' },
  deptInfo: { flex: 1 },
  deptName: { fontSize: 15, fontWeight: 'bold', color: COLORS.ink },
  deptOfficer: { fontSize: 13, color: COLORS.slate, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  noteCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: '#06038D0A', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#06038D25' },
  noteText: { fontSize: 13, color: COLORS.slate, flex: 1, lineHeight: 20 },
  startBtn: { backgroundColor: COLORS.saffron, padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 3 },
  startBtnText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});
