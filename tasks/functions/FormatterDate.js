import React from 'react';
import { Text } from 'react-native';

import moment from 'moment';
import 'moment/locale/pt-br';

export default props => {

    const formatter = (date) => {
        return moment(date).locale('pt-br').format('dddd, D [de] MMM [de] YYYY');
    };
    
    return <Text style={ props.style }>{ formatter(props.Date) }</Text>
}