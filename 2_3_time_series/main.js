 /* CONSTANTS AND GLOBALS */
// const width = ,
//   height = ,
//   margin = ;


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

  // CREATE SVG ELEMENT

  // BUILD AND CALL AXES

  // LINE GENERATOR FUNCTION

  // DRAW LINE

});


//  /* CONSTANTS AND GLOBALS */
//  const width = window.innerWidth * 0.7,
//  height = window.innerHeight * 0.7,
//  margin = { top: 20, bottom: 50, left: 60, right: 60 }

// /*
// this extrapolated function allows us to replace the "G" with "B" min the case of billions.
// we cannot do this in the .tickFormat() because we need to pass a function as an argument,
// and replace needs to act on the text (result of the function).
// */
// const formatBillions = (num) => d3.format(".2s")(num).replace(/G/, 'B')
// const formatDate = d3.timeFormat("%Y")

// /* LOAD DATA */
// d3.csv('appSearches.csv', d => {
//  // use custom initializer to reformat the data the way we want it
//  // ref: https://github.com/d3/d3-fetch#dsv
//   return {
//     week: new Date(d.Week),
//     app: d.app,
//     searches: +d.searches,
//   }
// }).then(data => {
//  console.log('data :>> ', data);

//  // + SCALES
//  const xScale = d3.scaleTime()
//    .domain(d3.extent(data, d => d.week))
//    .range([margin.right, width - margin.left])

//  const yScale = d3.scaleLinear()
//    .domain(d3.extent(data, d => d.searches))
//    .range([height - margin.bottom, margin.top])

//  // CREATE SVG ELEMENT
//  const svg = d3.select("#container")
//    .append("svg")
//    .attr("width", width)
//    .attr("height", height)

//  // BUILD AND CALL AXES
//  const xAxis = d3.axisBottom(xScale)
//    .ticks(6) // limit the number of tick marks showing -- note: this is approximate

//  const xAxisGroup = svg.append("g")
//    .attr("class", "xAxis")
//    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
//    .call(xAxis)

//  xAxisGroup.append("text")
//    .attr("class", 'xLabel')
//    .attr("transform", `translate(${width / 2}, ${35})`)
//    .text("Year")

//  const yAxis = d3.axisLeft(yScale)
//    .tickFormat(formatBillions)

//  const yAxisGroup = svg.append("g")
//    .attr("class", "yAxis")
//    .attr("transform", `translate(${margin.right}, ${0})`)
//    .call(yAxis)

//  yAxisGroup.append("text")
//    .attr("class", 'yLabel')
//    .attr("transform", `translate(${-45}, ${height / 2})`)
//    .attr("writing-mode", 'vertical-rl')
//    .text("Population")

//  // LINE GENERATOR FUNCTION
//  const lineGen = d3.line()
//    .x(d => xScale(d.week))
//    .y(d => yScale(d.searches))

//  // DRAW LINE
//  svg.selectAll(".line")
//    .data([data]) // data needs to take an []
//    .join("path")
//    .attr("class", 'line')
//    .attr("fill", "none")
//    .attr("stroke", "black")
//    .attr("d", d => lineGen(d))

// });