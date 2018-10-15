"use strict";

/* component start */ // These comments are for rendering handouts!
class Hello extends React.Component {
  render() {
    return <p>Hi World!</p>;
  }
}
/* component end */


/* render start */
ReactDOM.render(
  <Hello />,
  document.getElementById("root")
);
/* render end */
 