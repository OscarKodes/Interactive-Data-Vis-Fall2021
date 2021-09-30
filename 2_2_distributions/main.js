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
  const sizeScale = d3.scaleSqrt()
    .domain([1, d3.max(data, d => d["Budget (million $)"])])
    .range([2, 16]);

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

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Rotten Tomatoes Ratings %");

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Audience Ratings %");


  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  const tooltip = d3.select("#container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

  // tooltip mouseover event handler
  const tipMouseover = function(event, d) {

    let html  = `<b>Title:</b> ${d.Film}<br/>
                  <b>Genre:</b> ${d.Genre}</span><br/>
                  <b>Rotten Tomatoes:</b> ${d["Rotten Tomatoes Ratings %"]}%<br/>
                  <b>Audience Ratings:</b> ${d["Audience Ratings %"]}%<br/> 
                  <b>Budget:</b> $${d["Budget (million $)"]} million (USD)<br>
                  <b>Year:</b> ${d["Year of release"]}`;

    let color = colorScale(d.Genre);
    let size = sizeScale(d["Budget (million $)"]);

    tooltip.html(html)
      .style("left", ((d.Film.length >= 20 ? 
                        event.pageX - 160 - ((d.Film.length - 19) * 5) : 
                        event.pageX - 160) + "px"))  
      .style("top", (event.pageY - 120 - 0.5 * size + "px"))
      .style("border", `${color} solid 0.2rem`)
      .style("outline", "1px solid black")
      .transition()
        .duration(100) 
        .style("opacity", .85)

    // highlight the circles
    d3.select(this)
      .transition()
      .duration(100)
      .style("opacity", 1);
  };

  // tooltip mouseout event handler
  let tipMouseout = function(d) {
      tooltip.transition()
          .duration(200) // ms
          .style("opacity", 0); // don't care about position!

      // Unhighlight circles
      d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 0.5);
  };

  // Circles ----------------
  const dot = svg
    .selectAll(".dot")
    .data(data, d => d.Film) // second argument is the unique key for that row
    .join("circle")
    .attr("class", "dot")
    .attr("transform", d => `translate(${xScale(d["Rotten Tomatoes Ratings %"])},
                                        ${yScale(d["Audience Ratings %"])})`)
    .attr("r", d => sizeScale(d["Budget (million $)"]))
    .attr("fill", d => colorScale(d.Genre))
    .attr("stroke", "black")
    .attr("opacity", "0.4")
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);

  
  // Labels for Circles ---------------

  // Not used. Replaced by tooltips.

  // const text = svg
  //   .selectAll("text")
  //   .data(data)
  //   .enter()
  //   .append("text")
  //   .attr("x", d => xScale(d["Rotten Tomatoes Ratings %"]))
  //   .attr("y", d => yScale(d["Audience Ratings %"]))
  //   .text(d => d.Film)
  //   .style("opacity", 0)
  //   .on("mouseover", function(d) {
  //     d3.select(this)
  //       .transition()
  //       .duration("100")
  //       .style("opacity", 1)
  //   })
  //   .on("mouseout", function(d) {
  //     d3.select(this)
  //       .transition()
  //       .duration("200")
  //       .style("opacity", 0)
  //   });
});