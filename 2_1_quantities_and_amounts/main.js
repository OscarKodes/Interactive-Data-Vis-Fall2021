/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * .8;
const height = 600;
const margin = 100;

const pastel1Colors = d3.scaleOrdinal(d3.schemePastel1);
const pastel2Colors = d3.scaleOrdinal(d3.schemePastel2);
const accentColors = d3.scaleOrdinal(d3.schemeAccent);
const schemeSet3Colors = d3.scaleOrdinal(d3.schemeSet3);

/* LOAD DATA */
d3.csv('./swiftSales.csv', d3.autoType)
  .then(data => {

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.usSales)])
      .range([0, width - margin * 2])
      .nice()

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.album))
      .range([0, height - margin])
      .paddingInner(.2)
      .paddingOuter(.1)

    // AXIS
    const xAxis = d3.axisBottom()
      .scale(xScale);

    const yAxis = d3.axisLeft()
      .scale(yScale);
    
    /* HTML ELEMENTS */
    
    // svg 
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // bars
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("width", d => xScale(d.usSales))
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("y", d => yScale(d.album))
      .attr("fill", schemeSet3Colors)
      .attr("transform", `translate(${margin}, 0)`)
      .attr("stroke", "grey");

    // bar numbers
    svg.selectAll(".bar-nums")
      .data(data)
      .join("text")
      .attr("class", "bar-nums")
      .attr("x", d => xScale(d.usSales) + margin + 10)
      .attr("y", d => yScale(d.album) + yScale.bandwidth() / 2)
      .text(d => `${d.usSales} mill`)

    // xAxis ticks
    svg.append("g")
      .attr("transform", `translate(${margin}, ${height - margin})`)
      .style("font-size", "0.8rem")
      .call(xAxis);

    // yAxis ticks
    svg.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .style("font-size", "0.8rem")
      .call(yAxis);

    // xAxis title
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", (width / 2) + margin)
      .attr("y", height - margin * .5)
      .style("font-weight", "bold")
      .style("font-size", "1.1rem")
      .text("Albums Sold (Millions)");

    // yAxis title
    svg.append("text")
      .attr("y", margin / 8)
      .attr("x", -margin * 2.5)
      .attr("transform", "rotate(-90)")
      .style("font-weight", "bold")
      .style("font-size", "1.1rem")
      .text("Album Title");
  });