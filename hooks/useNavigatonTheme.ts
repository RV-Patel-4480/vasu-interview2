import { FONTS } from "@/theme/fonts"
import { Theme } from "@react-navigation/native"
import { useAppTheme } from "./useTheme"

export const useNavigationTheme = (): Theme => {
    const { mode, theme } = useAppTheme()
    return {
        dark: mode === 'dark',
        colors: {
            primary: theme.Blue,
            background: theme.SystemBackground,
            card: theme.TertiarySystemBackground,
            text: theme.Label,
            border: theme.Gray2,
            notification: theme.Red
        }, fonts: {
            bold: {
                fontFamily: FONTS.BOLD,
                fontWeight: '700'
            },
            heavy: {
                fontFamily: FONTS.BLACK,
                fontWeight: '900'
            },
            medium: {
                fontFamily: FONTS.MEDIUM,
                fontWeight: '500'
            },
            regular: {
                fontFamily: FONTS.REGULAR,
                fontWeight: '400'
            },
        }
    }
}