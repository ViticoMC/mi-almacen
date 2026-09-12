import { Paths } from "expo-file-system";
import { Text, View } from 'react-native';



export default function test() {

    console.log(Paths.document)
    return (
        <View className='h-100 flex justify-center text-white'>
            <Text className='text-white'> sdvs</Text>
        </View>
    )
}