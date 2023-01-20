import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { HabitDay, Header } from '../components';
import { daySize, weekDays } from '../components/HabitDay';

import { generateDatesFromYearBeginning } from '../utils/generateDatesFromYearBeginning';

const { pastDates, futureDates } = generateDatesFromYearBeginning(18);

export function Home() {
  const { navigate } = useNavigation();

  return (
    <View className='flex-1 bg-background p-8 pt-16'>
      <Header />

      <View className='flex-row mt-6 mb-2'>
        {weekDays.map((day, index) => (
          <Text
            key={index}
            className='text-zinc-400 text-xl text-bold text-center mx-1'
            style={{ width: daySize }}
          >
            {day}
          </Text>))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className='flex-row flex-wrap'>
          {pastDates.map((date, index) => <HabitDay key={index} onPress={() => navigate('habits', { date: date.toISOString() })}/>)}
          {futureDates.map((__, index) => <HabitDay key={index} disabled />)}
        </View>
      </ScrollView>
    </View>
  );
}
