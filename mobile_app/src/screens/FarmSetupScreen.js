import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { Sprout, MapPin, Calendar, Navigation, Edit2, Trash2, Plus, X } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { getFarms, createFarm, deleteFarm } from '../services/api';

const CROPS = ['wheat', 'cotton', 'rice', 'sugarcane', 'maize', 'mango'];

export default function FarmSetupScreen({ navigation }) {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    crop_type: 'wheat',
    sowing_date: '',
    district: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    try {
      const data = await getFarms();
      setFarms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFarm = async () => {
    if (!form.name || !form.sowing_date) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude) || 30.3753, // fallback
        longitude: parseFloat(form.longitude) || 69.3451, // fallback
      };
      await createFarm(payload);
      setIsModalVisible(false);
      setForm({ name: '', crop_type: 'wheat', sowing_date: '', district: '', latitude: '', longitude: '' });
      await loadFarms();
    } catch (err) {
      Alert.alert('Error', 'Failed to save farm.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Farm', 'Are you sure you want to delete this farm?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteFarm(id);
          await loadFarms();
        } catch (e) {
          Alert.alert('Error', 'Could not delete farm');
        }
      }}
    ]);
  };

  const renderFarm = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cropBadge}>
            <Sprout size={12} color="#B45309" />
            <Text style={styles.cropText}>{item.crop_type}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Trash2 size={20} color={theme.colors.riskCritical} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.metaRow}>
          <MapPin size={16} color={theme.colors.riskHigh} />
          <Text style={styles.metaText}>{item.district || 'No district'}</Text>
        </View>
        <View style={styles.metaRow}>
          <Calendar size={16} color={theme.colors.secondary} />
          <Text style={styles.metaText}>Sown {item.sowing_date}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.cardButton} 
        onPress={() => navigation.navigate('Dashboard', { farmId: item.id })}
      >
        <Text style={styles.cardButtonText}>View Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={farms}
          keyExtractor={item => item.id}
          renderItem={renderFarm}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Sprout size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>No farms registered yet.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setIsModalVisible(true)}>
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Register Farm</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Green Acres"
              value={form.name}
              onChangeText={text => setForm({...form, name: text})}
            />

            <Text style={styles.label}>Crop Type</Text>
            <TextInput
              style={styles.input}
              placeholder="wheat, cotton, rice..."
              value={form.crop_type}
              onChangeText={text => setForm({...form, crop_type: text})}
            />

            <Text style={styles.label}>Sowing Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2024-11-01"
              value={form.sowing_date}
              onChangeText={text => setForm({...form, sowing_date: text})}
            />

            <Text style={styles.label}>District</Text>
            <TextInput
              style={styles.input}
              placeholder="Lahore"
              value={form.district}
              onChangeText={text => setForm({...form, district: text})}
            />
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleSaveFarm} disabled={saving}>
              {saving ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>Save Farm</Text>}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.textMuted,
  },
  card: {
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  cropText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 4,
  },
  cardBody: {
    marginBottom: theme.spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  cardButton: {
    backgroundColor: theme.colors.primaryLight + '30',
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  cardButtonText: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalForm: {
    padding: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: theme.colors.surfaceSolid,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: theme.colors.text,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});