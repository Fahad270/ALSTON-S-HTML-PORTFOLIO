import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MOCK_INSPECTIONS } from '../../data/mockData';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen({ navigation }) {
  const pendingCount = MOCK_INSPECTIONS.filter(i => i.status === 'Pending').length;
  const completedCount = MOCK_INSPECTIONS.filter(i => i.status === 'Completed').length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, Officer Vikram</Text>
        <Text style={styles.subtitle}>Here is your schedule for today</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: COLORS.saffron }]}>
          <Text style={styles.statNumber}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending Inspections</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.green }]}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Inspection Map</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.1234,
            longitude: 72.8345,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {MOCK_INSPECTIONS.filter(i => i.status === 'Pending').map((insp) => (
            <Marker
              key={insp.id}
              coordinate={{ latitude: insp.lat, longitude: insp.lng }}
              title={insp.businessName}
              description={insp.type}
            >
              <Ionicons name="location" size={32} color={COLORS.saffron} />
            </Marker>
          ))}
        </MapView>
      </View>

      <Text style={styles.sectionTitle}>Up Next</Text>
      {MOCK_INSPECTIONS.filter(i => i.status === 'Pending').slice(0, 2).map((insp) => (
        <TouchableOpacity 
          key={insp.id} 
          style={styles.card}
          onPress={() => navigation.navigate('InspectionDetail', { inspection: insp })}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{insp.businessName}</Text>
            <Text style={styles.cardTime}>{insp.date}</Text>
          </View>
          <Text style={styles.cardType}>{insp.type}</Text>
          <Text style={styles.cardAddress} numberOfLines={1}><Ionicons name="location-outline" size={14}/> {insp.address}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: { padding: 20, backgroundColor: COLORS.ink },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  subtitle: { fontSize: 14, color: COLORS.line, marginTop: 4 },
  statsContainer: { flexDirection: 'row', padding: 15, gap: 15 },
  statCard: { flex: 1, backgroundColor: COLORS.white, padding: 15, borderRadius: 10, borderLeftWidth: 4, elevation: 2 },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.ink },
  statLabel: { fontSize: 13, color: COLORS.slate, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.ink, marginHorizontal: 20, marginTop: 10, marginBottom: 10 },
  mapContainer: { height: 200, marginHorizontal: 15, borderRadius: 10, overflow: 'hidden', marginBottom: 15, elevation: 2 },
  map: { flex: 1 },
  card: { backgroundColor: COLORS.white, marginHorizontal: 15, marginBottom: 12, padding: 15, borderRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.ink },
  cardTime: { fontSize: 12, color: COLORS.saffron, fontWeight: 'bold' },
  cardType: { fontSize: 14, color: COLORS.slate, marginTop: 4 },
  cardAddress: { fontSize: 13, color: COLORS.slate, marginTop: 8 },
});
