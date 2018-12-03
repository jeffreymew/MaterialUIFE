import React from "react";
import { COMPLETED, IN_PROGRESS } from "../constants/index";
import moment from "moment";

import List from "@material-ui/icons/List";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import AssignmentLate from "@material-ui/icons/AssignmentLate";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import Tasks from "components/Tasks/Tasks.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";

import * as actionCreators from "actions/data.jsx";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

function mapStateToProps(state) {
  return {
    token: state.auth.token
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };

    this.date =
      props.tasks.length > 0
        ? moment.utc(props.tasks[0].date).format("MMMM DD, YYYY")
        : moment().format("MMMM DD, YYYY");
    
    this.state = {
        tasks: this.props.tasks
    }
  }

  updateTaskIdCallback(task, id) {
    const index = this.state.tasks.indexOf(task);
    this.state.tasks[index].id = id;
    this.updateTasks();
  }

  addTask(task_val, status) {
    console.log("Adding Task!"); //NO ID??? because async?? pass all tasks in and have storeTask update the id???
    const newTask = { id: null, task: task_val, date: new Date(), status: status };
    this.props.storeTask(this.props.token, newTask, this.updateTaskIdCallback.bind(this)); //Pass in call back function?
    this.state.tasks.push(newTask);
    this.updateTasks();
    return newTask;
  }

  deleteTask(task) {
    console.log(task.id);
    this.props.deleteTask(this.props.token, task.id);

    const currentIndex = this.state.tasks.indexOf(task);
    this.state.tasks.splice(currentIndex, 1);
    this.updateTasks();
  }

  editTask(task, task_val, status) {
    this.props.editTask(this.props.token, task.id, task_val, status);

    const index = this.state.tasks.indexOf(task);
    this.state.tasks[index].status = status;
    this.state.tasks[index].task = task_val;
    this.updateTasks();
  }

  updateTasks() {
    this.setState({
        tasks: this.state.tasks
    })
  }

  render() {
    return (
        <GridItem xs={12} sm={12} md={8}>
          <CustomTabs
            title={this.props.name}
            headerColor="primary"
            tabs={[
              {
                tabName: "All",
                tabIcon: List,
                tabContent: (
                  <Tasks
                    tasks={this.state.tasks}
                    newTasksCompleted={false}
                    email={this.props.email}
                    canEdit={this.props.canEdit}
                    addTask={this.addTask.bind(this)}
                    deleteTask={this.deleteTask.bind(this)}
                    editTask={this.editTask.bind(this)}
                    updateTasks={this.updateTasks.bind(this)}
                  />
                )
              },
              {
                tabName: "Completed",
                tabIcon: CheckCircleOutline,
                tabContent: (
                  <Tasks
                    tasks={this.state.tasks.filter(
                      task => task.status === COMPLETED
                    )}
                    newTasksCompleted={true}
                    email={this.props.email}
                    canEdit={this.props.canEdit}
                    addTask={this.addTask.bind(this)}
                    deleteTask={this.deleteTask.bind(this)}
                    editTask={this.editTask.bind(this)}
                    updateTasks={this.updateTasks.bind(this)}
                  />
                )
              },
              {
                tabName: "TODO",
                tabIcon: AssignmentLate,
                tabContent: (
                  <Tasks
                    tasks={this.state.tasks.filter(
                      task => task.status === IN_PROGRESS
                    )}
                    newTasksCompleted={false}
                    email={this.props.email}
                    canEdit={this.props.canEdit}
                    addTask={this.addTask.bind(this)}
                    deleteTask={this.deleteTask.bind(this)}
                    editTask={this.editTask.bind(this)}
                    updateTasks={this.updateTasks.bind(this)}
                  />
                )
              }
            ]}
          />
        </GridItem>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCard);