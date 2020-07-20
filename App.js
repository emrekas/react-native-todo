import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  View
} from 'react-native';

const url = 'https://todo.crudful.com/tasks';

const App = () => {

  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const inputRef = useRef(null);

  const createTask = () => {
    setLoading(true);
    fetch(url, {
      method: 'POST',
      headers: {
        cfAccessKey: '94d934270343f646dbabc0484cd20bc2dab2a65b',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: task })
    })
      .then((response) => response.json())
      .then((response) => {
        setTaskList([...taskList, response].reverse())
        setTask('');
      })
      .finally(() => setLoading(false));
  }

  const deleteTask = task => {
    setLoading(true);
    fetch(`${url}/${task.id}`, {
      method: 'DELETE',
      headers: {
        cfAccessKey: '94d934270343f646dbabc0484cd20bc2dab2a65b',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response)
      .then(() => {
        setTaskList(taskList.filter(item => item.id != task.id))
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    inputRef.current?.focus();
    setLoading(true);
    fetch(url, {
      method: 'GET',
      headers: {
        cfAccessKey: '94d934270343f646dbabc0484cd20bc2dab2a65b'
      },
    })
      .then((response) => response.json())
      .then((response) => setTaskList(response.results))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        My Todo List
      </Text>

      <TextInput value={task} onChangeText={setTask} ref={inputRef} placeholder="Add Task" style={styles.textInput} />
      <Button title="Add Task" color="dodgerblue" onPress={createTask} />

      {
        loading ? <ActivityIndicator size='large' color='blue' /> :
          taskList.map((task) => {
            return (
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text key={task.id} style={{ ...styles.task, flex: 1 }}> {task.title} </Text>
                <Button title="X" onPress={() => deleteTask(task)} />
              </View>
            )
          })
      }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15
  },
  title: {
    flexDirection:'row',
    justifyContent: 'center',
    alignSelf:'center',
    fontSize: 25,
  },
  textInput: {
    fontSize: 18,
    height: 60,
    backgroundColor: 'gray',
    padding: 15,
    margin: 10
  },
  task: {
    fontSize: 20,
    color: 'black',
    margin: 5,
    padding: 10,
    backgroundColor: 'whitesmoke'
  }
});

export default App;
