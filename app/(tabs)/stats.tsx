import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import { DRINK_TYPE_EMOJI, DAILY_CAFFEINE_LIMIT } from '../../lib/constants';
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
} from 'date-fns';

type Period = 'week' | 'month';

function BarChart({
  data,
  color,
  maxValue,
  total,
  unit,
}: {
  data: { label: string; value: number; fullDate: string }[];
  color: string;
  maxValue?: number;
  total: number;
  unit: string;
}) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // Filter out days with no data
  const filteredData = data.filter((d) => d.value > 0);

  if (filteredData.length === 0) {
    return (
      <View style={chartStyles.emptyChart}>
        <Text style={chartStyles.emptyText}>No data to display</Text>
      </View>
    );
  }

  const max = maxValue || Math.max(...filteredData.map((d) => d.value), 1);
  const yAxisLabels = [max, Math.round(max / 2), 0];

  // Get first and last dates for x-axis
  const firstDate = filteredData[0]?.label || '';
  const lastDate = filteredData[filteredData.length - 1]?.label || '';

  const selectedItem = selectedBar !== null ? filteredData[selectedBar] : null;

  return (
    <View style={chartStyles.container}>
      {/* Selected bar info popup */}
      {selectedItem && (
        <View style={[chartStyles.infoPopup, { borderColor: color }]}>
          <Text style={chartStyles.infoDate}>{selectedItem.fullDate}</Text>
          <Text style={[chartStyles.infoValue, { color }]}>
            {unit === '$' ? `$${selectedItem.value.toFixed(2)}` : `${Math.round(selectedItem.value)}${unit}`}
          </Text>
        </View>
      )}

      <View style={chartStyles.chartRow}>
        {/* Y-axis labels */}
        <View style={chartStyles.yAxis}>
          {yAxisLabels.map((val, i) => (
            <Text key={i} style={chartStyles.yAxisLabel}>
              {val}
            </Text>
          ))}
        </View>

        {/* Bars */}
        <View style={chartStyles.barsRow}>
          {filteredData.map((item, i) => (
            <Pressable
              key={i}
              style={chartStyles.barCol}
              onPress={() => setSelectedBar(selectedBar === i ? null : i)}
            >
              <View style={chartStyles.barBg}>
                <View
                  style={[
                    chartStyles.barFill,
                    {
                      height: `${Math.max((item.value / max) * 100, 8)}%`,
                      backgroundColor: color,
                    },
                    selectedBar === i && chartStyles.barFillSelected,
                  ]}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* X-axis with first and last dates */}
      <View style={chartStyles.xAxis}>
        <Text style={chartStyles.xAxisLabel}>{firstDate}</Text>
        <Text style={chartStyles.xAxisLabel}>{lastDate}</Text>
      </View>

      {/* Total */}
      <View style={chartStyles.totalRow}>
        <Text style={chartStyles.totalLabel}>Total:</Text>
        <Text style={[chartStyles.totalValue, { color }]}>
          {unit === '$' ? `$${total.toFixed(2)}` : `${Math.round(total)}${unit}`}
        </Text>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  emptyChart: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#A8A29E',
  },
  infoPopup: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoDate: {
    fontSize: 13,
    color: '#78350F',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  chartRow: {
    flexDirection: 'row',
  },
  yAxis: {
    width: 32,
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
  },
  yAxisLabel: {
    fontSize: 9,
    color: '#A8A29E',
    fontWeight: '600',
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 120,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    maxWidth: 24,
  },
  barBg: {
    width: '100%',
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
  barFillSelected: {
    opacity: 0.7,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 32,
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#A8A29E',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  totalLabel: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
  },
});

// Mini Calendar Component
function MiniCalendar({
  visible,
  onClose,
  onSelectDate,
  daysWithLogs,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  daysWithLogs: Set<string>;
}) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday start

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={calendarStyles.overlay} onPress={onClose}>
        <View style={calendarStyles.container}>
          <Text style={calendarStyles.monthTitle}>
            {format(now, 'MMMM yyyy')}
          </Text>

          {/* Day headers */}
          <View style={calendarStyles.weekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <Text key={i} style={calendarStyles.dayHeader}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={calendarStyles.grid}>
            {/* Padding for first week */}
            {Array.from({ length: paddingDays }).map((_, i) => (
              <View key={`pad-${i}`} style={calendarStyles.dayCell} />
            ))}

            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const hasLog = daysWithLogs.has(dateKey);
              const isTodayDate = isToday(day);

              return (
                <Pressable
                  key={dateKey}
                  style={[
                    calendarStyles.dayCell,
                    isTodayDate && calendarStyles.todayCell,
                  ]}
                  onPress={() => {
                    onSelectDate(day);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      calendarStyles.dayText,
                      isTodayDate && calendarStyles.todayText,
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                  {hasLog && <View style={calendarStyles.logDot} />}
                </Pressable>
              );
            })}
          </View>

          <Pressable style={calendarStyles.closeBtn} onPress={onClose}>
            <Text style={calendarStyles.closeBtnText}>Close</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const calendarStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#78350F',
    textAlign: 'center',
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#A8A29E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCell: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: '500',
  },
  todayText: {
    fontWeight: '700',
    color: '#D97706',
  },
  logDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
  },
});

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('week');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { drinks, getWeekDrinks, getMonthDrinks } = useStore();

  // Get filtered drinks based on selection
  const getFilteredDrinks = () => {
    if (selectedDate) {
      const dayStart = startOfDay(selectedDate);
      const dayEnd = endOfDay(selectedDate);
      return drinks.filter((d) => {
        const t = new Date(d.timestamp);
        return t >= dayStart && t <= dayEnd;
      });
    }
    return period === 'week' ? getWeekDrinks() : getMonthDrinks();
  };

  const filteredDrinks = getFilteredDrinks();

  const now = new Date();

  // Date range for display
  const getDateRangeText = () => {
    if (selectedDate) {
      return format(selectedDate, 'EEEE, MMM d, yyyy');
    }
    if (period === 'week') {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(now, 'MMMM yyyy');
  };

  const dateRange = selectedDate
    ? [selectedDate]
    : period === 'week'
      ? eachDayOfInterval({
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        })
      : eachDayOfInterval({
          start: startOfMonth(now),
          end: endOfMonth(now),
        });

  // Aggregate by day for charts
  const caffeineByDay = dateRange.map((day) => {
    const dayDrinks = filteredDrinks.filter((d) =>
      isSameDay(new Date(d.timestamp), day)
    );
    return {
      label: format(day, 'MMM d'),
      fullDate: format(day, 'EEE, MMM d'),
      value: dayDrinks.reduce((s, d) => s + d.caffeine_mg, 0),
    };
  });

  const spendingByDay = dateRange.map((day) => {
    const dayDrinks = filteredDrinks.filter((d) =>
      isSameDay(new Date(d.timestamp), day)
    );
    return {
      label: format(day, 'MMM d'),
      fullDate: format(day, 'EEE, MMM d'),
      value: dayDrinks.reduce((s, d) => s + d.cost, 0),
    };
  });

  // Summary stats
  const totalCaffeine = filteredDrinks.reduce((s, d) => s + d.caffeine_mg, 0);
  const totalSpent = filteredDrinks.reduce((s, d) => s + d.cost, 0);
  const totalDrinks = filteredDrinks.length;
  const daysWithDrinks = new Set(
    filteredDrinks.map((d) => format(new Date(d.timestamp), 'yyyy-MM-dd'))
  ).size;
  const avgDailyCaffeine =
    daysWithDrinks > 0 ? totalCaffeine / daysWithDrinks : 0;
  const avgDailySpent = daysWithDrinks > 0 ? totalSpent / daysWithDrinks : 0;

  // Most expensive drinks
  const sortedByCost = [...filteredDrinks]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  // Peak hours
  const hourCounts: Record<number, number> = {};
  filteredDrinks.forEach((d) => {
    const h = new Date(d.timestamp).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  )[0];

  // Days with logs for calendar
  const daysWithLogs = new Set(
    drinks.map((d) => format(new Date(d.timestamp), 'yyyy-MM-dd'))
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Calendar Button */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Stats & Insights</Text>
        <Pressable
          style={styles.calendarBtn}
          onPress={() => setShowCalendar(true)}
        >
          <Text style={styles.calendarBtnText}>📅</Text>
        </Pressable>
      </View>

      {/* Date Range Subtitle */}
      <Text style={styles.dateRange}>{getDateRangeText()}</Text>

      {/* Clear filter button if date selected */}
      {selectedDate && (
        <Pressable style={styles.clearFilterBtn} onPress={clearDateFilter}>
          <Text style={styles.clearFilterText}>✕ Clear date filter</Text>
        </Pressable>
      )}

      {/* Period Tabs (hidden when specific date selected) */}
      {!selectedDate && (
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
                {p === 'week' ? 'Week' : 'Month'}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {filteredDrinks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>No data yet</Text>
          <Text style={styles.emptySubtext}>
            {selectedDate
              ? 'No drinks logged on this day'
              : 'Start logging drinks to see your patterns!'}
          </Text>
        </View>
      ) : (
        <>
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Drinks</Text>
              <Text style={styles.summaryValue}>{totalDrinks}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Caffeine</Text>
              <Text style={styles.summaryValue}>
                {Math.round(totalCaffeine)}
                <Text style={styles.summaryUnit}>mg</Text>
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Spent</Text>
              <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
            </View>
          </View>

          {/* Charts only for week/month view, not single day */}
          {!selectedDate && (
            <>
              {/* Caffeine Chart */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Caffeine (mg)</Text>
                <BarChart
                  data={caffeineByDay}
                  color="#F59E0B"
                  maxValue={DAILY_CAFFEINE_LIMIT}
                  total={totalCaffeine}
                  unit="mg"
                />
              </View>

              {/* Spending Chart */}
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Spending ($)</Text>
                <BarChart
                  data={spendingByDay}
                  color="#22C55E"
                  total={totalSpent}
                  unit="$"
                />
              </View>
            </>
          )}

          {/* Peak Time */}
          {peakHour && (
            <View style={styles.insightCard}>
              <Text style={styles.insightEmoji}>🕐</Text>
              <View>
                <Text style={styles.insightTitle}>Peak Caffeine Time</Text>
                <Text style={styles.insightText}>
                  {selectedDate ? 'Most drinks' : 'You drink the most'} at{' '}
                  {format(new Date(2000, 0, 1, Number(peakHour[0])), 'h a')}
                </Text>
              </View>
            </View>
          )}

          {/* Averages (only for multi-day views) */}
          {!selectedDate && daysWithDrinks > 1 && (
            <View style={styles.insightCard}>
              <Text style={styles.insightEmoji}>📈</Text>
              <View>
                <Text style={styles.insightTitle}>Daily Averages</Text>
                <Text style={styles.insightText}>
                  {Math.round(avgDailyCaffeine)}mg caffeine · $
                  {avgDailySpent.toFixed(2)} spent
                </Text>
              </View>
            </View>
          )}

          {/* Most Expensive */}
          {sortedByCost.length > 0 && (
            <View style={styles.listCard}>
              <Text style={styles.chartTitle}>
                {selectedDate ? 'Drinks' : 'Most Expensive Drinks'}
              </Text>
              {sortedByCost.map((d, i) => (
                <View key={d.id} style={styles.listRow}>
                  <Text style={styles.listRank}>#{i + 1}</Text>
                  <Text style={styles.listEmoji}>
                    {DRINK_TYPE_EMOJI[d.type]}
                  </Text>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{d.name}</Text>
                    <Text style={styles.listMeta}>
                      {format(new Date(d.timestamp), 'h:mm a')} ·{' '}
                      {d.caffeine_mg}mg
                    </Text>
                  </View>
                  <Text style={styles.listValue}>${d.cost.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <View style={{ height: 30 }} />

      {/* Calendar Modal */}
      <MiniCalendar
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onSelectDate={handleDateSelect}
        daysWithLogs={daysWithLogs}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#78350F',
    fontFamily: 'Georgia',
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBtnText: {
    fontSize: 20,
  },
  dateRange: {
    fontSize: 14,
    color: '#B45309',
    marginTop: 4,
    marginBottom: 16,
  },
  clearFilterBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  clearFilterText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
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
    fontSize: 20,
    fontWeight: '800',
    color: '#78350F',
  },
  summaryUnit: {
    fontSize: 12,
    fontWeight: '600',
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
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
  },
  listMeta: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
  listValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
});
