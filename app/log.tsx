import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../lib/store';
import { DrinkType } from '../lib/types';
import {
  DRINK_TYPE_EMOJI,
  DRINK_TYPE_LABELS,
  DRINK_PRESETS,
} from '../lib/constants';

const DRINK_TYPES: DrinkType[] = ['coffee', 'tea', 'energy_drink', 'boba'];

export default function LogDrinkScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addDrink, getRecentDrinkNames } = useStore();

  const [selectedType, setSelectedType] = useState<DrinkType>('coffee');
  const [name, setName] = useState('');
  const [caffeine, setCaffeine] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');

  const recentNames = getRecentDrinkNames();

  const filteredPresets = useMemo(
    () => DRINK_PRESETS.filter((p) => p.type === selectedType),
    [selectedType]
  );

  const handlePresetSelect = (preset: (typeof DRINK_PRESETS)[number]) => {
    setName(preset.name);
    setCaffeine(preset.caffeine_mg.toString());
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter a drink name.');
      return;
    }

    const caffeineNum = parseInt(caffeine) || 0;
    const costNum = parseFloat(cost) || 0;

    await addDrink({
      type: selectedType,
      name: name.trim(),
      caffeine_mg: caffeineNum,
      cost: costNum,
      timestamp: new Date().toISOString(),
      location: location.trim() || undefined,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Log a Drink</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Drink Type Selector */}
        <Text style={styles.sectionLabel}>DRINK TYPE</Text>
        <View style={styles.typeRow}>
          {DRINK_TYPES.map((type) => (
            <Pressable
              key={type}
              style={[
                styles.typeBtn,
                selectedType === type && styles.typeBtnActive,
              ]}
              onPress={() => {
                setSelectedType(type);
                setName('');
                setCaffeine('');
              }}
            >
              <Text style={styles.typeEmoji}>{DRINK_TYPE_EMOJI[type]}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type && styles.typeLabelActive,
                ]}
              >
                {DRINK_TYPE_LABELS[type]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Select Presets */}
        <Text style={styles.sectionLabel}>QUICK SELECT</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetsScroll}
          contentContainerStyle={styles.presetsContent}
        >
          {filteredPresets.map((preset) => (
            <Pressable
              key={preset.name}
              style={[
                styles.presetChip,
                name === preset.name && styles.presetChipActive,
              ]}
              onPress={() => handlePresetSelect(preset)}
            >
              <Text style={styles.presetEmoji}>{preset.emoji}</Text>
              <Text
                style={[
                  styles.presetName,
                  name === preset.name && styles.presetNameActive,
                ]}
              >
                {preset.name}
              </Text>
              <Text style={styles.presetMg}>{preset.caffeine_mg}mg</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Recent Drinks */}
        {recentNames.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>RECENT</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.presetsScroll}
              contentContainerStyle={styles.presetsContent}
            >
              {recentNames.map((n) => (
                <Pressable
                  key={n}
                  style={[
                    styles.recentChip,
                    name === n && styles.presetChipActive,
                  ]}
                  onPress={() => {
                    setName(n);
                    const preset = DRINK_PRESETS.find((p) => p.name === n);
                    if (preset) {
                      setCaffeine(preset.caffeine_mg.toString());
                      setSelectedType(preset.type);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.recentText,
                      name === n && styles.presetNameActive,
                    ]}
                  >
                    {n}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Form Fields */}
        <Text style={styles.sectionLabel}>DRINK NAME</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Iced Latte"
          placeholderTextColor="#D4A574"
        />

        <View style={styles.formRow}>
          <View style={styles.formHalf}>
            <Text style={styles.sectionLabel}>CAFFEINE (mg)</Text>
            <TextInput
              style={styles.input}
              value={caffeine}
              onChangeText={setCaffeine}
              placeholder="150"
              placeholderTextColor="#D4A574"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.formHalf}>
            <Text style={styles.sectionLabel}>COST ($)</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              placeholder="5.50"
              placeholderTextColor="#D4A574"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>LOCATION (optional)</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Starbucks"
          placeholderTextColor="#D4A574"
        />

        {/* Save Button */}
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && styles.saveBtnPressed,
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Drink</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  content: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelBtn: {
    width: 60,
  },
  cancelText: {
    fontSize: 16,
    color: '#D97706',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#78350F',
    fontFamily: 'Georgia',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  typeBtnActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B45309',
  },
  typeLabelActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  presetsScroll: {
    marginHorizontal: -20,
  },
  presetsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  presetChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  presetEmoji: {
    fontSize: 16,
  },
  presetName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350F',
  },
  presetNameActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  presetMg: {
    fontSize: 11,
    color: '#B45309',
  },
  recentChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
  },
  recentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#78350F',
    fontWeight: '500',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formHalf: {
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
});
