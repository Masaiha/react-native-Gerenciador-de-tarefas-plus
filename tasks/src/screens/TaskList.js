import React, { Component } from 'react';
import { View, Text , ImageBackground, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import commonStyles from '../../commonStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

import todayImage from '../../wwwroot/assets/imgs/today.jpg';
import Task from '../components/Task';
import FormatterDate from '../../functions/FormatterDate';
import { getPlatform } from '../../functions/GettingPlatform';
import { Platform } from 'react-native';
import AddTask from './AddTask';
import AsyncStorage from '@react-native-community/async-storage';

import moment from 'moment';
import axios from 'axios';
import { server, showError, showSuccess } from '../Common';


const initialState = {
    showDonedTasks: true,
    showAddTaskModal: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskList extends Component {

    state = {...initialState}

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState');
        const savedState = JSON.parse(stateString) || initialState;
        
        this.setState({
            showDonedTasks: savedState.showDonedTasks
        }, this.filterTasks)

        this.loadTasks()
    }

    loadTasks = async () => {

        const maxDate = moment().format('YYYY-MM-DD 23:59:59')
        await axios.get(`${server}/tasks?date=${maxDate}`)
            .then(res => { this.setState({ tasks: res.data }, this.filterTasks) })
            .catch(error => { showError(error) })
    }

    toggleFilter = () => {
        this.setState({ showDonedTasks: !this.state.showDonedTasks }, this.filterTasks)
    }

    toggleTask = async (taksId) => {
        
        await axios.put(`${server}/tasks/${taksId}/toggle`)
            .then(res => { this.loadTasks() })
            .catch(error => showError(error))

    }

    filterTasks = () => {
        let visibleTasks = null;

        if(this.state.showDonedTasks){
            visibleTasks = [...this.state.tasks];
        }
        else{
            const pending = task => task.doneAt === null;
            visibleTasks = this.state.tasks.filter(pending);
        }

        this.setState({ visibleTasks });
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDonedTasks: this.state.showDonedTasks
        }))
    }

    onSave = async (newTask) => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert("Dados incorretos!")
            return
        }

        await axios.post(`${server}/tasks`, {
            desc: newTask.desc,
            estimateAt: newTask.date
        }).then(res => { 
            showSuccess("Tarefa salva com sucesso!")
            this.setState({ showAddTaskModal: false }, this.loadTasks) })
        .catch(error => { showError(error) })

    }

    onDelete = async taskId => {
        await axios.delete(`${server}/tasks/${taskId}`)
            .then(res => {this.loadTasks()})
            .catch(error => showError(error))
    }

    render(){
        return(
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTaskModal}
                         onCancel={() => this.setState({ showAddTaskModal: false })}
                         onSave={this.onSave}
                />
                <ImageBackground source={todayImage} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toggleFilter}>
                            <Icon name={this.state.showDonedTasks ? 'eye' : 'eye-slash'} 
                                  size={20} 
                                  color={commonStyles.colors.secondary} 
                                  style={styles.icon}
                            />
                        </TouchableOpacity>    
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <FormatterDate style={styles.subTitle} date={new Date()} />
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList 
                        data={this.state.visibleTasks} 
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.onDelete} /> }
                    />
                </View>
                <TouchableOpacity style={styles.iconPlus}
                                  onPress={() => this.setState({ showAddTaskModal: true })}
                                  activeOpacity={0.7}>
                    <Icon name="plus" size={20} color={commonStyles.colors.secondary}/>
                </TouchableOpacity>
            </View>
            
    )}
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3,   
    },
    taskList:{
        flex: 7,
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        color:  commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
    },
    subTitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: Platform.Os === 'ios' ? 30 : 10,
        justifyContent: 'flex-end',
    },
    iconPlus: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: commonStyles.colors.today,
        justifyContent: 'center',
        alignItems: 'center'
    }
})