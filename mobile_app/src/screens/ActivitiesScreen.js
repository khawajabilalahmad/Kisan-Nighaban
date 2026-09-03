import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Plus, CheckCircle, Droplets, Bug, Sprout } from 'lucide-react-native';
import { theme } from '../theme/theme';
// Assuming you have getActivities API in api.js
// import { getActivities } from '../services/api'; 

export default function ActivitiesScreen({ route }) {
  // Using dummy data if backend doesn't have activities yet
  const [activities, setActivities] = useState([
    { id: '1', type: 'watering', description: 'Watered the wheat field', date: '2024-03-10', icon: Droplets },
    { id: '2', type: 'fertilizer', description: 'Applied urea to improve growth', date: '2024-03-08', icon: Sprout },
    { id: '3', type: 'pesticide', description: 'Sprayed for aphid prevention', date: '2024-03-05', icon: Bug },
  ]);
  const [loading, setLoading] = useState(false);

  const renderActivity = ({ item }) => {
    const IconComponent = item.icon || CheckCircle;
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <IconComponent size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.type.toUpperCase()}</Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={item => item.id}
          renderItem={renderActivity}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.headerTitle}>Farm Activities Log</Text>
          }
        />
      )}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: theme.spacing.lg },
  headerTitle: { fontSize: 24, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.lg },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceSolid,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardContent: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 6 },
  cardDate: { fontSize: 12, color: theme.colors.textLight, fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 30, right: 24,
    backgroundColor: theme.colors.primary,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    ...theme.shadows.lg,
  }
});
