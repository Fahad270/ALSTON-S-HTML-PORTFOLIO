import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MOCK_INSPECTIONS } from '../../data/mockData';

export default function InspectionsListScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: item.status === 'Pending' ? COLORS.saffron : COLORS.green }]}
      onPress={() => navigation.navigate('InspectionDetail', { inspection: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.businessName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? '#CC6D1D15' : '#12880715' }]}>
          <Text style={[styles.statusText, { color: item.status === 'Pending' ? COLORS.saffron : COLORS.green }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardType}>{item.type}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardText}><Ionicons name="calendar-outline" /> {item.date}</Text>
        <Text style={[styles.cardText, {flex:1, marginLeft: 10}]} numberOfLines={1} ellipsizeMode="tail"><Ionicons name="location-outline" /> {item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_INSPECTIONS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  card: { backgroundColor: COLORS.white, marginBottom: 15, padding: 15, borderRadius: 10, borderLeftWidth: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.ink, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  cardType: { fontSize: 14, color: COLORS.slate, marginTop: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 12 },
  cardText: { fontSize: 13, color: COLORS.slate },
});
