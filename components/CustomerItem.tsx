import { useAppTheme } from '@/hooks/useTheme';
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import { PhoneCall } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
    index: number
}
export const CustomerItem: React.FC<Props> = ({ index }) => {
    const { theme } = useAppTheme()
    const styles = useStyles()
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: `https://picsum.photos/id/${index + 1}0/200/300` }}
                style={styles.image}
            />
            <View style={styles.infoContainer}>

                <Text style={styles.productName} numberOfLines={2} adjustsFontSizeToFit>Customer Name</Text>

                <View style={styles.row}>
                    <PhoneCall size={SPACING.md} color={theme.SecondaryLabel} />
                    <Text style={styles.value}>  9427200756</Text>
                </View>
            </View>
        </View>
    )
}

const useStyles = () => {
    const { theme } = useAppTheme()
    return StyleSheet.create({
        container: {
            backgroundColor: theme.SystemBackground, // '#4F46E5',
            borderRadius: BORDER_RADIUS.sm,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: SPACING.xs,
            gap: SPACING.sm,

            shadowColor: theme.Black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        image: {
            width: 50,
            height: 50,
            borderRadius: BORDER_RADIUS.full
        },
        infoContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        productName: {
            fontSize: TEXT_SIZE.lg,
            color: theme.Label,
            fontFamily: FONTS.SEMIBOLD
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        label: {
            fontSize: TEXT_SIZE.sm,
            color: theme.Label,
            fontFamily: FONTS.REGULAR
        },
        value: {
            fontSize: TEXT_SIZE.sm,
            color: theme.Label,
            fontFamily: FONTS.SEMIBOLD
        },
    })
}