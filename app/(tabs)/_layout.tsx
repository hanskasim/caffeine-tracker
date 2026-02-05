import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFBEB',
          borderTopColor: '#FDE68A',
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 30,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#D97706',
        tabBarInactiveTintColor: '#A8A29E',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>☕</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22 }}>📊</Text>
          ),
        }}
      />
    </Tabs>
  );
}
