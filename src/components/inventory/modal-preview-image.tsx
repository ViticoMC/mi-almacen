import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Modal, Pressable, View } from 'react-native';

interface ModalPreviewImageProps {
    previewUri: string | null;
    setPreviewUri: (uri: string | null) => void;
    palette: any;
}

export default function ModalPreviewImage({ previewUri, setPreviewUri, palette }: ModalPreviewImageProps) {

    return (

        <Modal
            transparent
            visible={previewUri !== null}
            animationType="fade"
            onRequestClose={() => setPreviewUri(null)}
        >
            <Pressable
                className="flex-1 items-center justify-center bg-[rgba(15,23,42,0.85)]"
                onPress={() => setPreviewUri(null)}
            >
                {previewUri ? (
                    <Image
                        source={{ uri: previewUri }}
                        style={{
                            width: "86%",
                            maxWidth: 420,
                            aspectRatio: 1,
                            borderRadius: 24,
                            backgroundColor: palette.border,
                        }}
                        contentFit="cover"
                        transition={200}
                    />
                ) : null}
                <View className="absolute top-12 right-6">
                    <MaterialCommunityIcons name="close" size={28} color="#fff" />
                </View>
            </Pressable>
        </Modal>
    )
}