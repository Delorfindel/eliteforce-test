import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, Platform } from 'react-native';

import { Button } from '@/components/ui/button';
import { MutedText, UIText } from '@/components/ui/text';
import { formatBookingDate, formatBookingTime } from '@/features/services/lib/formatters';
import { Pressable, View } from '@/tw';

type SchedulingSheetProps = {
  onClose: () => void;
  onConfirm: (value: string) => void;
  visible: boolean;
};

export function SchedulingSheet({ onClose, onConfirm, visible }: SchedulingSheetProps) {
  const [selectedDate, setSelectedDate] = React.useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 2);
    next.setHours(11, 0, 0, 0);
    return next;
  });
  const [pickerMode, setPickerMode] = React.useState<'date' | 'time' | null>(null);

  const handlePickerChange = React.useCallback((event: DateTimePickerEvent, nextValue?: Date) => {
    if (Platform.OS === 'android') {
      setPickerMode(null);
    }

    if (event.type !== 'set' || !nextValue) {
      return;
    }

    setSelectedDate(nextValue);
  }, []);

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View className="flex-1 justify-end bg-black/30">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="gap-5 rounded-t-[32px] bg-white px-5 pb-8 pt-6">
          <UIText className="text-center text-[20px] font-semibold">Planning du Tasker</UIText>

          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 rounded-[24px] bg-brand-sand-strong px-4 py-5"
              onPress={() => setPickerMode('date')}
            >
              <MutedText className="text-xs uppercase tracking-[0.4px]">Date</MutedText>
              <UIText className="mt-1 text-[18px] font-semibold">
                {formatBookingDate(selectedDate.toISOString())}
              </UIText>
            </Pressable>
            <Pressable
              className="flex-1 rounded-[24px] bg-brand-sand-strong px-4 py-5"
              onPress={() => setPickerMode('time')}
            >
              <MutedText className="text-xs uppercase tracking-[0.4px]">Heure</MutedText>
              <UIText className="mt-1 text-[18px] font-semibold">
                {formatBookingTime(selectedDate.toISOString())}
              </UIText>
            </Pressable>
          </View>

          {pickerMode ? (
            <DateTimePicker
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              mode={pickerMode}
              onChange={handlePickerChange}
              value={selectedDate}
            />
          ) : null}

          <Button onPress={() => onConfirm(selectedDate.toISOString())}>Sélectionner</Button>
        </View>
      </View>
    </Modal>
  );
}
