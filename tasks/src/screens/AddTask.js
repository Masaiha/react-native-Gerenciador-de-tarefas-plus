import React, { Component } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import commonStyles from '../../commonStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormatterDate from '../../functions/FormatterDate';

import moment from 'moment';

const initialState = {
    desc: '',
    date: new Date(),
    showDateTimePicker: false
}

export default class AddTask extends Component {

    state = { ...initialState }

    getDateTimePicker = () => {
        let datePicker =  <DateTimePicker 
                                value={this.state.date}
                                onChange={(_, date) => {this.setState({ date, showDateTimePicker: false })}}
                                mode='date'
                            />
   
        var dateUpdated = moment(this.state.date).format('dddd, D [de] MMM [de] YYYY');

        if(Platform.OS === 'android'){
            return datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDateTimePicker: true })}>
                        <Text style={styles.date}>{dateUpdated}</Text>
                    </TouchableOpacity>
                    { this.state.showDateTimePicker && datePicker }
                </View>
            )
        }
        
        return datePicker;
    }

    save = () => {
        const newTask = {desc: this.state.desc, date: this.state.date}

        this.props.onSave && this.props.onSave(newTask);
        this.setState({ ...initialState })
    }

    render(){
        return(
            <Modal transparent={true}
                   visible={this.props.isVisible}
                   onRequestClose={this.props.onCancel}
                   animationType='slide'>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova tarefa</Text>
                    <TextInput style={styles.input}
                               placeholder= 'Informe a descrição'
                               value={this.state.desc}
                               onChangeText ={desc => this.setState({ desc })}>            
                    </TextInput>

                    {this.getDateTimePicker()}
                    
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={[styles.button]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={[styles.button]}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
            </Modal>

        )}
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        // flex: 1,
        backgroundColor: '#FFF'        
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        fontWeight: 'bold',
        fontSize: 20,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        fontWeight: 'bold',
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today,
        // backgroundColor: commonStyles.colors.today,
        width: 100,
        padding: 10,
        textAlign: 'center',
        borderRadius: 6
    },
    buttonCancel: {
        backgroundColor: '#dc3545'
    },
    buttonSave: {
        backgroundColor: '#007bff'
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 20
    }
})