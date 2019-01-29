/* eslint-disable no-dupe-class-members */
import { Route, Redirect } from "react-router-dom";
import React, { Component } from "react";
import TasksBoard from "./tasks/TasksBoard";
import ArticlesBoard from "./articles/ArticlesBoard";
//import ConnectionsBoard from "./connections/ConnectionsBoard";
//import EventsBoard from "./events/EventsBoard";
import MessagesBoard from "./messages/MessagesBoard";
import TasksManager from "../modules/TasksManager";
import ArticlesManager from "../modules/ArticlesManager";
//import ConnectionsManager from "../modules/ConnectionsManager";
import MessagesManager from "../modules/MessagesManager";
//import EventsManager from "../modules/EventsManager";
import TasksForm from "./tasks/TasksForm";
// import ArticlesForm from "./tasks/ArticlesForm";
// import ConnectionsForm from "./tasks/ConnectionsForm";
// import EventsForm from "./tasks/EventsForm";


export default class ApplicationViews extends Component {

  constructor() {
    super();
    this.state = {
      articles: [],
      messages: [],
      connections: [],
      events: [],
      tasks: []
    }
    this.postNewMessage = this.postNewMessage.bind(this);
  }



  deleteTask = id => {
    return fetch(`http://localhost:5002/tasks/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(() => fetch(`http://localhost:5002/tasks`))
      .then(response => response.json())
      .then(tasks =>
        this.setState({
          tasks: tasks
        })
      );
  };

  addTask = task =>
  TasksManager.post(task)
    .then(() => TasksManager.getAll())
    .then(tasks =>
      this.setState({
        tasks: tasks
      })
    );


  componentDidMount() {

    TasksManager.getAll().then(allTasks => {
      this.setState({
        tasks: allTasks
      });
    });

    MessagesManager.getAll()
    .then(messages => this.setState({
      messages: messages
    }));

  }

  postNewMessage(messageObj) {
    MessagesManager.post(messageObj)
    .then(() => MessagesManager.getAll()
    .then(messages => this.setState({
      messages: messages
    })));
  }

  componentDidMount() {
    MessagesManager.getAll()
      .then(messages => this.setState({
        messages: messages
      }));
    ArticlesManager.getAll()
      .then(allArticles => {
        this.setState({
          articles: allArticles
        });
      });
  }

  render() {
    console.log(this.state)
    return (
      <React.Fragment>

        <Route
          exact path="/" render={props => {
            return <ArticlesBoard {...props} articles={this.state.articles}/>
            // Remove null and return the component which will show news articles
          }}
        />

        <Route
          path="/friends" render={props => {
            return null
            // Remove null and return the component which will show list of friends
          }}
        />

        <Route
          path="/messages" render={props => {
            return <MessagesBoard postNewMessage={this.postNewMessage} messages={this.state.messages} />
            // Remove null and return the component which will show the messages
          }}
        />

        <Route
          path="/tasks" render={props => {
            return (
              <TasksBoard
                {...props}
                deleteTask={this.deleteTask}
                tasks={this.state.tasks}
              />
            );
          }}
        />
        <Route
          path="/tasks/new"
          render={props => {
            return (
              <TasksForm
                {...props}
                addTask={this.addTask}
              />
            );
          }}
        />

      </React.Fragment>
    );
  }
}
