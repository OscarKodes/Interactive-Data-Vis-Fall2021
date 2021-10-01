/* CONSTANTS AND GLOBALS */
const height = window.innerHeight * 0.85,
  width = height, // Intentionally square shaped scatterplot (100% vs 100%)
  margin = 50;

/* LOAD DATA */
d3.csv("Movie-Ratings.csv", d3.autoType).then(data => {

  // Plan for scatterplot:
    // x = Rotten Tomatoes Ratings %
    // y = Audience Ratings %
    // size = Budget (million $)
    // color = Genre

  /* SCALES ##################################################### */

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d["Rotten Tomatoes Ratings %"]))])
    .range([margin, width - margin])

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d["Audience Ratings %"])])
    .range([height - margin, margin])

  const colorScale = d3.scaleOrdinal()
    .domain(["Comedy", "Drama", "Adventure", "Thriller", "Horror", "Action", "Romance"])
    .range(["Yellow", "Red", "Green", "Purple", "Black", "Blue", "Pink"])

  const sizeScale = d3.scaleSqrt()
    .domain([1, d3.max(data, d => d["Budget (million $)"])])
    .range([2, 16]);


  /* HTML ELEMENTS ############################################## */

  // SVG CANVAS -----------------------------------------------
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lavender")

  // AXIS TICKS  ----------------------------------------------
  svg.append("g")
    .attr("transform", `translate(0,${height - margin})`)
    .call(d3.axisBottom(xScale));
  
  svg.append("g")
    .attr("transform", `translate(${margin},0)`)
    .call(d3.axisLeft(yScale));

  // AXIS LABELS ----------------------------------------------
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin * 2)
    .attr("y", height - 6)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .text("Rotten Tomatoes Ratings %");

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -height / 2 + margin * 2)
    .attr("y", 15)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .attr("transform", "rotate(-90)")
    .text("Audience Ratings %");

  // INVISIBLE TOOLTIP DIV -----------------------------------
  const tooltip = d3.select("#container")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

  // TOOLTIP MOUSE OVER EVENT HANDLER ------------------------
  const tipMouseover = function(event, d) {

    // Dynamic html to put inside tooltip div catered to specific film
    const tooltipHTML = `<b>Title:</b> ${d.Film}<br/>
                          <b>Genre:</b> ${d.Genre}</span><br/>
                          <b>Rotten Tomatoes:</b> ${d["Rotten Tomatoes Ratings %"]}%<br/>
                          <b>Audience Ratings:</b> ${d["Audience Ratings %"]}%<br/> 
                          <b>Budget:</b> $${d["Budget (million $)"]} million (USD)<br>
                          <b>Year:</b> ${d["Year of release"]}`;

    let color = colorScale(d.Genre);
    let size = sizeScale(d["Budget (million $)"]);

    // Position the invisible tooltip div above and left of hovering cursor
    tooltip.html(tooltipHTML)
      .style("left", ((d.Film.length >= 20 ? // Dynamic positioning if long film title
                        event.pageX - 160 - ((d.Film.length - 19) * 5) : 
                        event.pageX - 160) + "px"))  
      .style("top", (event.pageY - 120 - 0.5 * size + "px"))
      .style("border", `${color} solid 0.2rem`) // Same border color as genre
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

  // DOTS FOR SCATTERPLOT ----------------------------------

  const dot = svg
    .selectAll(".dot") // Line below sorts films by largest budget to smallest, so small dots appear on top
    .data(data.sort((a, b) => b["Budget (million $)"] - a["Budget (million $)"])) 
    .join("circle")
    .attr("class", "dot")
    .attr("transform", d => `translate(${xScale(d["Rotten Tomatoes Ratings %"])}, ${yScale(d["Audience Ratings %"])})`)
    .attr("r", d => sizeScale(d["Budget (million $)"]))
    .attr("fill", d => colorScale(d.Genre))
    .attr("stroke", "black")
    .attr("opacity", "0.4")
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);


  // FILM TITLE LABELS ON HOVERED DOTS -----------------------

  // NOTE: Not used. Decided to replace with tooltips.

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