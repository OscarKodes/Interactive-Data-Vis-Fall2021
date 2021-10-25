// CONSTANTS ###############################
const width = window.innerWidth * 0.8,
  height = window.innerWidth * 0.8,
  margin = {
    top: 30,
    left: 50,
    right: 50,
    bottom: 60
  };

let xScale, yScale, colorScale;

// APPLICATION STATE ########################
let state = {
  data: [],
};

// LOAD DATA ###############################
d3.csv('CLEANED_OscarRaces.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  state.data = raw_data;
  init();
});

// INITIALIZING FUNCTION ###################
function init() {
  
  // SCALES ----------------------------------
  
  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.races))
    .range([margin.left, width - margin.right])
    .paddingInner(.2);

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.count))
    .range([height - margin.top, margin.bottom])
    .nice();
  
  colorScale = d3.scaleOrdinal()
    .domain(state.data.map(d => d.races))
    .range(d3.schemePastel1);

  draw(); 
}

// DRAW FUNCTION ###############################
function draw() {
  
  // HTML ELEMENTS ----------------------------

  // SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("background-color", "lavender");

  // BARS
  svg.selectAll("rect.bar")
    .data(state.data)
    .join("rect")
    .attr("class", "bar")
    .attr("height", d => height - yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("x", d => xScale(d.races))
    .attr("y", d => yScale(d.count))
    .attr("fill", d => colorScale(d.races))
    .attr("stroke", "black")
}



// NEXT STEPS@@@@@@@@@@@@@@@@@@@@@
// add axis and labels
// add bar labels
// Transition to emphasize the flattened minorities