import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'


export default class App extends React.Component {
  render () {
    return (
      <div>
      <Router>
        <Base />
        <p> Hello React!</p>
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

class Content extends React.Component {
  render () {
    return (
      <div>
        <h1> Welcome</h1>
        <Route path='/test' component={Test} />
      </div>
      )


  }

}