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

  // CREATE SCALES / PROJECTIONS
  const projection = d3.geoAlbersUsa()
    .fitSize([width - margin.left - margin.right,
              height - margin.top - margin.bottom],
              usMapData);

  const sizeScale = d3.scaleSqrt()
      .domain([1, 3])
      .range([2, 8])

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
  
  // // PLACE POINT FOR GRAD CENTER
  // const gradCenterCoordinates =  { latitude: 40.7423, longitude: -73.9833 };
  // svg.selectAll(".gradcenter-point")
  //   .data([gradCenterCoordinates])
  //   .join("circle")
  //   .attr("class", "gradcenter-point")
  //   .attr("r", 10)
  //   .attr("fill", "gold")
  //   .attr("transform", d => {

  //     const [x, y] = projection([d.longitude, d.latitude])

  //     return `translate(${x}, ${y})`
  //   });

  // DRAW AIRPORT POINTS
  svg.selectAll(".capital-points")
    .data(airportData)
    .join("circle")
    .attr("class", "capital-points")
    .attr("r", d => sizeScale(d.Size))
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