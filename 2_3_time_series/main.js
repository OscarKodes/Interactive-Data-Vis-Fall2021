 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = {
    top: 25,
    bottom: 50,
    left: 50,
    right: 25
  };

// Google Trends:
// Numbers represent search interest relative to the highest point 
// on the chart for the given region and time. 
// A value of 100 is the peak popularity for the term. 
// A value of 50 means that the term is half as popular. 
// A score of 0 means there was not enough data for this term.

/* LOAD DATA */
d3.csv('appSearches.csv', d => {
  return {
    week: new Date(d.Week),
    app: d.app,
    searches: +d.searches,
  }
}).then(data => {
  console.log('data :>> ', data);

  // SCALES

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.week))
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.searches))
    .range([height - margin.bottom, margin.top])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lavender")

   // BUILD AND CALL AXES
 const xAxis = d3.axisBottom(xScale)

 svg.append("g")
   .attr("transform", `translate(${0}, ${height - margin.top})`)
   .call(xAxis)

 const yAxis = d3.axisLeft(yScale)

 svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`)
   .call(yAxis)


  // DRAW LINE FUNCTION
  const drawLine = d3.line()
    .x(d => xScale(d.week))
    .y(d => yScale(d.searches))

  // DRAW AREA
  const drawArea = d3.area()
    .x(d => xScale(d.week))
    .y0(height)
    .y1(d => yScale(d.searches))


  // Isolate tinder to make just one line
  const tinderData = data.filter(d => d.app === "Tinder")
  const bumbleData = data.filter(d => d.app === "Bumble")

  // DRAW AREA
  svg.selectAll(".tinder-area")
    .data([tinderData])
    .join("path")
    .attr("class", "tinder-area")
    .attr("fill", "steelblue")
    .attr("stroke", "black")
    .attr("d", d => drawArea(d))

  // DRAW AREA
  svg.selectAll(".bumble-area")
    .data([bumbleData])
    .join("path")
    .attr("class", "bumble-area")
    .attr("fill", "gold")
    .attr("stroke", "black")
    .attr("d", d => drawArea(d))

});

