/* CONSTANTS AND GLOBALS */
const height = window.innerHeight * 0.8;
const margin = {
    top: 50,
    left: 50,
    right: 200,
    bottom: 50
  },
  radius = 5;

// Limiting the width, 
// so the plot isn't stretched too much if have wide screen
let width = window.innerWidth * 0.8;
width = width > height ? height + margin.right : width;

let svg, 
xScale, 
yScale, 
colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedGenre: "All" 
};

/* LOAD DATA */
d3.csv("Movie-Ratings.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d["Rotten Tomatoes Ratings %"]))
    .range([margin.left, width - margin.right]);

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d["Audience Ratings %"]))
    .range([height - margin.top, margin.bottom]);

  // Placing genres and colors in variables to be reused in colorScale & Legend
  const allGenres = ["Comedy", "Drama", "Adventure", "Thriller", "Horror", "Action", "Romance"];
  const allColors = ["Yellow", "Red", "Green", "Purple", "Black", "Blue", "Pink"];

  colorScale = d3.scaleOrdinal()
    .domain(allGenres)
    .range(allColors)

  sizeScale = d3.scaleSqrt()
    .domain([1, d3.max(state.data, d => d["Budget (million $)"])])
    .range([3, 16]);

  // + UI ELEMENT SETUP
  const selectMenu = d3.select("#dropdown")

  const menuData = [{key: "All", label: "All"}];

  allGenres.map(genre => {
    menuData.push({key: genre, label: genre})
  });

  selectMenu.selectAll("option")
    .data(menuData)
    .join("option")
    .attr("value", d => d.key)
    .text(d => d.label);

  // Event listener
  selectMenu.on("change", event => {
    state.selectedGenre = event.target.value;

    draw();
  });


  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  // AXIS TICKS  ----------------------------------------------
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.top})`)
    .call(d3.axisBottom(xScale));
  
  svg.append("g")
    .attr("transform", `translate(${margin.bottom},0)`)
    .call(d3.axisLeft(yScale));

  // AXIS LABELS ----------------------------------------------
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width / 2 + margin.left * 2)
  .attr("y", height - 6)
  .style("font-weight", "bold")
  .style("font-size", "1.2rem")
  .text("Rotten Tomatoes Ratings %");

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -height / 2 + margin.left * 2)
    .attr("y", 15)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .attr("transform", "rotate(-90)")
    .text("Audience Ratings %");

    // LEGENDS ------------------------------------------------

  // Title for Genre Legend
  svg.append("text")
    .text("Genre:")
    .attr("x", width - margin.right / 2 - 15)
    .attr("y", 110)
    .style("font-size", "1rem")
    .style("font-weight", "bold")

  // Color dots for Genre Legend
  svg.selectAll(".legend-dot")
    .data(allColors)
    .join("circle")
    .attr("class", "legend-dot")
    .attr("cx", width - margin.right * .6 - 10)
    .attr("cy", (_, i) => 130 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)
    .attr("stroke", "black")
    .attr("opacity", "0.6")

  // Genre labels for Genre Legend
  svg.selectAll(".legend-genre")
    .data(allGenres)
    .join("text")
    .attr("class", "legend-genre")
    .attr("x", width - margin.right / 2 - 10)
    .attr("y", (_, i) => 130 + i * 20)
    .text(d => d)
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")

  // Grabbing the min, median, and max of budgets
  const allBudgets = state.data.map(d => d["Budget (million $)"]);
  const threeBudgets = [
    d3.min(allBudgets), 
    d3.median(allBudgets), 
    d3.max(allBudgets)
  ];

  // Title for Budget Legend
  svg.append("text")
    .text("Budget:")
    .attr("x", width - margin.right / 2 - 17)
    .attr("y", 355)
    .style("font-size", "1rem")
    .style("font-weight", "bold")

  // Circle Sizes for Budget Legend
  svg.selectAll(".legend-size")
    .data(threeBudgets)
    .join("circle")
    .attr("class", "legend-size")
    .attr("cx", d => width - margin.right * .6 - sizeScale(d) / 2 - 5)
    .attr("cy", (_, i) => 378 + i * 35)
    .attr("r", d => sizeScale(d))
    .style("fill", "white")
    .attr("stroke", "black")
    .attr("opacity", "0.6")

  // Budget Dollars for Budget Legend
  svg.selectAll(".legend-budget")
    .data(threeBudgets)
    .join("text")
    .attr("class", "legend-budget")
    .attr("x", width - margin.right * .45 - 5)
    .attr("y", (_, i) => 380 + i * 35)
    .text(d => d === 0 ? "< $1 mill" : `$${d} mill`)
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
        .filter(d => state.selectedGenre === "All" || state.selectedGenre === d.Genre)

  console.log(state.selectedGenre);
  console.log(filteredData);

  const dots = svg.selectAll("circle.dot")
    .data(filteredData, d => d.Film)
    .join(
      enter => enter
        .append("circle")
          .attr("class", "dot")
          .attr("transform", d => `translate(${xScale(d["Rotten Tomatoes Ratings %"])}, 
                                  ${yScale(d["Audience Ratings %"])})`)
          .attr("r", 0)
          .attr("fill", d => colorScale(d.Genre))
          .attr("stroke", "black")
          .attr("opacity", "0.4")
        .call(enter => enter.transition()
          .duration(500)
          .attr("r", d => sizeScale(d["Budget (million $)"]))
          ),

      // + HANDLE UPDATE SELECTION
      update => update
        .attr("opacity", "1")
        .call(update => update.transition()
          .duration(1000)
          .attr("opacity", "0.4")),

      // + HANDLE EXIT SELECTION
      exit => exit
        .call(exit => exit.transition()
          .duration(500)
          .attr("r", 0))
          .remove()
    );
}


// Add clickable genres
// Add hover dot highlight
// Sort dots by largest to smallest budget
// Add tooltip using html div and draw for update
// Add data source
// 