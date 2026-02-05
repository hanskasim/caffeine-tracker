import { View, Text, StyleSheet } from 'react-native';
import { DAILY_CAFFEINE_LIMIT } from '../lib/constants';

interface Props {
  drinkCount: number;
  totalCaffeine: number;
}

export default function MascotCharacter({ drinkCount, totalCaffeine }: Props) {
  const isOverLimit = totalCaffeine > DAILY_CAFFEINE_LIMIT;

  const getEmoji = () => {
    if (isOverLimit) return '😵';
    if (drinkCount >= 3) return '😊';
    if (drinkCount >= 1) return '🙂';
    return '😴';
  };

  const getSize = () => {
    if (drinkCount === 0) return 60;
    if (drinkCount <= 2) return 80;
    if (drinkCount <= 5) return 100;
    return 120;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrap}>
        <Text style={[styles.mascot, { fontSize: getSize() }]}>
          {getEmoji()}
        </Text>
        {drinkCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{drinkCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title}>Caffeine Buddy</Text>
      <Text style={styles.subtitle}>Track your buzz & budget</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotWrap: {
    position: 'relative',
  },
  mascot: {
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#92400E',
    marginTop: 8,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 14,
    color: '#B45309',
    marginTop: 2,
  },
});
