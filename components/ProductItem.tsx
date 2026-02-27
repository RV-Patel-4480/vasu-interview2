import { useAppTheme } from '@/hooks/useTheme';
import { FONTS } from "@/theme/fonts";
import { BORDER_RADIUS, SPACING, TEXT_SIZE } from "@/theme/tokens";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

const width = Dimensions.get('screen').width
export function ProductItem({ index }: { index: number }) {
    const styles = useStyles()
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: `https://picsum.photos/id/${index + 1}0/200/300` }}
                style={styles.image}
            />
            <View style={styles.infoContainer}>

                <Text style={styles.productName} numberOfLines={1} adjustsFontSizeToFit>Product Name</Text>
                <Text style={styles.label}>QTY: <Text style={styles.value}>100</Text></Text>
                <Text style={styles.label}>Price: <Text style={styles.value}>$1000</Text></Text>

                <Button variant="flat" title="Add to Cart" />
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
            gap: SPACING.sm,

            shadowColor: theme.Black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        image: {
            width: width / 3.5,
            minHeight: width / 4,
            borderTopLeftRadius: BORDER_RADIUS.sm,
            borderBottomLeftRadius: BORDER_RADIUS.sm
        },
        infoContainer: {
            flex: 1
        },
        productName: {
            fontSize: TEXT_SIZE.lg,
            color: theme.Label,
            fontFamily: FONTS.SEMIBOLD
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