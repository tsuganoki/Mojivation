"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import EditTaskPage from './edittask.jsx';




class TasksPage extends React.Component {
  constructor () {
    super ();

    this.fetchTaskData = this.fetchTaskData.bind(this);
    
    this.state = {
        taskData: [],
        EOD: {}
    };

  }

  redirectToCollectKao = () => {
      console.log("from redirect function, today tasks are: ",this.getTodayTasks(this.state.taskData) )
    if (this.getTodayTasks(this.state.taskData).length === 0) {
      console.log("if stattement entered, trying to redirect ")

      document.location.href = '/collect-kao'
    }

  }

  // updateTaskData (arg) {
  //     console.log("the argument is: ", arg)
  //     console.log("updateTaskData CALLED")


  //     // this.fetchTaskData();
  // }
  

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
  
    const d = new Date(dt_dict.year, dt_dict.month, dt_dict.day, dt_dict.hours, dt_dict.minutes, dt_dict.seconds, dt_dict.milliseconds);

    return d
  } 



  fetchTaskData  = () => {
    // let that = this
    console.log("TasksPage.this: ",this)
    console.log("calling fetchTaskData function")
    return fetch('/get-tasks.json')
    .then(response => response.json())
    .then(data => {
      this.setState( {taskData:data} );
      console.log("new data after set state is: ", data)

    } )


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
    console.log("printing today tasks:", todayTasks)
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

        <TaskBlock fetchTaskData={this.fetchTaskData} onUpdate={this.redirectToCollectKao} tasks={this.getTodayTasks(this.state.taskData)} blockName='Due Today' showQuickAdd='True' done={false}/>
        <TaskBlock fetchTaskData={this.fetchTaskData} onUpdate={this.redirectToCollectKao} tasks={this.getLaterTasks(this.state.taskData)} blockName='Due Later'  done={false}/>
        <TaskBlock fetchTaskData={this.fetchTaskData} tasks={this.getCompletedTasks(this.state.taskData)} 
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
      <div id="add-a-task">
        <Link to="/new-task">
        <button className="add-a-task-btn btn btn-secondary btn-dark"> Add a Task</button>
        </Link>
      </div>
      )
  }
}


class TaskBlock extends React.Component {


  render () {
    return (
      <div className="card col-5">
  {/* make className configurable because they're not all today's tasks*/}
        <h3>{this.props.blockName}</h3>
        <span id="EOD-span" className="small-text remove">EOD is:  sometime UTC</span> 
        <ul className="list-group">
          { 
            this.props.tasks.map ((task) => {
              return (
                <li className="" key={task.task_id}>
                  <Task fetchTaskData={this.props.fetchTaskData} onUpdate={this.props.onUpdate} task={task} done={this.props.done} />
                </li>
              )
            })
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
    <table><tbody><tr><td className="td-wide">

      <div className="form-group">
        <input className="form-control" type="text_box" 
             required 
             placeholder="Quick Add"
             name="msg" />
       </div>

      <input className="remove" name="duedate" defaultValue="" />
      </td><td >
      <div className="form-group">            
        <input className="btn btn-secondary" type="submit" defaultValue="Quick Add" />
        <p id="quick-add-info">
        </p>
      </div>
        </td></tr></tbody></table>  
    </form>
  </div>)
  }

}
class ClearCompleted extends React.Component {
  render () {
    return (
      <button className="btn btn-secondary btn-sm">
        <a href="/clear-all-completed">Clear Completed</a>
      </button>
      )
  }
}


// Consider combining with UndoCompleteTaskBtn and passing a prop specifying what URL to hit and text to render and maybe className
class CompleteTaskBtn extends React.Component {

  // Consider making an arrow function and then you don't need to bind in TasksPage
  completeSpecificTask(task_id) {

    fetch('/complete-task', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {task_id: task_id} )
    }).then( data => this.props.fetchTaskData() )
    .then( () => this.props.onUpdate());
     
  }


  render () {
    let completeTaskRoute = this.props.task_id.toString()
      // <form className="in-line" action="/complete-task" method="POST">
        // <input hidden name="task_id" defaultValue={completeTaskRoute} />
        // <input className='taskbtn' type="submit" name="complete" value="Done" onClick={this.completeTask}/>
      // </form>
    return (
            <button className="in-line taskbtn btn btn-secondary" onClick={ () => {
              console.log(this.props.task_id);
              this.completeSpecificTask(this.props.task_id) } }> Done </button>

    )
  }
}
// {this.props.done && <CompleteTaskBtn task_id={this.props.task.task_id} /> }
// 

class UndoCompleteTaskBtn extends React.Component {

  
  undoSpecificTask(task_id) {
    console.log("running undoSpecificTask function")
    // console.log(JSON.stringify( {task_id: task_id} ) )

    fetch('/undo-complete-task', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {task_id: task_id} )
    }).then( data => this.props.fetchTaskData() ); //This solves the "data race problem"!
    
     
  }



  render () {
    // console.log("props for undoCompleteTaskBtn: ",this.props)
    // let undoCompleteRoute = this.props.task_id.toString()
  
      // 
    
    //    <form className="in-line" action="/undo_complete" method="POST">
      //   <input hidden name="task_id" defaultValue={undoCompleteRoute} />
        // <input className='taskbtn' type="submit" name="complete" value="Undo" onClick={this.undoComplete}/>
       //</form>
    return (
      <button className="in-line taskbtn btn btn-secondary" onClick={ () => {console.log(this.props.task_id);this.undoSpecificTask(this.props.task_id) } }> Undo </button>
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

      deleteIconVisibility: false
    };
  }
 

  showDeleteIcon = () => {
    // console.log("mouseover")
    // console.log(this.state)
    // console.log(this.state.deleteIconVisibility)
    this.setState( {deleteIconVisibility: true})

  }
  hideDeleteIcon = () => {
    // console.log("mouseOut")
    this.setState( {deleteIconVisibility: false})

  }
  formatTaskMsg = () => {
    if (this.props.task.msg.length > 33) {
      return this.props.task.msg.slice(0, 33) + '...'
    } else {
      return this.props.task.msg
    }

  }
  

  render() {
    let completeTaskRoute = this.props.task.task_id.toString()
    let delete_task_route = 'delete-task-' + this.props.task.task_id.toString()
    // let _getTasks = this.getTasks
// {this.props.done && <CompleteTaskBtn task_id={this.props.task.task_id} /> }

    return (
      <div className="task-div" onMouseOver={this.showDeleteIcon} onMouseLeave={this.hideDeleteIcon}>
        {!this.props.done && <CompleteTaskBtn fetchTaskData={this.props.fetchTaskData} onUpdate={this.props.onUpdate} task_id={this.props.task.task_id} /> }
        {this.props.done && <UndoCompleteTaskBtn fetchTaskData={this.props.fetchTaskData} task_id={this.props.task.task_id} /> }


        <Link className="task-msg in-line" to={`/edit-task/${this.props.task.task_id}`}>  {this.formatTaskMsg()} </Link>

        {this.state.deleteIconVisibility && 

          <div className='in-line' >
              <a href={delete_task_route} > 
                <i  onMouseOver={this.showDeleteIcon} className="far fa-times-circle "></i> 
              </a>
          </div>
        }
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
      <a href={this.props.delete_task_route}> 
        <i className="far fa-times-circle "></i> 
      </a>

      )
  }
}

export default withRouter(TasksPage)




