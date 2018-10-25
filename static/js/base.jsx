


	render () {
		return (

			<nav class="navbar navbar-expand-lg navbar-light bg-light">
			  <a class="navbar-brand" href="#">Mojivation</a>
			  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
			    <span class="navbar-toggler-icon"></span>
			  </button>

			  <div class="collapse navbar-collapse" id="navbarColor03">
			    <ul class="navbar-nav ml-auto">
			      <li class="nav-item active">
			        <a class="nav-link" href="/tasks">Tasks <span class="sr-only">(current)</span></a>
			      </li>
			      <li class="nav-item">
			        <a class="nav-link" href="#">User</a>
			      </li>

			      <li class="nav-item">
			        <a class="nav-link" href="#">oAuth with Google Calendar</a>
			      </li>
			    </ul>
			    <form class="form-inline my-2 my-lg-0">
			      
			      <button class="btn btn-secondary my-2 my-sm-0 login-btn" type="submit">Login</button>
			    </form>
			  </div>
			</nav>

		)
	}