/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = {
    top: 50,
    left: 50,
    right: 50,
    bottom: 50
  },
  radius = 5;

let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedParty: "All" 
};

/* LOAD DATA */
d3.json("environmentRatings.json", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.ideologyScore2020))
    .range([margin.left, width - margin.right]);

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.envScore2020))
    .range([height - margin.top, margin.bottom]);

  colorScale = d3.scaleOrdinal()
    .domain(["R", "D", "I"])
    .range(["red", "blue", "purple"]);

  // + AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);


  // + UI ELEMENT SETUP
  const selectMenu = d3.select("#dropdown")

  const menuData = [
    {key: "All", label: "All"},
    {key: "R", label: "Republican"},
    {key: "D", label: "Democrat"}
  ];

  selectMenu.selectAll("option")
    .data(menuData)
    .join("option")
    .attr("value", d => d.key)
    .text(d => d.label);

  // Event listener
  selectMenu.on("change", event => {

    state.selectedParty = event.target.value;

    draw();
  });


  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("background-color", "lavender");

  // + CALL AXES
  svg.append("g")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis);


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
        .filter(d => state.selectedParty === "All" || state.selectedParty === d.Party)

  const dots = svg.selectAll("circle.dot")
    .data(filteredData, d => d.BioID)
    .join(
      enter => enter
        .append("circle")
          .attr("class", "dot")
          .attr("cx", d => xScale(d.ideologyScore2020))
          .attr("cy", d => yScale(d.envScore2020))
          .attr("r", radius * 1.5)
          .attr("fill", d => colorScale(d.Party))
        .call(enter => enter.transition()
          .duration(500)
          .delay((_, i) => i * 1)
          .attr("r", radius)
          ),

      // + HANDLE UPDATE SELECTION
      update => update
        .attr("r", radius * 1.5)
        .attr("fill", "white")
        .call(update => update.transition()
          .duration(1000)
          .attr("r", radius))
          .attr("fill", d => colorScale(d.Party)),

      // + HANDLE EXIT SELECTION
      exit => exit
        .call(exit => exit.transition()
          .duration(500)
          .attr("r", 0))
    );
}