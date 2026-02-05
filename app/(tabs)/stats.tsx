import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import { Drink } from '../../lib/types';
import { DRINK_TYPE_EMOJI, DAILY_CAFFEINE_LIMIT } from '../../lib/constants';
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from 'date-fns';

type Period = 'week' | 'month';

function BarChart({
  data,
  color,
  maxValue,
}: {
  data: { label: string; value: number }[];
  color: string;
  maxValue?: number;
}) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.barsRow}>
        {data.map((item, i) => (
          <View key={i} style={chartStyles.barCol}>
            <Text style={chartStyles.barValue}>
              {item.value > 0 ? Math.round(item.value) : ''}
            </Text>
            <View style={chartStyles.barBg}>
              <View
                style={[
                  chartStyles.barFill,
                  {
                    height: `${Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0)}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
            <Text style={chartStyles.barLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 140,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 9,
    fontWeight: '600',
    color: '#78716C',
    marginBottom: 4,
  },
  barBg: {
    width: '70%',
    flex: 1,
    backgroundColor: '#F5F5F4',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#A8A29E',
    marginTop: 6,
    fontWeight: '600',
  },
});

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('week');
  const { getWeekDrinks, getMonthDrinks } = useStore();

  const drinks = period === 'week' ? getWeekDrinks() : getMonthDrinks();

  const now = new Date();
  const dateRange =
    period === 'week'
      ? eachDayOfInterval({
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        })
      : eachDayOfInterval({
          start: startOfMonth(now),
          end: endOfMonth(now),
        });

  // Aggregate by day
  const caffeineByDay = dateRange.map((day) => {
    const dayDrinks = drinks.filter((d) =>
      isSameDay(new Date(d.timestamp), day)
    );
    return {
      label:
        period === 'week'
          ? format(day, 'EEE')
          : format(day, 'd'),
      value: dayDrinks.reduce((s, d) => s + d.caffeine_mg, 0),
    };
  });

  const spendingByDay = dateRange.map((day) => {
    const dayDrinks = drinks.filter((d) =>
      isSameDay(new Date(d.timestamp), day)
    );
    return {
      label:
        period === 'week'
          ? format(day, 'EEE')
          : format(day, 'd'),
      value: dayDrinks.reduce((s, d) => s + d.cost, 0),
    };
  });

  // Summary stats
  const totalCaffeine = drinks.reduce((s, d) => s + d.caffeine_mg, 0);
  const totalSpent = drinks.reduce((s, d) => s + d.cost, 0);
  const totalDrinks = drinks.length;
  const daysWithDrinks = new Set(
    drinks.map((d) => format(new Date(d.timestamp), 'yyyy-MM-dd'))
  ).size;
  const avgDailyCaffeine = daysWithDrinks > 0 ? totalCaffeine / daysWithDrinks : 0;
  const avgDailySpent = daysWithDrinks > 0 ? totalSpent / daysWithDrinks : 0;

  // Most expensive drinks
  const sortedByCost = [...drinks].sort((a, b) => b.cost - a.cost).slice(0, 5);

  // Peak hours
  const hourCounts: Record<number, number> = {};
  drinks.forEach((d) => {
    const h = new Date(d.timestamp).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  )[0];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Stats & Insights</Text>

      {/* Period Tabs */}
      <View style={styles.tabRow}>
        {(['week', 'month'] as Period[]).map((p) => (
          <Pressable
            key={p}
            style={[styles.tab, period === p && styles.tabActive]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[styles.tabText, period === p && styles.tabTextActive]}
            >
              {p === 'week' ? 'This Week' : 'This Month'}
            </Text>
          </Pressable>
        ))}
      </View>

      {drinks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>No data yet</Text>
          <Text style={styles.emptySubtext}>
            Start logging drinks to see your patterns!
          </Text>
        </View>
      ) : (
        <>
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Drinks</Text>
              <Text style={styles.summaryValue}>{totalDrinks}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Avg Daily mg</Text>
              <Text style={styles.summaryValue}>
                {Math.round(avgDailyCaffeine)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Avg Daily $</Text>
              <Text style={styles.summaryValue}>
                ${avgDailySpent.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Caffeine Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Caffeine (mg)</Text>
            <BarChart
              data={caffeineByDay}
              color="#F59E0B"
              maxValue={DAILY_CAFFEINE_LIMIT}
            />
          </View>

          {/* Spending Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Spending ($)</Text>
            <BarChart data={spendingByDay} color="#22C55E" />
          </View>

          {/* Peak Time */}
          {peakHour && (
            <View style={styles.insightCard}>
              <Text style={styles.insightEmoji}>🕐</Text>
              <View>
                <Text style={styles.insightTitle}>Peak Caffeine Time</Text>
                <Text style={styles.insightText}>
                  You drink the most at{' '}
                  {format(
                    new Date(2000, 0, 1, Number(peakHour[0])),
                    'h a'
                  )}
                </Text>
              </View>
            </View>
          )}

          {/* Total Spent */}
          <View style={styles.insightCard}>
            <Text style={styles.insightEmoji}>💰</Text>
            <View>
              <Text style={styles.insightTitle}>
                Total Spent ({period === 'week' ? 'Week' : 'Month'})
              </Text>
              <Text style={styles.insightText}>${totalSpent.toFixed(2)}</Text>
            </View>
          </View>

          {/* Most Expensive */}
          {sortedByCost.length > 0 && (
            <View style={styles.listCard}>
              <Text style={styles.chartTitle}>Most Expensive Drinks</Text>
              {sortedByCost.map((d, i) => (
                <View key={d.id} style={styles.listRow}>
                  <Text style={styles.listRank}>#{i + 1}</Text>
                  <Text style={styles.listEmoji}>
                    {DRINK_TYPE_EMOJI[d.type]}
                  </Text>
                  <Text style={styles.listName}>{d.name}</Text>
                  <Text style={styles.listValue}>${d.cost.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <View style={{ height: 30 }} />
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#78350F',
    fontFamily: 'Georgia',
    marginTop: 8,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FDE68A',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  tabTextActive: {
    color: '#92400E',
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#78350F',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B45309',
    marginTop: 6,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B45309',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#78350F',
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FDE68A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 4,
  },
  insightCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  insightEmoji: {
    fontSize: 28,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#78350F',
  },
  insightText: {
    fontSize: 13,
    color: '#B45309',
    marginTop: 2,
  },
  listCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  listRank: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
    width: 24,
  },
  listEmoji: {
    fontSize: 20,
  },
  listName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
  },
  listValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
});
