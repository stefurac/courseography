import React from "react";
import PropTypes from "prop-types";
import Focus from "./Focus";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentHidden: true,
      focusDisabled: false,
      graphActive: 0,
      prerequisitesActive: 0,
      graphName: "",
      toggled: false
    };
  }

  componentWillUpdate(prevProps) { 
    if (prevProps.graphName !== this.state.graphName) {
      this.setState({ graphName: prevProps.graphName }, () => {
        this.handleFocusEnabled(); 
      });
    }
  }

  handleFocusEnabled = () => {
    // Enable Focuses nav if CS graph is selected
    if (this.state.graphName === "Computer Science") {
      this.setState({
        focusDisabled: false,
      });
    } else {
      this.setState({
        focusDisabled: true,
      });
    }
  }  
  
  createGraphButtons = () => {
    return this.props.graphs.map((graph, i) => {
      return (
        <div
          className="graph-button"
          id={"graph-" + graph.id}
          key={i}
          onClick={() => this.props.updateGraph(graph.title)}
        >
          {graph.title}
        </div>
      )
    });
  }
  

  createPrerequisitesButtons = () => { console.log('sup')
      return (
        <div className="filter-button">
        <ul>
        <li><p className="filter">Enter Course(s): </p>
        <input className="filter" placeholder="CSC401"/></li>
        <li><p className="filter">Exclude Courses: </p>
        <input className="filter" placeholder="..."/></li>
        <li><p className="filter">Departments: </p>
        <input className="filter" placeholder="..."/>
        <ul>
          <li>
            <p className="filter">How many layers of courses from other department(s) do you want to include? </p>
            <input className="filter" placeholder="..."/>
          </li>
        </ul>
        </li>
        <li><p className="filter">Number of layers(?): </p>
        <input className="filter" placeholder="..."/></li> 
        <li><p className="filter">Faculties: </p>
        <input className="filter" placeholder="..."/></li>                           
        <li><p className="filter">Campuses: </p> 
        <input className="filter" placeholder="..."/></li>
        <li><p className="filter">Exclude courses external to campuses: </p>
        <input type="checkbox" className="filter"/></li>
        <li><p className="filter">Exclude grade requirements: </p>
        <input type="checkbox" className="filter"/></li>
        </ul>
        </div>)
  }

  createFocusButtons = () => {
    const computerScienceFocusData = [
      ["sci", "Scientific Computing"],
      ["AI", "Artificial Intelligence"],
      ["NLP", "Natural Language Processing"],
      ["vision", "Computer Vision"],
      ["systems", "Computer Systems"],
      ["game", "Video Games"],
      ["HCI", "Human Computer Interaction"],
      ["theory", "Theory of Computation"],
      ["web", "Web Technologies"],
    ];

    return computerScienceFocusData.map((focus, i) => {
      const openDetails = this.props.currFocus == focus[0];
      return (
        <Focus
          key={i}
          pId={focus[0]}
          focusName={focus[1]}
          openDetails={openDetails}
          highlightFocus={(id) => this.props.highlightFocus(id)}
        />
      )
    });
  }
  
  toggleSidebar = location => {
    if (this.state.toggled) {
      // close graph
      this.setState({
        contentHidden: true,
        graphActive: 1,
        toggled: false,
      })
    } else if (!this.state.toggled && location === "button") {
      // open graph
      this.setState({
        toggled: true,
        contentHidden: false,
        graphActive: 1,
      });
    }
  }

  showFocuses = focus => {
    if (focus) {
      // show focuses
      this.setState({
        graphActive: 0,
        prerequisitesActive: 0
      });
    } else {
      // show graphs
      this.setState({
        graphActive: 1
      });
    }
  }

  showPrerequisites = prerequisites => { console.log(this.state)
    if (prerequisites) {
      // show prerequisites
      this.setState({
        prerequisitesActive: 1,
        graphActive: 0
      });

      this.createPrerequisitesButtons();

    } else {
      // show graphs
      this.setState({
        prerequisitesActive: 0,
        graphActive: 1
      });
    }
  }


  // Sidebar rendering methods
  renderSidebarHeader= () => {
    const contentHiddenClass = this.state.contentHidden ? "hidden" : "";

    return (
      <div id="fce" className={contentHiddenClass}>
        <div id="fcecount">FCE Count: 0.0</div>
        <button id="reset" onClick={() => this.props.reset()}>Reset Graph</button>
      </div>
    )
  }

  renderSidebarNav = () => {
    const focusDisabled = this.state.focusDisabled ? "disabled" : "";
    const focusActiveClass = (this.state.graphActive === 0 && this.state.prerequisitesActive === 0) ? "active" : "";
    const graphActiveClass = (this.state.graphActive === 1 && this.state.prerequisitesActive === 0) ? "active" : "";
    const prerequisitesActiveClass = this.state.prerequisitesActive === 1 ? "active" : "";

    return (
      <nav id="sidebar-nav">
        <ul>
          <li id="graphs-nav" className={graphActiveClass} onClick={() => this.showFocuses(false)}>
            <div>Departments</div>
          </li>
          <li id="focuses-nav" className={`${focusActiveClass} ${focusDisabled}`} onClick={() => this.showFocuses(true)}>
            <div>Focuses</div>
          </li>
          <li id="prerequisites-nav" className={prerequisitesActiveClass} onClick={() => this.showPrerequisites(true)}>
            <div>Prerequisites</div>
          </li>
        </ul>
      </nav>
    )
  }

  renderSidebarButtons = () => { 
    const focusHiddenClass = (this.state.graphActive === 1 && this.state.prerequisitesActive === 0) 
    || (this.state.graphActive === 0 && this.state.prerequisitesActive === 1) ? "hidden" : "";
    const graphHiddenClass = this.state.graphActive === 0 || this.state.prerequisitesActive === 1 ? "hidden" : "";
    const prerequisitesHiddenClass = this.state.prerequisitesActive === 0 ? "hidden" : "";
    console.log(focusHiddenClass);
    return (
      <div>
        <div id="graphs" className={graphHiddenClass}>
          {this.createGraphButtons()}
        </div>
        <div id="focuses" className={focusHiddenClass}>
          <ul>
            <li>
              <p className="filter">Select a Department: </p>
              <input className="filter" placeholder="Computer Science"/>
            </li>
            <li>
              <p className="filter">Select a Program of Study: </p>
              <input className="filter" placeholder="Specialist"/>
            </li>
          </ul>
          <p>current POSt: Computer Science Specialist</p>
          {this.createFocusButtons()}
        </div>
        <div id="prerequisites" className={prerequisitesHiddenClass}>
          {this.createPrerequisitesButtons()}
        </div>
      </div>
    )
  }

  render() {
    const flippedClass = this.state.toggled ? "flip" : "";
    const sidebarClass = this.state.toggled ? "opened" : "";

    return (
      <div>
        <div id="sidebar" className={sidebarClass}>
          {this.renderSidebarHeader()}
          {this.renderSidebarNav()}
          {this.renderSidebarButtons()}
        </div>
        
        <div id="sidebar-button" onClick={() => this.toggleSidebar("button")}>
          <img id="sidebar-icon"
           className={flippedClass}
           src="static/res/ico/sidebar.png"
          />
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  currFocus: PropTypes.string,
  updateGraph: PropTypes.func,
  graphs: PropTypes.array,
  graphName: PropTypes.string,
  highlightFocus: PropTypes.func,
  reset: PropTypes.func
};
