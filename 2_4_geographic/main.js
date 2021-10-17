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
  
  console.log([usMapData, airportData])

  // FIlTER OUT SMALL AIRPORTS
  // SORT MEDIUM AIRPORTS FIRST
  airportData = airportData
                .filter(d => d.Size !== 1)
                .sort((a, b) => a.Size - a.Size);

  // CREATE SCALES / PROJECTIONS
  const projection = d3.geoAlbersUsa()
    .fitSize([width - margin.left - margin.right,
              height - margin.top - margin.bottom],
              usMapData);

  const sizeScale = d3.scaleSqrt()
      .domain([2, 3])
      .range([4, 8])

  // CREATE SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // PATH GENERATOR FOR US MAP
  const pathGen = d3.geoPath(projection);

  // DRAW EMPTY US MAP
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

    let size = sizeScale(d.Size);
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

  // DRAW AIRPORT POINTS
  svg.selectAll(".capital-points")
    .data(airportData)
    .join("circle")
    .attr("class", "capital-points")
    .attr("r", d => sizeScale(d.Size))
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout)
    .attr("fill", "skyblue")
    .attr("stroke", "black")
    .attr("opacity", 0.4)
    .attr("transform", d => {

      const [x, y] = projection([d.long, d.lat])

      return `translate(${x}, ${y})`
    });

});


// TO ADD:
/*

- Change color shade b/w green and gray based on recentness of updated data
- Hover over tooltips 
- Hover over opacity 1
- Add legend
- Add Title

*/