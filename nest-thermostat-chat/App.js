
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  Image
} from 'react-native';

import Header from './src/Header';

const CHANNEL = 'Home';
export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      open: false,
      typing: '',
      messages: []
    };
    this.subscriber = new WebSocket('ws://localhost:1880/chat/send');
    this.publisher = new WebSocket('ws://localhost:1880/chat/receive');
    this.emit = this.emit.bind(this);
  }

  computeNow() {
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ampm = hh >= 12 ? 'pm' : 'am';
    hh = hh % 12;
    return hh+':'+mm+' '+ampm;
  }

  componentDidMount() {
    this.publisher.onopen = () => this.subscriber.send( JSON.stringify({ timestamp : this.computeNow(), sender : 'me', payload: '(re)init'}) );
    this.subscriber.onmessage = ({data}) => {
          var message = JSON.parse(data); 
          message.timestamp = this.computeNow();
          this.setState({ messages: [ message, ...this.state.messages] });

          }
  }

  emit() {
    this.setState(prevState => ({ open: !prevState.open }));
  
  }

  sendMessage = async () => {
    // read message from component state
    const message = { timestamp : this.computeNow(), sender : 'me', payload : this.state.typing } ;
 
    // send message to our channel, with sender name
    await this.publisher.send( JSON.stringify(message) );

    // set the component state (clears text input)
    this.setState({
      typing: '',
      messages: [ message , ...this.state.messages ]
    });
  };

  renderItem({ item }) {
 
    if ( item.sender === 'me' ) 
      return (
        <View style={ [ styles.row, { alignSelf : 'flex-start' } ] } >
          <Image style={styles.avatar} source={require('./assets/me.png')} />
          <View style={[ styles.rowText, {backgroundColor : '#ccffcc' }] }>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.payload}</Text>
          </View>  
          <View style={styles.timeText} >
            <Text style={styles.timeMessage}>{item.timestamp}</Text>
          </View>    
        </View>
      );
    else 
      return (
        <View style={ [ styles.row, { alignSelf : 'flex-end' } ] } > 
          <View style={styles.timeText} >
            <Text style={styles.timeMessage}>{item.timestamp}</Text>
          </View>         
          <View style={[ styles.rowText, {backgroundColor : '#ffffcc' }] }>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.payload}</Text>
          </View>
          <Image style={styles.avatar} source={require('./assets/home.png')} />     
        </View>
    );
  }

  /* 
     VirtualizedList: missing keys for items, 
     make sure to specify a key property on each item or provide a custom keyExtractor.
     keyExtractor={(item, index) => index.toString()} 
  */
  render() {
    return (
      <View style={styles.container}>
        <Header title={CHANNEL} />
        <FlatList
          data={this.state.messages}
          renderItem={this.renderItem}
          inverted
          keyExtractor={ (item, index) => index.toString() }
        />
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.footer}>
            <TextInput
              value={this.state.typing}
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Type something nice"
              onChangeText={text => this.setState({ typing: text })}
            />
            <TouchableOpacity onPress={this.sendMessage}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  row: {
    flexDirection: 'row',
    padding: 5,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
    alignSelf : 'center'
  },
  rowText: {
    backgroundColor : '#1E90FF',
    borderRadius : 10,
    padding : 8,
  },
  timeText: {
    backgroundColor : '#fff',
    borderRadius : 10,
    padding : 8,
    alignSelf : 'center'
  },
  message: {
    fontSize: 15,
  },
  timeMessage: {
    fontSize: 15,
    color: '#9999ff'
  },
  sender: {
    fontWeight: 'bold',
    paddingRight: 10
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eee'
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20
  }
});

