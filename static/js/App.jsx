import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import TasksPage  from './tasks.jsx';
import { UserPage } from './user.jsx';
import { RegisterPage } from './register.jsx';
import AddTaskPage from './addtask.jsx';
import LoginPage from './login.jsx';
import EditTaskPage from './edittask.jsx';



export default class App extends React.Component {
  render () {
    return (
      <div>
      <Router>
        <Base />
        </Router>
      </div>
      );
  }
}




class NavBar extends React.Component {


  render () {

    let formatUserLink = () => {
      //          { this.props.tasks.map ((task) => {
      if (session.current_username !== 'None') {
        return (  
          <Link to={'/user'}>
            <span className="nav-link"> {session.current_username}</span>
          </Link>
          )

      } else {
        return  (
          <Link to={"/register"}>
          <span className="nav-link">Register</span>
          </Link>
          )
      } 
    }

    let formatLoginLink = () => {
      if (session.current_user_id !== 'None') {
        return <LogoutBtn />
      }else {
        return <LoginBtn />
      }


    }

    return (
      
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to={"/"}>
            <span className="navbar-brand">Mojivation</span>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav ml-auto">
              {session.current_username !=="None" &&
              <li className="nav-item active">
                <Link to={"/tasks"}>
                  <span className="nav-link" >Tasks <span className="sr-only">(current)</span></span>
                </Link>
              </li>
              }
            
              <li className="nav-item">
                {formatUserLink()}
              </li>

            {session.current_username !=="None" &&
              <li className="nav-item">

                <a href="/oAuth-authorize">
                  <span className="nav-link" >oAuth with Google Calendar</span>
                </a>
              </li>}
              <li className="nav-item">

                <Link to='/test'>
                  <span className="nav-link" > test </span>
                </Link>
              </li>
            </ul>
            {formatLoginLink()}
          </div>
        </nav>

    )
  }

}

class LoginBtn extends React.Component {
  render () {
    return (
      <Link to='/login'>
      
        <button className="btn btn-secondary my-2 my-sm-0 login-btn">Login</button>
        </Link>
      )
  }

}
class LogoutBtn extends React.Component {
  render () {
    return (

      <form className="form-inline my-2 my-lg-0" action='/logout'>
        <button className="btn btn-secondary my-2 my-sm-0 login-btn" type="submit">Logout</button>
        </form>
      )
  }

}
class FlashedMessages extends React.Component {
  render () {
    console.log("flashed messages: ",flashedMessages)
    let formatFlashedMessages = () => {
      //          { this.props.tasks.map ((task) => {

        return flashedMessages.map (( message ) => {
          return <p key={message}> {message} </p>
        }

          )
    }

    return (
      <div className="alert alert-dismissible alert-secondary bg-light">
        <button type="button" className="close" data-dismiss="alert">&times;</button>

        {formatFlashedMessages()}   
      </div>

    )
  }
}

class Base extends React.Component {
  renderFlashedMessages() {
    if (flashedMessages[0]) {
      console.log("flashedMessages are: ",flashedMessages)
      return <FlashedMessages />
    }
  }

  render () {
    return (
      <div>
        <NavBar />
        {this.renderFlashedMessages()}
        <Content />
      </div>
    )
  }

}


class TaskBlock extends React.Component {

  render () {


    return (

      <div className="today-tasks">
        <h3>{this.props.blockName}</h3>
        <span id="EOD-span" className="small-text remove" >EOD is:  sometime UTC</span> 
        <ul>
          { this.props.tasks.map ((task) => {
                 return <li key={task.task_id}><Task task={task}/></li>
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
        <input type="submit" name="complete" value="Done" onClick={this.completeTask}/>
      </form>
    )
  }
}


class Task extends React.Component {
  constructor () {
    super ();
    this.state = {
      deleteIconVisibility: ""
    };
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

    return (
      <div>
        <CompleteTaskBtn task_id={this.props.task.task_id} /> <a className="task-msg in-line" href={edit_task_route}>  {this.props.task.msg} </a>

        <a href={delete_task_route} >
          <i className="fa fa-times-circle-o ex-cirle" 
          aria-hidden="true" 
          alttext="delete task"></i>
        </a>
      </div>


      
    );

  };
}







class Slogan extends React.Component {
  randomProp (obj) {
   var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
  }
  

  
  render() {
    let slogans  = {
        "shrug": "¯\\_(ツ)_/¯ Guess we can be productive today",
        "supportive": "~(˘▽˘~) I know you can do it!",
        "dog": " ∪･ω･∪ Today's Oppawtunities are full of pet-tential",
        "boxer": "(งಠ_ಠ)ง It's the eye of the tiger, it's the thrill of the fight...",
        "mage": "(ﾉ>ω<)ﾉ :｡･:*:･ﾟ’★,｡･:*:･ﾟ’☆ Abracadabra! Lets be productive!",
        "bear": "ʕ •̀ ω •́ ʔ Keep going! You can bear it!",
        "allieB": "╰(°ロ°)╯ Do all the things!"
        }
    let slogan = this.randomProp(slogans);
    // console.log(slogan);
    return <p className='home-page-mantra'> { slogan }</p>;

      
    
  }
}

class Test extends React.Component {
  render () {
    return (
      <p> prop here: {this.props.test}</p>
      )
  }

}


class Content extends React.Component {
  render () {
    return (
      <div>

        <Route path='/tasks' component={TasksPage} />
        <Route exact path='/' component={Slogan} />
        <Route path='/login' component={LoginPage} />
        <Route path='/user' component={UserPage} />
        <Route path='/register' component={RegisterPage} />
        <Route path='/new-task' component={AddTaskPage} />
        <Route path='/test' render={props => <Test {...props} test="a string" />} />
        <Route path='/edit-task' render={props => <EditTaskPage {...props} test="a string" />} />

      </div>
      )


  }

}