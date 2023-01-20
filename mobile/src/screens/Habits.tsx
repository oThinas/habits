import { ScrollView, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

import { BackButton, ProgressBar, Checkbox } from '../components';

interface IHabitsProps {
  date: string;
}

export function Habits() {
  const route = useRoute();
  const { date } = route.params as IHabitsProps;
  const parsedDate = dayjs(date);
  const weekDay = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <BackButton />

        <Text className='mt-5 text-zinc-400 font-semibold text-base lowercase'>
          {weekDay}
        </Text>

        <Text className='text-white font-extrabold text-3xl'>
          {dayAndMonth}
        </Text>

        <ProgressBar progress={50}/>

        <View className='mt-6'>
          <Checkbox>
            Beber 2L de água
          </Checkbox>

          <Checkbox checked>
            Caminhar
          </Checkbox>
        </View>
      </ScrollView>
    </View>
  );
}
