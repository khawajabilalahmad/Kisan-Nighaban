import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { getFarm } from '../services/api';
import { MapPin, Calendar, Sprout, Wind, Droplets, Thermometer, CloudLightning } from 'lucide-react-native';

export default function DashboardScreen({ route, navigation }) {
  const { farmId } = route.params || {};
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmId) {
      loadFarmDetails();
    } else {
      // If no farmId is passed, maybe the user hasn't selected a farm
      navigation.navigate('Farm Setup');
    }
  }, [farmId]);

  const loadFarmDetails = async () => {
    try {
      setLoading(true);
      const data = await getFarm(farmId);
      setFarm(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !farm) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.farmName}>{farm.name}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
              <Sprout size={14} color="#B45309" />
              <Text style={[styles.badgeText, { color: '#B45309' }]}>{farm.crop_type}</Text>
            </View>
            <View style={styles.badge}>
              <MapPin size={14} color={theme.colors.text} />
              <Text style={styles.badgeText}>{farm.district}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Weather Snapshot</Text>
          <View style={styles.weatherGrid}>
            <View style={styles.weatherCard}>
              <Thermometer size={24} color={theme.colors.secondary} />
              <Text style={styles.weatherValue}>32°C</Text>
              <Text style={styles.weatherLabel}>Temperature</Text>
            </View>
            <View style={styles.weatherCard}>
              <Droplets size={24} color={theme.colors.secondary} />
              <Text style={styles.weatherValue}>45%</Text>
              <Text style={styles.weatherLabel}>Humidity</Text>
            </View>
            <View style={styles.weatherCard}>
              <Wind size={24} color={theme.colors.secondary} />
              <Text style={styles.weatherValue}>12km/h</Text>
              <Text style={styles.weatherLabel}>Wind</Text>
            </View>
            <View style={styles.weatherCard}>
              <CloudLightning size={24} color={theme.colors.secondary} />
              <Text style={styles.weatherValue}>0mm</Text>
              <Text style={styles.weatherLabel}>Precipitation</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>Climate Risk Level</Text>
            <View style={styles.riskIndicatorRow}>
              <View style={[styles.riskDot, { backgroundColor: theme.colors.riskModerate }]} />
              <Text style={[styles.riskLevelText, { color: theme.colors.riskModerate }]}>Moderate</Text>
            </View>
            <Text style={styles.riskDesc}>
              Expect minor heat stress in the next 3 days. Soil moisture is currently adequate.
            </Text>
            <TouchableOpacity 
              style={styles.insightsButton}
              onPress={() => navigation.navigate('Insights', { farmId: farm.id })}
            >
              <Text style={styles.insightsButtonText}>View Full AI Analysis</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  farmName: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceSolid,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  weatherCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  weatherValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  weatherLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  riskCard: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.md,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  riskIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  riskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  riskLevelText: {
    fontSize: 24,
    fontWeight: '800',
  },
  riskDesc: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  insightsButton: {
    backgroundColor: theme.colors.primaryLight + '30',
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  insightsButtonText: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
    fontSize: 15,
  },
});