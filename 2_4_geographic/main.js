/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 25, bottom: 50, left: 50, right: 25 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("usState.json"),
  d3.csv("airport-clean-data.csv", d3.autoType),
]).then(([usMapData, airportData]) => {
  
  // Filter out small airports
  // Sort large airports to load first
  airportData = airportData
                .filter(d => d.Size !== 1)
                .sort((a, b) => b.Size-a.Size);

  // CREATE SCALES / PROJECTIONS==========================

  // Projection for map
  const projection = d3.geoAlbersUsa()
    .fitSize([width - margin.left - margin.right,
              height - margin.top - margin.bottom],
              usMapData);

  // Sizes for airport dots
  const sizeScale = d3.scaleSqrt()
      .domain([2, 3])
      .range([5, 10])
  
  // Color scale and constants
  const dateArr = airportData.map(d => Date.parse(d.last_update));
  const dateDomain = [
    d3.min(dateArr),
    d3.median(dateArr),
    d3.max(dateArr)
  ];
  const colorsArr = ["#999999", "#66cc66", "#33ff33"];

  const colorScale = d3.scaleLinear()
      .domain(dateDomain)
      .range(colorsArr);

  // HTML ELEMENTS======================================

  // create svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // path generator for map
  const pathGen = d3.geoPath(projection);

  // draw the us map using the pathgen
  const states = svg.selectAll(".state-path")
      .data(usMapData.features)
      .join("path")
      .attr("class", "state-path")
      .attr("stroke", "black")
      .attr("fill", "transparent")
      .attr("d", pathGen)
  
  
  // INVISIBLE TOOLTIP DIV -----------------------------------
  const tooltip = d3.select("#container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

  // TOOLTIP MOUSE OVER EVENT HANDLER ------------------------
  const tipMouseover = function(event, d) {

    // Dynamic html to put inside tooltip div catered to specific film
    const tooltipHTML = `<b>Name:</b> ${d.Name}<br/>`;

    let length = d.Name.length;

    // Position the invisible tooltip div above and left of hovering cursor
    tooltip.html(tooltipHTML)
      .style("left", d => event.pageX - 40 - (length * 5)  + "px")  
      .style("top", event.pageY - 40 + "px")
      .style("outline", "1px solid black")
      .transition()
        .duration(100) 
        .style("opacity", .85) // Make invisible div visable

    // Highlight the hovered circle
    d3.select(this)
      .transition()
      .duration(100)
      .style("opacity", 1);
  };

  // TOOLTIP MOUSE OUT EVENT HANDLER ----------------------
  const tipMouseout = function(d) {
      tooltip.transition()
          .duration(200) 
          .style("opacity", 0); // Make tooltip div invisible once again

      // Remove highlight from hovered circle
      d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 0.5);
  };

  // DRAW AIRPORT POINTS/CIRCLES
  svg.selectAll(".airport-points")
    .data(airportData)
    .join(
      enter => enter
        .append("circle")
          .attr("class", "airport-points")
          .attr("r", 0)
          .on("mouseover", tipMouseover)
          .on("mouseout", tipMouseout)
          .attr("fill", d => colorScale(Date.parse(d.last_update)))
          .attr("stroke", "black")
          .attr("opacity", 0.6)
          .attr("transform", d => {

            const [x, y] = projection([d.long, d.lat]);
            
            return `translate(${x}, ${y})`;
          })
        .call(enter => enter
          .transition()
          .duration(1000)
          .delay((_, i) => i * 2)
          .attr("r", d => sizeScale(d.Size)))
    );

    // LEGENDS ------------------------------------------------

    // Title for Color Legend
    svg.append("text")
    .text("Recentness of Data:")
    .attr("x", width - margin.right * 6)
    .attr("y", 470)
    .style("font-size", "1rem")
    .style("font-weight", "bold")

  // Color dots for Color Legend
  svg.selectAll(".legend-dot")
    .data(colorsArr)
    .join("circle")
    .attr("class", "legend-dot")
    .attr("cx", width - margin.right * 4.5 - 10)
    .attr("cy", (_, i) => 490 + i * 20)
    .attr("r", 6)
    .style("fill", d => d)
    .attr("stroke", "black")
    .attr("opacity", "0.6")

  // Color labels for Color Legend
  svg.selectAll(".legend-genre")
    .data(["Old", "Recent", "New"])
    .join("text")
    .attr("class", "legend-genre")
    .attr("x", width - margin.right * 4.3)
    .attr("y", (_, i) => 492 + i * 20)
    .text(d => d)
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")

  // Title for Size Legend
  svg.append("text")
    .text("Airport Size:")
    .attr("x", width - margin.right * 4)
    .attr("y", 355)
    .style("font-size", "1rem")
    .style("font-weight", "bold")

  // Circle Sizes for size Legend
  svg.selectAll(".legend-size")
    .data([2, 3])
    .join("circle")
    .attr("class", "legend-size")
    .attr("cx", d => width - margin.right * 3 - sizeScale(d) / 2 - 5)
    .attr("cy", (_, i) => 378 + i * 35)
    .attr("r", d => sizeScale(d))
    .style("fill", "white")
    .attr("stroke", "black")
    .attr("opacity", "0.6")

  // Size for Size Legend
  svg.selectAll(".legend-size-label")
    .data(["Medium", "Large"])
    .join("text")
    .attr("class", "legend-size-label")
    .attr("x", width - margin.right * 2.5 - 5)
    .attr("y", (_, i) => 380 + i * 35)
    .text(d => d)
    .style("font-size", "15px")
    .attr("alignment-baseline","middle")
});