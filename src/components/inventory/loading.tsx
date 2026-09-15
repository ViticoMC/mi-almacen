import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Reanimated, {
    cancelAnimation,
    Easing as ReanimatedEasing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

type LoadingProps = {
    text?: string;
};

export default function Loading({ text }: LoadingProps) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        // start an infinite rotation using Reanimated worklets
        rotation.value = withRepeat(
            withTiming(1, { duration: 1000, easing: ReanimatedEasing.linear }),
            -1,
            false,
        );

        return () => {
            cancelAnimation(rotation);
            rotation.value = 0;
        };
    }, [rotation]);

    const spinStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value * 360}deg` }],
    }));

    return (
        <View style={styles.container}>
            <Reanimated.View style={[styles.spinner, spinStyle]} />
            {text ? <Text style={styles.text}>{text}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    spinner: {
        width: 38,
        height: 38,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: '#dbeafe',
        borderTopColor: '#3b82f6',
        borderLeftColor: '#60a5fa',
        borderRightColor: '#93c5fd',
        borderStyle: 'solid',
    },
    text: {
        marginTop: 12,
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
    },
});
