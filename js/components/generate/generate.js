import React from 'react';
import ReactDOM from 'react-dom';
// need ghci overloaded strings extension -- # in GraphGenerator not recognized
//import coursesToPrereqGraph from '../../../app/DynamicGraphs/GraphGenerator.hs';

class Generate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseInputs: ["CSC324H1"],
      excludedCourses: [],
      departments: ["CSC", "MAT"],
      // make layers an int
      layers: "0",
      faculties: [],
      campuses: [],
      includeRaws: false,
      includeGrades: false
    };
  }

  submitInputs = () => {
    // check for invalid input (courses, departments, layers, faculties, campuses)?
    // remove extra whitespace from input arrays

    var courseInputs =  document.getElementById("generateForm").elements[0].value;    
    if (courseInputs == "") {
      alert("Cannot generate graph -- no courses entered!");
    } 
    
    else {      
    this.state.courseInputs = courseInputs.split(",");
    
    var excludedCourses = document.getElementById("generateForm").elements[1].value;
    if (excludedCourses != "") {
      this.state.excludedCourses = excludedCourses.split(",");
    } else {
      this.state.excludedCourses = [];
    }

    var departments = document.getElementById("generateForm").elements[2].value;
    if (departments != "") {
      this.state.departments = departments.split(",");

    // when no departments are entered, default is to use the departments associated with course inputs
    } else { departments = [];
    for (var i = 0; i < this.state.courseInputs.length; i++) {
      var newDepartment = this.state.courseInputs[i].trim().slice(0,3);
      departments.push(newDepartment);
       }
    // removes duplicate departments
    var distinctDepartments = new Set(departments);
    this.state.departments = [...distinctDepartments];
    }

    var layers = document.getElementById("generateForm").elements[3].value;
    if (layers != "") {
      this.state.layers = layers;
    } else {
      this.state.layers = "0";
    }

    var faculties = document.getElementById("generateForm").elements[4].value;
    if (faculties != "") {
      this.state.faculties = faculties.split(",");
    } else {
      this.state.faculties = [];
    }

    var campuses = document.getElementById("generateForm").elements[5].value;
    if (campuses != "") {
      this.state.campuses = campuses.split(",");
    } else {
      this.state.campuses = [];
    }

    this.state.includeRaws = document.getElementById("generateForm").elements[6].checked;
    this.state.includeGrades = document.getElementById("generateForm").elements[7].checked;
    
    this.getGraph();
    this.generate();

    console.log(this.state.courseInputs);
    console.log(this.state.excludedCourses);
    console.log(this.state.departments);
    console.log(this.state.layers);
    console.log(this.state.faculties);
    console.log(this.state.campuses);
    console.log(this.state.includeRaws);
    console.log(this.state.includeGrades);
    }
  }

  getGraph = () => {
    const data = {
      "courses": this.state.courseInputs,
      //"excludedCourses": this.state.excludedCourses,
      "departments": this.state.departments,
      //"layers": this.state.layers,
      //"faculties": this.state.faculties,
      //"campuses": this.state.campuses,
      "includeRaws": this.state.includeRaws,
      "includeGrades": this.state.includeGrades
    }
    const putData = {
      method: 'PUT', // Method itself
      headers: {
       'Content-Type': 'application/json' // Indicates the content 
      },
      body: JSON.stringify(data) // We send data in JSON format
     }
    
    fetch('generate', putData).then(res => res.json()).then(
       (graph) => {
         console.log('graph :>> ', graph);
       },() => { throw "Error. Cannot load graph.";
       }
     )
  }

  generate = () => {
    // only the excludeCourses filter has been implemented in the backend

    if (this.state.excludedCourses == []) {
    //coursesToPrereqGraph(this.state.courseInputs);
    } else { 
      // coursesToPrereqGraphExcluding(this.state.courseInputs, this.state.excludedCourses);
    }
  }

  render() { 
    return (
      <div id="generateDiv">
        <form id="generateForm">
          <div id="header">
            <div id="header-title"> PREREQUISITE GENERATOR</div>
            <div id="main-filter">
              <input type="text" placeholder="CSC324H1"/>
            </div>
          </div>

          <p id="filter-title">OPTIONAL FILTERS</p>

          <ul>
            <li>
              <label >Exclude Courses: </label>
              <input type="text" placeholder="..."/>
            </li>
            
            <li>
              <label >Include Departments: </label>
              <input type="text"  placeholder="CSC, MAT"/>
            </li>

            {/* <li><label >How many layers of courses from other department(s) do you want to include? </label>
              <input  placeholder="..."/>
            </li> */}

            <li>
              <label >(?) Number of layers: </label>
              <input type="text"  placeholder="0"/>
            </li> 

            <li>
              <label >Include Faculties: </label>
              <input type="text"  placeholder="..."/>
            </li>  

            <li>
              <label >Include Campuses: </label>
              <input type="text"  placeholder="..."/>
            </li>

            <li>
              <label >Exclude courses external to campuses: </label>
              <input type="checkbox" />
            </li>

            <li>
              <label >Exclude grade requirements: </label>
              <input type="checkbox" />
            </li>

          </ul>

          <div id="submit" onClick={() => this.submitInputs()}>
            <div id="submit-text" type="button"> SUBMIT </div>
            {/* <input id="submit-text" type="submit" value="SUBMIT"></input> */}
          </div>
      </form>
    </div>
    
    )
  }
}

ReactDOM.render(
  <Generate />,
  document.getElementById('generateDiv')
);
