/* eslint-disable no-dupe-class-members */
import { Route } from "react-router-dom";
import React, { Component } from "react";
// import Login from "./authentication/Login";
import TasksBoard from "./tasks/TasksBoard";
import ArticlesBoard from "./articles/ArticlesBoard";
//import ConnectionsBoard from "./connections/ConnectionsBoard";
//import EventsBoard from "./events/EventsBoard";
import MessagesBoard from "./messages/MessagesBoard";
import TasksManager from "../modules/TasksManager";
import ArticlesManager from "../modules/ArticlesManager";
import ConnectionsManager from "../modules/ConnectionsManager";
import MessagesManager from "../modules/MessagesManager";
//import EventsManager from "../modules/EventsManager";
import TasksForm from "./tasks/TasksForm";
import UsersManager from "../modules/UsersManager";
// import ArticlesForm from "./tasks/ArticlesForm";
// import ConnectionsForm from "./tasks/ConnectionsForm";
// import EventsForm from "./tasks/EventsForm";


export default class ApplicationViews extends Component {

state = {
      articles: [],
      messages: [],
      connections: [],
      events: [],
      tasks: [],
      users: []
    };


// *********************************ARTICLES******************************************
addArticle = (articleObject) => {
  return ArticlesManager.post(articleObject)
    .then(() => ArticlesManager.getAll())
    .then(articles =>{
      this.setState({
        articles: articles
      })
    })
};

deleteArticle = articleId => {
  ArticlesManager.delete(articleId)
    .then(() => ArticlesManager.getAll())
    .then(articles =>
      this.setState({
        articles: articles
      })
    );
};

// *********************************MESSAGES******************************************

postNewMessage = messageObj => {
  MessagesManager.post(messageObj)
  .then(() => MessagesManager.getAll()
  .then(messages => this.setState({
    messages: messages
  })));
}

deleteMessage = id => {
  MessagesManager.delete(id)
  .then(() => MessagesManager.getAll()
  .then(messages => this.setState({
    messages: messages
  })));
}

editMessage = (messageObj, id) => {
  MessagesManager.put(messageObj, id)
  .then(() => MessagesManager.getAll()
  .then(messages => this.setState({
    messages: messages
  })));
}

// *********************************CONNECTIONS******************************************

postNewConnection = connectionObj => {
  ConnectionsManager.post(connectionObj)
  .then(() => ConnectionsManager.getEmbed("user")
  .then(connections => this.setState({
    connections: connections
  })));
}

// *********************************TASKS******************************************
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

  addTask = task =>{
  return TasksManager.post(task)
    .then(() => TasksManager.getAll())
    .then(tasks =>
      this.setState({
        tasks: tasks
      })
    );
    }

    addCheckChange = (changedObj, id) => {
      console.log(id);
      return TasksManager.patch(changedObj, id)
      .then(() => TasksManager.getAll()
      .then(response =>
       this.setState({
         tasks: response
        })
      )
       )
    }

  componentDidMount() {
    sessionStorage.setItem("userId", 1);
    ArticlesManager.getAll()
      .then(allArticles => {
        allArticles.sort(function(a, b){
        return Date(a.timestamp) - Date(b.timestamp);
      })
        this.setState({
          articles: allArticles
        });
      });
    TasksManager.getAll().then(allTasks => {
      this.setState({
        tasks: allTasks
      });
    });
    MessagesManager.getAll()
      .then(messages => this.setState({
        messages: messages
      }));
    UsersManager.getAll()
      .then(users => this.setState({
        users: users
      }));
    ConnectionsManager.getEmbed("user")
      .then(connections => this.setState({
        connections: connections
      }));
    }

  render() {
    return (
      <React.Fragment>

        <Route
          exact path="/" render={props => {
            return <ArticlesBoard {...props} articles={this.state.articles} deleteArticle={this.deleteArticle} addArticle={this.addArticle} />
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
            return <MessagesBoard {...props}
              postNewMessage={this.postNewMessage}
              deleteMessage={this.deleteMessage}
              editMessage={this.editMessage}
              postNewConnection={this.postNewConnection}
              messages={this.state.messages}
              users={this.state.users}
              connections={this.state.connections} />
          }}
        />

        <Route
          path="/tasks"
          render={props => {
            return (
              <TasksBoard
                {...props}
                deleteTask={this.deleteTask}
                tasks={this.state.tasks}
                addCheckChange={this.addCheckChange}
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
