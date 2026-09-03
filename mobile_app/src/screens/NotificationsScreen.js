import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Bell, AlertTriangle, Info } from 'lucide-react-native';
import { theme } from '../theme/theme';

export default function NotificationsScreen() {
  const [notifications] = useState([
    { id: '1', title: 'Critical Weather Alert', body: 'Heavy rainfall expected tomorrow. Delay pesticide application.', type: 'critical', time: '2 hours ago' },
    { id: '2', title: 'Task Reminder', body: 'Time to check soil moisture in the North sector.', type: 'info', time: '5 hours ago' },
    { id: '3', title: 'New AI Insight', body: 'Moderate risk of heat stress detected. View dashboard for recommendations.', type: 'warning', time: '1 day ago' },
  ]);

  const renderNotification = ({ item }) => {
    let icon, bgColor, borderColor;
    
    switch(item.type) {
      case 'critical':
        icon = <AlertTriangle color={theme.colors.riskCritical} size={24} />;
        bgColor = theme.colors.dangerBg;
        borderColor = theme.colors.dangerBorder;
        break;
      case 'warning':
        icon = <Bell color={theme.colors.riskModerate} size={24} />;
        bgColor = '#FEF3C7';
        borderColor = '#FDE68A';
        break;
      default:
        icon = <Info color={theme.colors.secondary} size={24} />;
        bgColor = theme.colors.surfaceSolid;
        borderColor = theme.colors.borderLight;
    }

    return (
      <View style={[styles.card, { backgroundColor: bgColor, borderColor: borderColor }]}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Notifications</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: theme.spacing.lg },
  headerTitle: { fontSize: 24, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.lg },
  card: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    ...theme.shadows.sm,
  },
  iconContainer: { marginRight: theme.spacing.md, justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardBody: { fontSize: 14, color: theme.colors.textMuted, marginBottom: 8, lineHeight: 20 },
  cardTime: { fontSize: 12, color: theme.colors.textLight, fontWeight: '600' },
});
