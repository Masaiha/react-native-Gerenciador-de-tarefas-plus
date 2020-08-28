import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyles from '../../commonStyles';

import FormattedDate from '../../functions/FormatterDate';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default props => {

    const isDone = props.doneAt != null ? { textDecorationLine: 'line-through' } :false

    const getRightContent = () => {
        return(
            <TouchableOpacity style={styles.right} 
                              onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name="trash" size={30} color="#FFF" ></Icon>
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return(
            <View style={styles.left}>
                <Icon name="trash" size={30} color="#FFF" style={styles.excludeIcon}></Icon>
                <Text style={styles.excludeText}>Excluir</Text>  
            </View>
        )
    }

    return(
        <Swipeable 
            renderLeftActions={getLeftContent}
            renderRightActions={getRightContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback  
                    onPress={() => props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>
                        { getCheckView(props.doneAt) }
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, isDone]}>{ props.desc }</Text>
                    <FormattedDate style={styles.date} date />
                </View>
            </View>
        </Swipeable>
    )
}

function getCheckView(donaAt) {

    if(donaAt != null){
        return(
            <View style={styles.done}>
                <Icon name="check" size={20} color="#FFF" />
            </View>
        )
    }else{
        return(
            <View style={styles.pending}>
                
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4D7031',
        alignContent: 'center', 
        justifyContent: 'center',
        padding: 2
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15,
        fontWeight: 'bold'
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText, 
        fontSize: 12       
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
})