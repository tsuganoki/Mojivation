

class NavBar extends React.Component {

	render () {
		return (

			<nav className="navbar navbar-expand-lg navbar-light bg-light">
			  <a className="navbar-brand" href="#">Mojivation</a>
			  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon"></span>
			  </button>

			  <div className="collapse navbar-collapse" id="navbarColor03">
			    <ul className="navbar-nav ml-auto">
			      <li className="nav-item active">
			        <a className="nav-link" href="/tasks">Tasks <span className="sr-only">(current)</span></a>
			      </li>
			      <li className="nav-item">
			        <a className="nav-link" href="#">User</a>
			      </li>

			      <li className="nav-item">
			        <a className="nav-link" href="#">oAuth with Google Calendar</a>
			      </li>
			    </ul>
			    <form className="form-inline my-2 my-lg-0">
			      
			      <button className="btn btn-secondary my-2 my-sm-0 login-btn" type="submit">Login</button>
			    </form>
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
class FlashedMessages extends React.Component {

	

	render () {
		let formatFlashedMessages = () => {
			// 			  	{ this.props.tasks.map ((task) => {

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
				<Heading />
				<FlashedMessages />
			</div>
		)
	}

}

ReactDOM.render (
(
	<Base />
	),
document.getElementById('root'),
);