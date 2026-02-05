import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import MascotCharacter from '../../components/MascotCharacter';
import CaffeineCard from '../../components/CaffeineCard';
import SpendingCard from '../../components/SpendingCard';
import DrinkTimeline from '../../components/DrinkTimeline';
import LateCaffeineWarning from '../../components/LateCaffeineWarning';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getTodayDrinks, getWeekDrinks, removeDrink } = useStore();

  const todayDrinks = getTodayDrinks();
  const weekDrinks = getWeekDrinks();

  const totalCaffeine = todayDrinks.reduce((sum, d) => sum + d.caffeine_mg, 0);
  const totalSpent = todayDrinks.reduce((sum, d) => sum + d.cost, 0);
  const weekSpent = weekDrinks.reduce((sum, d) => sum + d.cost, 0);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Primary CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.logButton,
          pressed && styles.logButtonPressed,
        ]}
        onPress={() => router.push('/log')}
      >
        <Text style={styles.logButtonIcon}>+</Text>
        <Text style={styles.logButtonText}>Log a Drink</Text>
      </Pressable>

      {/* Mascot */}
      <MascotCharacter
        drinkCount={todayDrinks.length}
        totalCaffeine={totalCaffeine}
      />

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <CaffeineCard totalCaffeine={totalCaffeine} />
        <SpendingCard todaySpent={totalSpent} weekSpent={weekSpent} />
      </View>

      {/* Drink Timeline */}
      <DrinkTimeline
        drinks={todayDrinks}
        onDelete={removeDrink}
        onEdit={(id) => router.push(`/log?editId=${id}`)}
      />

      {/* Late Caffeine Warning */}
      <LateCaffeineWarning drinks={todayDrinks} />

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  logButtonIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  logButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
});
