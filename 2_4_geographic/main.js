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
  d3.csv("stateCapitals.csv", d3.autoType),
]).then(([usMapData, capitalsData]) => {
  
  console.log([usMapData, capitalsData])

  // CREATE SCALES / PROJECTIONS
  const projection = d3.geoAlbersUsa()
    .fitSize([width - margin.left - margin.right,
              height - margin.top - margin.bottom],
              usMapData);

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
  
  // PLACE POINT FOR GRAD CENTER
  const gradCenterCoordinates =  { latitude: 40.7423, longitude: -73.9833 };
  svg.selectAll(".gradcenter-point")
    .data([gradCenterCoordinates])
    .join("circle")
    .attr("class", "gradcenter-point")
    .attr("r", 10)
    .attr("fill", "gold")
    .attr("transform", d => {

      const [x, y] = projection([d.longitude, d.latitude])

      return `translate(${x}, ${y})`
    });

  // DRAW STATE CAPITAL POINTS
  svg.selectAll(".capital-points")
    .data(capitalsData)
    .join("circle")
    .attr("class", "capital-points")
    .attr("r", 5)
    .attr("fill", "lightsalmon")
    .attr("transform", d => {

      const [x, y] = projection([d.longitude, d.latitude])

      return `translate(${x}, ${y})`
    });

});