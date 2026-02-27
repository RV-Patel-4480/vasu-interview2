import { useAppTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    const { theme } = useAppTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.SystemBackground }
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}

