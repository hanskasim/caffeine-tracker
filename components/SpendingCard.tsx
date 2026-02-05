import { View, Text, StyleSheet } from 'react-native';

interface Props {
  todaySpent: number;
  weekSpent: number;
}

export default function SpendingCard({ todaySpent, weekSpent }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>💰</Text>
        <Text style={styles.label}>SPENT TODAY</Text>
      </View>
      <Text style={styles.value}>${todaySpent.toFixed(2)}</Text>
      <Text style={styles.subtext}>${weekSpent.toFixed(2)} this week</Text>
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
    borderColor: '#BBF7D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#166534',
    letterSpacing: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    color: '#14532D',
  },
  subtext: {
    fontSize: 11,
    color: '#16A34A',
    marginTop: 2,
  },
});
