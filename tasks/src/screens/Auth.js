import React, { Component } from 'react';
import { ImageBackground, Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import login from '../../wwwroot/assets/imgs/login.jpg';
import commonStyles from '../../commonStyles';
import axios from 'axios';

import { server, showError, showSuccess } from '../Common';

export default class Auth extends Component {
    
    state = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        stageNew: false
    }

    signinOrSignup = () => {
        if(this.state.stageNew){
            this.signUp();
        } else{
            this.signin();
        }
    }

    signin = async () => {
        const res = await axios.post(`${server}/signin`, {
            email: this.state.email,
            password: this.state.password,
        }).then(res => {
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home');
        }).catch(error => {
            showError(error)
        });
    }

    signUp = async () => {      
        await axios.post(`${server}/signup`,   {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
            })
            .then(resp => {
                showSuccess('Usuário cadastrado!')
                this.setState({ stageNew: false }) })
            .catch(error => {
                showError(error);
            });
    }

    render(){

        const validations = [];

        validations.push(this.state.email && this.state.email.includes("@"));
        validations.push(this.state.password && this.state.password.length >= 6);
        
        if(this.state.stageNew){
            validations.push(this.state.name && this.state.name.trim().length >= 3);
            validations.push(this.state.confirmPassword && this.state.password === this.state.confirmPassword);
        }

        const isValidForm = validations.reduce((t, a) => t && a)

        return(

            <ImageBackground source={login} style={styles.background}>
                <Text style={styles.title}> TASKS </Text>
                <View style={styles.formContainer}>
                <Text style={styles.subTitle}> {this.state.stageNew ? 'Crie sua conta' : 'Informe seus dados'} </Text>
                    {
                        this.state.stageNew && 
                        <TextInput placeholder='Nome' 
                            value={this.state.name} 
                            style={styles.input} 
                            onChangeText={name => this.setState({name})}>
                        </TextInput>
                    }
                    <TextInput placeholder='E-mail' 
                               value={this.state.email} 
                               style={styles.input} 
                               onChangeText={email => this.setState({email})}>
                    </TextInput>
                    <TextInput placeholder='Senha' 
                               value={this.state.password} 
                               style={styles.input} 
                               onChangeText={password => this.setState({password})}
                               secureTextEntry={true}>
                    </TextInput>
                    {
                        this.state.stageNew && 
                        <TextInput placeholder='Confirme sua senha' 
                            value={this.state.confirmPassword} 
                            style={styles.input} 
                            onChangeText={confirmPassword => this.setState({confirmPassword})}>
                        </TextInput>
                    }
                    <TouchableOpacity onPress={this.signinOrSignup}
                                      disabled={!isValidForm}>
                        <View style={[styles.button, isValidForm? {} : { backgroundColor: '#AAA'}]}>
                        <Text style={styles.buttonText}>{ this.state.stageNew ? 'Registrar' : 'Entrar' }</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }} 
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                    { this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?' }
                    </Text>
                </TouchableOpacity>
            </ImageBackground>

        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subTitle: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        width: '90%',

    },  
    input: {
        marginTop: 10,
        backgroundColor: '#FFF'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20
    }
})

