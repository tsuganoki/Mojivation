"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';


export class TasksPage extends React.Component {
  constructor () {
    super ();
    this.state = {
        taskData: [],
        EOD: {}
    };
  }

  updateTaskData (argument) {
      this.setState( {taskData: argument} );
  }
  componentDidMount () {
    this.fetchTaskData()
    this.fetchEOD()
  }
  assemble_date(dt_dict) {
  // const d = new Date(dt_dict."year", dt_dict."month",
  //  dt_dict."day", dt_dict."hours", dt_dict."minutes",
  //   dt_dict."seconds", dt_dict."milliseconds");

  var d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

  return d
  }

  fetchTaskData  = () => {
    let that = this
    console.log("TasksPage.this: ",this)
    fetch('/get-tasks.json')
    .then(response => response.json())

    .then(data => this.setState( {taskData:data} ) )

  }

  fetchEOD () {
    fetch('/get-eod.json')
    .then(response => response.json())

    .then(data => this.setState( {EOD:this.assemble_date(data)} ) )
    console.log('EOD is: ',this.state.EOD)
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
        <TaskBlock tasks={this.getTodayTasks(this.state.taskData)} blockName='Due Today' showQuickAdd='True' done={false}/>
        <TaskBlock tasks={this.getLaterTasks(this.state.taskData)} blockName='Due Later'  done={false}/>
        <TaskBlock tasks={this.getCompletedTasks(this.state.taskData)} 
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
        <button id="add-a-task-btn"> Add a Task</button>
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
                          <Task task={task} done={this.props.done} />
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

    return (
      <div>
        {!this.props.done && <CompleteTaskBtn task_id={this.props.task.task_id} /> }
        {this.props.done && <UndoCompleteTaskBtn task_id={this.props.task.task_id} /> }
        <a className="task-msg in-line" href={edit_task_route}>  {this.props.task.msg} </a>

        <a href={delete_task_route} >
          <i className="fa fa-times-circle-o ex-cirle" 
          aria-hidden="true" 
          alttext="delete task"> </i>
        </a>
      </div>


      
    );

  };
}



