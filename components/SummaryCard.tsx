import { useAppTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from '@/theme/tokens';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
    title: string;
    amount: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    style?: ViewStyle;
}

const SummaryCard: React.FC<Props> = ({
    title,
    amount,
    icon,
    trend,
    trendValue,
    style,
}) => {
    const { theme } = useAppTheme();
    const styles = useStyles();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
            </View>

            <Text style={styles.amount}>{amount}</Text>

            {trend && trendValue && (
                <View style={styles.trendContainer}>
                    {trend === 'up' ? (
                        <TrendingUp size={14} color={theme.Green} />
                    ) : trend === 'down' ? (
                        <TrendingDown size={14} color={theme.Red} />
                    ) : null}
                    <Text style={[
                        styles.trendText,
                        trend === 'up' ? { color: theme.Green } :
                            trend === 'down' ? { color: theme.Red } :
                                { color: theme.SecondaryLabel }
                    ]}>
                        {trendValue}
                    </Text>
                </View>
            )}
        </View>
    );
};

const useStyles = () => {
    const { theme } = useAppTheme();
    return StyleSheet.create({
        container: {
            backgroundColor: theme.SecondarySystemGroupedBackground,
            padding: SPACING.md,
            borderRadius: BORDER_RADIUS.md,
            minWidth: 140,
            shadowColor: theme.Black,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: SPACING.sm,
        },
        title: {
            fontSize: TEXT_SIZE.xs,
            color: theme.SecondaryLabel,
            fontWeight: '500',
            flex: 1
        },
        iconContainer: {
            opacity: 0.7
        },
        amount: {
            fontSize: TEXT_SIZE.xl,
            fontWeight: '700',
            color: theme.Label,
            marginBottom: SPACING.xs
        },
        trendContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
        },
        trendText: {
            fontSize: TEXT_SIZE.xs,
            fontWeight: '500'
        }
    });
};

export default SummaryCard;
