import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
// import { QuickAdd } from './tasks.jsx';


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
          <span className="nav-link">Register</span>)
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
          <Link to={"/iwp"}>
            <span className="navbar-brand">Mojivation</span>
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor03">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <Link to={"/tasks"}>
                  <span className="nav-link" >Tasks <span className="sr-only">(current)</span></span>
                </Link>
              </li>
              <li className="nav-item">
                {formatUserLink()}
              </li>
              <li>
                <Link to={"/test"}>
                  <span className="nav-link" >test</span>
                </Link>              
              </li>

              <li className="nav-item">
                <Link to={"/oAuth-authorize"}>
                  <span className="nav-link" >oAuth with Google Calendar</span>
                </Link>
              </li>
            </ul>
            {formatLoginLink()}
          </div>
        </nav>

    )
  }

}

class Heading extends React.Component {
  render () {
    return (
      <p>
      heading
      </p>
      // <h1>{% block h1_heading %}HEADING {% endblock %}</h1>
    )
  }

}
class LoginBtn extends React.Component {
  render () {
    return (
      <form className="form-inline my-2 my-lg-0" action='/login'>
        <button className="btn btn-secondary my-2 my-sm-0 login-btn" type="submit">Login</button>
        </form>
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
    console.log(flashedMessages)
    let formatFlashedMessages = () => {
      //          { this.props.tasks.map ((task) => {

        return flashedMessages.map (( message ) => {
          return <p key={message}> {message} </p>
        }

          )
    }

    return (
      <div className="alert alert-dismissible alert-secondary bg-light remove">
        <button type="button" className="close" data-dismiss="alert">&times;</button>

        {formatFlashedMessages()}   
      </div>

    )
  }
}

class Base extends React.Component {
  render () {
    return (
      <div>
        <NavBar />
        <FlashedMessages />
        <Content />
      </div>
    )
  }

}

const Test = ({ match }) => (
      <div> 
        test has rendered
      </div>
)




class TestTwo extends React.Component {
  render () {
    return <p> Test 2 has rendered </p>
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

class UserPage extends React.Component {
  constructor () {
    super ();
    this.state = {
        user: {},
        kaos: []
    };
  }

  render () {
    console.log(session)

    return (
      <div> User: { session.current_username }
     </div>
      )
  }
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

class Content extends React.Component {
  render () {
    return (
      <div>
        <Route path='/test' component={TestTwo} />
        <Route path='/tasks' component={QuickAdd} />
        <Route path='/iwp' component={Slogan} />
        <Route path='/user' component={UserPage} />
      </div>
      )


  }

}