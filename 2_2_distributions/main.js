/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 };

/* LOAD DATA */
d3.csv("Movie-Ratings.csv", d3.autoType).then(data => {
  console.log(data)

  // x = Rotten Tomatoes Ratings %
  // y = Audience Ratings %
  // size = Budget (million $)
  // color = Genre

  /* SCALES */
  // xscale  - linear,count
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d["Rotten Tomatoes Ratings %"]))])
    .range([margin.left, width - margin.right])

  // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d["Audience Ratings %"])])
    .range([height - margin.bottom, margin.top])

  // color scale
  const colorScale = d3.scaleOrdinal()
    .domain(["Comedy", "Drama", "Adventure", "Thriller", "Horror", "Action", "Romance"])
    .range(["Yellow", "Red", "Green", "Purple", "Black", "Blue", "Pink"])

  // size scale
  const sizeScale = d3.scaleLinear()
    .domain([1, d3.max(data, d => d["Budget (million $)"])])
    .range([2, 20]);

  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // Axis Scales ---------------------
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);
  
  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // Circles ----------------
  const dot = svg
    .selectAll("circle")
    .data(data, d => d.Film) // second argument is the unique key for that row
    .join("circle")
    .attr("transform", d => `translate(${xScale(d["Rotten Tomatoes Ratings %"])},
                                        ${yScale(d["Audience Ratings %"])})`)
    .attr("r", d => sizeScale(d["Budget (million $)"]))
    .attr("fill", d => colorScale(d.Genre))
    .attr("stroke", "grey")
    .attr("opacity", "0.5")
    .on("mouseover", function(d, i) {
      d3.select(this)
        .transition()
        .duration("100")
        .style("opacity", 1)
    })
    .on("mouseout", function(d, i) {
      d3.select(this)
        .transition()
        .duration("200")
        .style("opacity", 0.5)
    });

  // Labels for Circles ---------------
  const text = svg
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xScale(d["Rotten Tomatoes Ratings %"]))
    .attr("y", d => yScale(d["Audience Ratings %"]))
    .text(d => d.Film)
    .style("opacity", 0)
    .on("mouseover", function(d, i) {
      d3.select(this)
        .transition()
        .duration("100")
        .style("opacity", 1)
    })
    .on("mouseout", function(d, i) {
      d3.select(this)
        .transition()
        .duration("200")
        .style("opacity", 0)
    })
});