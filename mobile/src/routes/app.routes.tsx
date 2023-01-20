import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, Habits, NewHabit } from '../screens';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Screen name='home' component={Home} />

      <Screen name='habits' component={Habits} />

      <Screen name='newHabit' component={NewHabit} />
    </Navigator>
  );
}
