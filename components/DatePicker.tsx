import { useAppTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from '@/theme/tokens';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { ReactNode, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
    label?: string;
    value?: Date;
    onChange: (date: Date) => void;
    placeholder?: string;
    mode?: 'date' | 'time' | 'datetime';
    error?: string;
    icon?: ReactNode;
    containerStyle?: ViewStyle;
    format?: string;
}

const DatePicker: React.FC<Props> = ({
    label,
    value,
    onChange,
    placeholder = 'Select Date',
    mode = 'date',
    error,
    icon,
    containerStyle,
    format = 'DD MMM YYYY',
}) => {
    const { theme, mode: themeMode } = useAppTheme();
    const isDark = themeMode === 'dark';
    const styles = useStyles();
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState<Date | undefined>(value);

    const handleOnChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
            if (selectedDate) {
                onChange(selectedDate);
            }
        } else {
            // iOS logic handled in modal
            setTempDate(selectedDate || tempDate);
        }
    };

    const confirmIOSDate = () => {
        if (tempDate) onChange(tempDate);
        setShow(false);
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <Pressable
                onPress={() => {
                    setTempDate(value || new Date());
                    setShow(true)
                }}
                style={[styles.inputContainer, error ? styles.inputError : null]}
            >
                <Text style={[styles.value, !value && styles.placeholder]}>
                    {value ? moment(value).format(format) : placeholder}
                </Text>
                {icon}
            </Pressable>

            {error && <Text style={styles.error}>{error}</Text>}

            {/* Android Picker */}
            {Platform.OS === 'android' && show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode={mode}
                    display="default"
                    onChange={handleOnChange}
                />
            )}

            {/* iOS Picker Modal */}
            {Platform.OS === 'ios' && (
                <Modal
                    transparent={true}
                    visible={show}
                    animationType="fade"
                    onRequestClose={() => setShow(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setShow(false)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={confirmIOSDate}>
                                    <Text style={styles.confirmText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={tempDate || new Date()}
                                mode={mode}
                                display="spinner"
                                onChange={handleOnChange}
                                textColor={theme.Label}
                                themeVariant={isDark ? 'dark' : 'light'}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
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
        inputContainer: {
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderRadius: BORDER_RADIUS.sm,
            paddingHorizontal: 12,
            borderColor: theme.Gray2,
        },
        inputError: {
            borderColor: theme.Red,
            shadowColor: theme.Red,
        },
        value: {
            fontSize: TEXT_SIZE.xs,
            color: theme.Label,
            fontWeight: '600',
        },
        placeholder: {
            color: theme.PlaceholderLabel,
            fontWeight: '400',
        },
        error: {
            fontSize: TEXT_SIZE.xxs,
            color: theme.Red,
            fontWeight: '500',
        },
        // iOS Modal Styles
        modalOverlay: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        modalContent: {
            backgroundColor: theme.SecondarySystemGroupedBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: SPACING.xl,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: SPACING.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.Separator,
            marginBottom: SPACING.sm
        },
        cancelText: {
            color: theme.Red,
            fontSize: TEXT_SIZE.md,
            fontWeight: '600'
        },
        confirmText: {
            color: theme.Blue,
            fontSize: TEXT_SIZE.md,
            fontWeight: '600'
        }
    });
};

export default DatePicker;
