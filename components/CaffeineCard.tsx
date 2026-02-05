import { View, Text, StyleSheet } from 'react-native';
import { DAILY_CAFFEINE_LIMIT } from '../lib/constants';

interface Props {
  totalCaffeine: number;
}

export default function CaffeineCard({ totalCaffeine }: Props) {
  const percentage = Math.min((totalCaffeine / DAILY_CAFFEINE_LIMIT) * 100, 100);
  const isOver = totalCaffeine > DAILY_CAFFEINE_LIMIT;

  return (
    <View style={[styles.card, isOver && styles.cardOver]}>
      <View style={styles.header}>
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.label}>CAFFEINE</Text>
      </View>
      <Text style={styles.value}>{totalCaffeine}</Text>
      <Text style={styles.subtext}>mg / {DAILY_CAFFEINE_LIMIT}mg daily</Text>
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%` },
            isOver && styles.progressOver,
          ]}
        />
      </View>
      {isOver && (
        <Text style={styles.warning}>Over limit!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardOver: {
    borderColor: '#FCA5A5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    color: '#78350F',
  },
  subtext: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  progressBg: {
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
    height: 6,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressOver: {
    backgroundColor: '#EF4444',
  },
  warning: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
    marginTop: 6,
  },
});
