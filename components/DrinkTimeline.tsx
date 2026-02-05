import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Drink } from '../lib/types';
import { DRINK_TYPE_EMOJI } from '../lib/constants';
import { format } from 'date-fns';

interface Props {
  drinks: Drink[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function DrinkTimeline({ drinks, onDelete, onEdit }: Props) {
  const today = format(new Date(), 'EEEE, MMM d');

  const handleLongPress = (drink: Drink) => {
    Alert.alert(
      'Delete Drink',
      `Remove "${drink.name}" from your log?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(drink.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Today's Drinks</Text>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{today}</Text>
        </View>
      </View>

      {drinks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>☕</Text>
          <Text style={styles.emptyText}>Ready for your first sip?</Text>
          <Text style={styles.emptySubtext}>Tap "Log a Drink" to get started</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {drinks.map((drink) => (
            <Pressable
              key={drink.id}
              style={({ pressed }) => [
                styles.drinkRow,
                pressed && styles.drinkRowPressed,
              ]}
              onPress={() => onEdit(drink.id)}
              onLongPress={() => handleLongPress(drink)}
            >
              <Text style={styles.drinkEmoji}>
                {DRINK_TYPE_EMOJI[drink.type]}
              </Text>
              <View style={styles.drinkInfo}>
                <Text style={styles.drinkName}>{drink.name}</Text>
                <View style={styles.drinkMeta}>
                  <Text style={styles.metaText}>
                    🕐 {format(new Date(drink.timestamp), 'h:mm a')}
                  </Text>
                  {drink.location ? (
                    <Text style={styles.metaText}>
                      📍 {drink.location}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.drinkStats}>
                <Text style={styles.drinkCost}>${drink.cost.toFixed(2)}</Text>
                <Text style={styles.drinkCaffeine}>{drink.caffeine_mg}mg</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#78350F',
  },
  dateBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#B45309',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#D97706',
    marginTop: 4,
  },
  list: {
    gap: 10,
  },
  drinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 12,
  },
  drinkEmoji: {
    fontSize: 28,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#78350F',
  },
  drinkMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#B45309',
  },
  drinkStats: {
    alignItems: 'flex-end',
  },
  drinkCost: {
    fontSize: 15,
    fontWeight: '700',
    color: '#78350F',
  },
  drinkCaffeine: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  drinkRowPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
