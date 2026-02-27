import { useAppTheme } from '@/hooks/useTheme';
import { FONTS } from '@/theme/fonts';
import { TEXT_SIZE, TITLE_SIZE } from '@/theme/tokens';
import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';

interface TypographyProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
    style?: TextStyle | TextStyle[];
    children: React.ReactNode;
}

export default function Typography({
    variant = 'body',
    color,
    style,
    children,
    ...props
}: TypographyProps) {
    const { theme } = useAppTheme();
    const styles = getStyles(theme.Label);

    const getVariantStyle = (variant: TypographyVariant): TextStyle => {
        switch (variant) {
            case 'h1': return styles.h1;
            case 'h2': return styles.h2;
            case 'h3': return styles.h3;
            case 'h4': return styles.h4;
            case 'body': return styles.body;
            case 'caption': return styles.caption;
            case 'label': return styles.label;
            default: return styles.body;
        }
    };

    return (
        <Text
            style={[
                getVariantStyle(variant),
                color && { color },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}

const getStyles = (defaultColor: string) => StyleSheet.create({
    h1: {
        fontSize: TITLE_SIZE.h1,
        fontFamily: FONTS.BOLD,
        color: defaultColor,
        letterSpacing: 0.35,
    },
    h2: {
        fontSize: TITLE_SIZE.h2,
        fontFamily: FONTS.BOLD, // or SEMIBOLD if preferred
        color: defaultColor,
        letterSpacing: 0.35,
    },
    h3: {
        fontSize: TITLE_SIZE.h3,
        fontFamily: FONTS.SEMIBOLD,
        color: defaultColor,
        letterSpacing: 0.38,
    },
    h4: {
        fontSize: TITLE_SIZE.h4,
        fontFamily: FONTS.SEMIBOLD,
        color: defaultColor,
        letterSpacing: 0.38,
    },
    body: {
        fontSize: TEXT_SIZE.md,
        fontFamily: FONTS.REGULAR,
        color: defaultColor,
        lineHeight: 22,
    },
    caption: {
        fontSize: TEXT_SIZE.sm,
        fontFamily: FONTS.REGULAR,
        color: defaultColor,
        lineHeight: 18,
    },
    label: {
        fontSize: TEXT_SIZE.xs,
        fontFamily: FONTS.MEDIUM,
        color: defaultColor,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    }
});
