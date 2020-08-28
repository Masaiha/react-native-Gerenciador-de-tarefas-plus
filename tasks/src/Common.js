import { Alert, Platform } from 'react-native';

const server = 'http://192.168.0.13:3000';

function showError(err) {
    Alert.alert('Ops, ocorreu um erro: ', err)
}

function showSuccess(msg) {
    Alert.alert('Sucesso, ', msg)
}

export{ server, showError, showSuccess }