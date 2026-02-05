import { View, Text, StyleSheet } from 'react-native';
import { Drink } from '../lib/types';
import { LATE_CAFFEINE_HOUR } from '../lib/constants';
import { format } from 'date-fns';

interface Props {
  drinks: Drink[];
}

export default function LateCaffeineWarning({ drinks }: Props) {
  const lateDrinks = drinks.filter((d) => {
    const hour = new Date(d.timestamp).getHours();
    return hour >= LATE_CAFFEINE_HOUR;
  });

  if (lateDrinks.length === 0) return null;

  const latestTime = format(
    new Date(lateDrinks[lateDrinks.length - 1].timestamp),
    'h:mm a'
  );

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.emoji}>🌙</Text>
        <View style={styles.content}>
          <Text style={styles.title}>Late caffeine alert!</Text>
          <Text style={styles.text}>
            You had caffeine at {latestTime}. This might affect your sleep tonight.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#C4B5FD',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#581C87',
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#6B21A8',
    lineHeight: 18,
  },
});
