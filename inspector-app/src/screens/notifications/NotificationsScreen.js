import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: 'New Inspection Assigned',
      body: 'You have been assigned to inspect EcoTech Solutions on 03 Oct at 10:00 AM (Joint).',
      time: '30 min ago',
      icon: 'calendar',
      color: COLORS.saffron,
      unread: true,
    },
    {
      id: 2,
      title: 'SLA Reminder',
      body: 'Inspection INSP-101 (Demo Manufacturing) is due in 2 hours. Please complete check-in.',
      time: '1 hr ago',
      icon: 'timer',
      color: COLORS.rust,
      unread: true,
    },
    {
      id: 3,
      title: 'Report Approved',
      body: 'Your visit report for Sunrise Foods has been reviewed and forwarded to the department.',
      time: 'Yesterday',
      icon: 'checkmark-circle',
      color: COLORS.green,
      unread: false,
    },
    {
      id: 4,
      title: 'Query from Sub Regional Officer',
      body: 'SRO Patil has raised a query on your INSP-103 report: "Pest control records not found in evidence."',
      time: 'Yesterday',
      icon: 'chatbox',
      color: COLORS.navy,
      unread: false,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {notifications.map(n => (
        <View key={n.id} style={[styles.card, n.unread && styles.cardUnread]}>
          <View style={[styles.iconWrap, { backgroundColor: `${n.color}15` }]}>
            <Ionicons name={n.icon} size={22} color={n.color} />
          </View>
          <View style={styles.textWrap}>
            <View style={styles.topRow}>
              <Text style={styles.title}>{n.title}</Text>
              {n.unread && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.body}>{n.body}</Text>
            <Text style={styles.time}>{n.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 16, flexDirection: 'row', gap: 14, elevation: 1 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.saffron },
  iconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  textWrap: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 15, fontWeight: 'bold', color: COLORS.ink, flex: 1 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.saffron, marginLeft: 8 },
  body: { fontSize: 13, color: COLORS.slate, lineHeight: 20 },
  time: { fontSize: 12, color: COLORS.slate, marginTop: 6, fontWeight: '500' },
});
