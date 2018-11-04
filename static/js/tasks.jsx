"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import EditTaskPage from './edittask.jsx';




class TasksPage extends React.Component {
  constructor () {
    super ();
    this.state = {
        taskData: [],
        EOD: {}
    };
  }

  updateTaskData (arg) {
      console.log(arg)

      this.setState( {taskData: arg} );
  }

  componentWillMount() {
    if (session.current_username === 'None' ) {
      this.props.history.push('/')
    }
  }
  componentDidMount () {
    if (session.current_username !== 'None'){
        this.fetchTaskData()
        this.fetchEOD()
      }
      // console.log("EOD from within the didMount: ",this.state.EOD)
  }
  assemble_date(dt_dict) {
  // const d = new Date(dt_dict."year", dt_dict."month",
  //  dt_dict."day", dt_dict."hours", dt_dict."minutes",
  //   dt_dict."seconds", dt_dict."milliseconds");

  const d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

  return d
  }; 



  fetchTaskData  = () => {
    let that = this
    console.log("TasksPage.this: ",this)
    fetch('/get-tasks.json')
    .then(response => response.json())
    .then(data => this.setState( {taskData:data} ) )

  }

  fetchEOD = () => {
    fetch('/get-eod.json')
    .then(response => response.json())
    .then(data => this.setState( {EOD:this.assemble_date(data)} ) )
    // console.log('EOD is: ',this.state.EOD)
  }

  getTodayTasks = (tasksData) => {
    let todayTasks = []
    todayTasks = tasksData.filter ( task => this.assemble_date(task.due_date) < this.state.EOD 
                      && task.is_complete === false)
    return todayTasks



  }
  getLaterTasks = (tasksData) => {
    let laterTasks = []
    laterTasks = tasksData.filter ( task => this.assemble_date(task.due_date) >= this.state.EOD 
                      && task.is_repeating === false 
                      && task.is_complete === false)
    return laterTasks



  }
  getCompletedTasks = (tasksData) => {
    let completeTasks = []
    completeTasks = tasksData.filter ( task => task.is_complete === true )
    return completeTasks



  }
  render () {

    return (
      <div>
        <AddTask />
        <TaskBlock updateTaskData={this.updateTaskData} tasks={this.getTodayTasks(this.state.taskData)} blockName='Due Today' showQuickAdd='True' done={false}/>
        <TaskBlock updateTaskData={this.updateTaskData} tasks={this.getLaterTasks(this.state.taskData)} blockName='Due Later'  done={false}/>
        <TaskBlock updateTaskData={this.updateTaskData} tasks={this.getCompletedTasks(this.state.taskData)} 
          blockName="Completed" 
          showClearCompleted="True"
          done={true}
          />
      </div>
    )
  }
}

// {this.props.doneBtn && <QuickAdd /> }
// {this.props.undoBtn && <QuickAdd /> }
// // thing
// <div class="add-a-task">
//   <a href="/new_task"><button id="add-a-task-btn">Add a Task</button></a>
// </div>


class AddTask extends React.Component {
  render() {
    return (
      <div>
        <Link to="/new-task">
        <button id="add-a-task-btn"> Add a Task</button>
        </Link>
      </div>
      )
  }


}
class TaskBlock extends React.Component {


  render () {
    return (

      <div className="today-tasks">
        <h3>{this.props.blockName}</h3>
        <span id="EOD-span" className="small-text remove">EOD is:  sometime UTC</span> 
        <ul>
          { this.props.tasks.map ((task) => {
                     return (
                        <li key={task.task_id}>
                          <Task updateTaskData={this.updateTaskData} 
                                task={task} done={this.props.done} />
                        </li>
                      )
                    }   
                )
          }
        </ul>
        {this.props.showQuickAdd && <QuickAdd /> }
        {this.props.showClearCompleted && <ClearCompleted /> }

  
      </div>
      )
  }
}

class QuickAdd extends React.Component {
  render () {
    return (
      <div className="quick-add">
    <form method="POST" action="/add_new_task">
      <input type="text_box" 
           required 
           name="msg" />

      <input hidden name="duedate" defaultValue="" />
      <input type="submit" defaultValue="Quick Add" />
      <p id="quick-add-info">
        * Quick add due date auto completes to today
      </p>
    </form>
  </div>)
  }

}
class ClearCompleted extends React.Component {
  render () {
    return <a href="/clear-all-completed">Clear Completed</a>
  }
}

class CompleteTaskBtn extends React.Component {

  completeTask() {
    // put the thing that makes it not do the thing
    console.log("attempting to complete task")
    console.log(updateTaskData)
    fetch()
};


  render () {
    let completeTaskRoute = this.props.task_id.toString()
    return (
      <form className="in-line" action="/complete-task" method="POST">
        <input hidden name="task_id" defaultValue={completeTaskRoute} />
        <input className='taskbtn' type="submit" name="complete" value="Done" onClick={this.completeTask}/>
      </form>
    )
  }
}
// {this.props.done && <CompleteTaskBtn task_id={this.props.task.task_id} /> }
// 

class UndoCompleteTaskBtn extends React.Component {

  undoComplete() {
    // put the thing that makes it not do the thing
    console.log("attempting to complete task")
    fetch()
  };


  render () {
    let undoCompleteRoute = this.props.task_id.toString()
    return (
      <form className="in-line" action="/undo_complete" method="POST">
        <input hidden name="task_id" defaultValue={undoCompleteRoute} />
        <input className='taskbtn' type="submit" name="complete" value="Undo" onClick={this.undoComplete}/>
      </form>
    )
  }
}
// <form action="/undo_complete" method="POST">
//        <input hidden name="task_id" 
//        value={{task.task_id}}>
//    <li class="completed-task-li">
//        <input type="submit" value="Undo">
        // </form>


class Task extends React.Component {
  constructor () {
    super ();
    this.state = {
      deleteIconVisibility: ""
    };
  }
  undoBtn = () => {

  }
  doneBtn = () => {

  }

  showDeleteIcon() {
    this.setState( {deleteIconVisibility: none})

  }
  hideDeleteIcon() {
    this.setState( {deleteIconVisibility: hidden})

  }
  

  render() {
    let completeTaskRoute = this.props.task.task_id.toString()
    let edit_task_route = 'edit_task/' + this.props.task.task_id.toString()
    let delete_task_route = 'delete-task-' + this.props.task.task_id.toString()
    // let _getTasks = this.getTasks
// {this.props.done && <CompleteTaskBtn task_id={this.props.task.task_id} /> }
    const editTaskRoute = '/edit-task/' + this.props.task.task_id

    return (
      <div>
        {!this.props.done && <CompleteTaskBtn updateTaskData={this.updateTaskData} task_id={this.props.task.task_id} /> }
        {this.props.done && <UndoCompleteTaskBtn updateTaskData={this.updateTaskData} task_id={this.props.task.task_id} /> }


        <Link className="task-msg in-line" to={editTaskRoute}>  {this.props.task.msg} </Link>

        <a href={delete_task_route}> 
          <i className="far fa-times-circle "></i> 
        </a>
      </div>


      
    );

  };
}
class DeleteTask extends React.Component {
  constructor () {
    super ();
    this.state = {
      taskID: null
    };
  }
    DeleteTask  = () => {
    const delRoute = 'delete-task-' + this.props.task_id
    fetch(delRoute)
    .then(response => response.json())

  }

  render () {

    return (
      <p> hello</p>

      )
  }
}

export default withRouter(TasksPage)




