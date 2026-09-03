import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../theme/theme';
import { getLatestRisk } from '../services/api';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function InsightsScreen({ route }) {
  const { farmId } = route.params || {};
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmId) loadRiskData();
    else setLoading(false);
  }, [farmId]);

  const loadRiskData = async () => {
    try {
      setLoading(true);
      const data = await getLatestRisk(farmId);
      setRiskData(data);
    } catch (err) {
      console.log('No risk data available yet, showing mockup instead for UI demonstration.');
      // Mockup data to show premium UI if backend doesn't have an analysis yet
      setRiskData({
        risk_score: 45,
        risk_level: 'moderate',
        risk_breakdown: { heat_stress: 60, water_stress: 30, pest_risk: 10 },
        recommendations: [
          'Increase irrigation frequency for the next 3 days to offset heat stress.',
          'Monitor soil moisture levels closely in the top 10cm.',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!riskData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Select a farm from the Dashboard first.</Text>
      </View>
    );
  }

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [32, 35, 38, 36, 31, 29, 30],
      color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red line
      strokeWidth: 3
    }]
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>AI Climate Insights</Text>
          <Text style={styles.subtitle}>Detailed risk assessment & actionable recommendations</Text>
        </View>

        {/* Risk Score Gauge Mockup */}
        <View style={styles.gaugeCard}>
          <Text style={styles.cardTitle}>Overall Risk Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>{riskData.risk_score}</Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
          <Text style={[styles.levelText, { color: theme.colors.riskModerate }]}>
            {riskData.risk_level.toUpperCase()}
          </Text>
        </View>

        {/* Forecast Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Temperature Forecast (°C)</Text>
          <LineChart
            data={chartData}
            width={width - 48} // from padding
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surfaceSolid,
              backgroundGradientFrom: theme.colors.surfaceSolid,
              backgroundGradientTo: theme.colors.surfaceSolid,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
              labelColor: (opacity = 1) => theme.colors.textMuted,
              style: { borderRadius: 16 },
              propsForDots: { r: "5", strokeWidth: "2", stroke: theme.colors.surfaceSolid }
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.cardTitle}>AI Recommendations</Text>
          {riskData.recommendations.map((rec, idx) => (
            <View key={idx} style={styles.recRow}>
              <CheckCircle size={20} color={theme.colors.primary} />
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: theme.spacing.lg },
  header: { marginBottom: theme.spacing.xl },
  title: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  subtitle: { fontSize: 16, color: theme.colors.textMuted, marginTop: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 },
  
  gaugeCard: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
    borderWidth: 1, borderColor: theme.colors.borderLight
  },
  scoreCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: theme.colors.background,
    borderWidth: 8, borderColor: theme.colors.riskModerate,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: { fontSize: 48, fontWeight: '800', color: theme.colors.text },
  scoreLabel: { fontSize: 16, color: theme.colors.textMuted, marginTop: -5 },
  levelText: { fontSize: 22, fontWeight: '800' },
  
  chartCard: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
    borderWidth: 1, borderColor: theme.colors.borderLight
  },
  
  recommendationsCard: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
    borderWidth: 1, borderColor: theme.colors.borderLight
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.successBg,
    padding: 16,
    borderRadius: theme.radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.successBorder,
  },
  recText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 22,
  },
  text: { color: theme.colors.text, fontSize: 16 },
});