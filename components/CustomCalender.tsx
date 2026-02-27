import { useAppTheme } from '@/hooks/useTheme';
import { SPACING, TEXT_SIZE } from '@/theme/tokens';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
interface Props {
  date: Date | undefined,
  onChange: (value: Date) => void,
  placeholder?: string,
  formate?: string,
  label?: string,
  error?: string,
  icon?: ReactNode,
  mode?: 'date' | 'time' | 'datetime' | 'countdown',
  labelStyle?: TextStyle,
  errorStyle?: TextStyle,
  containerStyle?: ViewStyle
}

const CustomCalender: React.FC<Props> = ({
  date,
  onChange,
  placeholder = 'dd-mm-yyyy',
  formate = 'DD-MM-YYYY',
  label,
  error,
  icon,
  mode = 'date',
  labelStyle,
  errorStyle,
  containerStyle,
  ...rest
}) => {
  const styles = useStyles();
  const [show, setShow] = useState(false);
  const handleOnChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        style={[styles.container, containerStyle]}
      >
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <View style={[styles.valueContainer, error && styles.inputError]}>
          <Text style={styles.value}>
            {date ? moment(date).format(formate) : placeholder}
          </Text>
          {icon}
        </View>
        {error ? <Text style={[styles.error, errorStyle]}>{error}</Text> : null}
      </Pressable>
      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode={mode}
          is24Hour={false}
          onChange={handleOnChange}
          {...rest}
        />
      )}
    </>
  );
};

const useStyles = () => {
  const { theme } = useAppTheme();
  return StyleSheet.create({
    container: {
      gap: 2,
    },
    label: {
      fontSize: TEXT_SIZE.xs,
      color: theme.Label,
      fontWeight: '500',
    },
    valueContainer: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: SPACING.xs,
      paddingHorizontal: 12,
      borderColor: theme.Gray,
      color: theme.Label,

      shadowColor: theme.Black,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
    },
    value: {
      fontSize: TEXT_SIZE.xxs,
      color: theme.Label,
      fontWeight: '600',
    },

    inputError: {
      borderColor: theme.Red,
      shadowColor: theme.Red,
    },
    error: {
      fontSize: TEXT_SIZE.xxs,
      color: theme.Red,
      fontWeight: '500',
    },
  });
};

export default CustomCalender;
