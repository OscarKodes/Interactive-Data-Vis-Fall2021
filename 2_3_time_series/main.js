 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = {
    top: 25,
    bottom: 75,
    left: 75,
    right: 150
  };

/* LOAD DATA */
d3.csv('appSearches.csv', d => {
  return {
    week: new Date(d.Week),
    app: d.app,
    searches: +d.searches,
  }
}).then(data => {

  // SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.week))
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.searches))
    .range([height - margin.bottom, margin.top])

  const colorArr = ["#ff6a33", "yellow", "Purple"];
  const colorScale = d3.scaleOrdinal()
  .range(colorArr);

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

   // AXIS TICKS
  const xAxis = d3.axisBottom(xScale)

  svg.append("g")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)

  const yAxis = d3.axisLeft(yScale)

  svg.append("g")
    .attr("transform", `translate(${margin.left - 1}, ${0})`)
    .call(yAxis)

  // AXIS LABELS ----------------------------------------------
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .text("Time (Years)");

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -height / 2 + margin.left * 2)
    .attr("y", 30)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .attr("transform", "rotate(-90)")
    .text("Search Interest Relative to Highest Point");

  
  // DRAW AREA
  const drawArea = d3.area()
    .x(d => xScale(d.week))
    .y0(height - margin.bottom)
    .y1(d => yScale(d.searches))


  // Filter data for only Tinder and Bumble
  data = data.filter(d => ["Tinder", "Bumble", "okcupid"].includes(d.app))

  // Group by apps
  const appData = d3.groups(data, d => d.app)
                      .map(d => {
                        return {app:d[0], searches:d[1]};
                      });
  console.log(appData);

  // DRAW AREA
  svg.selectAll(".area")
    .data(appData)
    .join(
      enter => enter
      .append("path")
        .attr("class", "area")
        .attr("opacity", 0)
        .attr("stroke", "black")
        .attr("fill", d => colorScale(d.app))
      .call(enter => enter
        .transition()
          .duration(2000)
          .delay((_, i) => i * 500)
          .attr("d", d => drawArea(d.searches))
          .attr("opacity", 0.85))
    )
    

  // LEGEND ------------------------------------------------

  // Title for search Legend
  svg.append("text")
    .text("Searched Word:")
    .attr("x", width - margin.right * .8)
    .attr("y", 210)
    .style("font-size", "1rem")
    .style("font-weight", "bold")

  // Color boxes for search Legend
  svg.selectAll(".legend-box")
    .data(colorArr)
    .join("rect")
    .attr("class", "legend-box")
    .attr("x", width - margin.right * .6 - 10)
    .attr("y", (_, i) => 230 + i * 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", d => d)
    .attr("stroke", "black")

  // search labels for search Legend
  svg.selectAll(".legend-search")
    .data(["Tinder", "Bumble", "Okcupid"])
    .join("text")
    .attr("class", "legend-search")
    .attr("x", width - margin.right / 2 - 10)
    .attr("y", (_, i) => 235 + i * 20)
    .text(d => d)
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")
});

