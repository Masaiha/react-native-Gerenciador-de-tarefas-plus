import { Platform } from 'react-native';

const getPlatform = () => {
    return Platform.OS;
}

const isAndroidPlatform = () => {
    return Platform.OS === 'android' ? true : false
}

const isIosPlatform = () => {
    return Platform.OS === 'ios' ? true : false
}

export default { getPlatform }