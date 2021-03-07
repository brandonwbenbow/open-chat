import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, TextInput, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import publicIP from 'react-native-public-ip';

const User = {
  id: 0,
  ip: null,
  messages: [
    {key: 0, user: 0, text: "Hello User 1"},
    {key: 1, user: 1, text: "Hello User 0, How are you?"}
  ],
  names: [
    "Name 1",
    "Name 2"
  ]
}

const IncomingMessages = [

];

publicIP()
  .then(ip => {    
    User.ip = ip;
  })
  .catch(error => {
    console.log(error);
    // 'Unable to get IP address.'
  });

function CustomTextInput(props) {
  const [value, onChangeText] = useState('');

  function UpdateMessages(event) {
    if(value == '')
      return

    props.send(value);
    onChangeText('')
  }

  return (
    <View style={[styles.inputView, Platform.OS === 'ios' ? {paddingBottom: 40} : {}]}>
      <TextInput
        style={styles.customTextInput}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        keyboardAppearance={'default'}
        onSubmitEditing={UpdateMessages}
        enablesReturnKeyAutomatically={true}
        returnKeyType={'send'}
        placeholder={'Message...'}
        placeholderTextColor={'#c4c4c4'}
      />
      <TouchableOpacity onPress={UpdateMessages} style={styles.testButton}>
        <Text style={{color: '#c4c4c4'}}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

function MessageView(props) {

  var Data = props.messages;

  const renderItem = (({item, index}) => {
    if(index == Data.length - 1)
    {
      return(
        <Text style={[item.user == 0 ? styles.rightText : styles.leftText, styles.lastMessage]}>
          {item.text}
        </Text>
      );
    }
    else
    {
      return(
        <Text style={[item.user == 0 ? styles.rightText : styles.leftText]}>
          {item.text}
        </Text>
      );
    }
  })

  return (
    <View style={styles.messageView}>
      <View style={styles.header}>
        <Text style={{color: '#c4c4c4', fontSize: 20}}>{User.names[1]}</Text>
      </View>
      <SafeAreaView style={{display: 'flex', flex: 1,}}>
        <FlatList style={styles.messageHolder}
          data={Data}
          renderItem={renderItem}
          keyExtractor={item => item.key.toString()}
        />
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  const [messages, addMessage] = useState(User.messages);

  useEffect(() => {
    if(IncomingMessages.length > 0)
      AddNewMessage(IncomingMessages.shift().text);
  });

  function AddNewMessage(msg) {
    addMessage([...messages, {key: messages[messages.length - 1].key + 1, user: '0', text: msg}]);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <MessageView messages={messages}/>
      <CustomTextInput send={AddNewMessage}/>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    flexShrink: 1,
    width: "100%",
    backgroundColor: '#353535',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  messageView: {
    flex: 1,
    width: '100%',
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    color: '#ffffff',
  },
  messageHolder: {
    padding: 15,
    flex: 1,
    color: '#c4c4c4'
  },
  leftText: {
    alignSelf: 'flex-start',
    color: '#c4c4c4',
    backgroundColor: '#151515',
    padding: 10,
    marginRight: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  rightText: {
    alignSelf: 'flex-end',
    color: '#c4c4c4',
    backgroundColor: '#151515',
    padding: 10,
    marginLeft: 20,
    borderRadius: 10,
    marginBottom: 5,
  },
  header:  {
    paddingTop: 35,
    height: 95,
    backgroundColor: '#353535',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10, 
    backgroundColor: '#151515',
    color: '#c4c4c4',
    borderRadius: 50,
    height: 35,
    marginRight: 10
  },
  lastMessage: {
    marginBottom: 45,
  },
  customTextInput: {
    flex: 1, 
    padding: 10,
    margin: 10,
    backgroundColor: '#151515',
    borderRadius: 50,
    height: 35,
    color: '#c4c4c4'
  }
});
