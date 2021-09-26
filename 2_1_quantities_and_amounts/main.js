/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8;
const height = 300;

const pastel1Colors = d3.scaleOrdinal(d3.schemePastel1);
const pastel2Colors = d3.scaleOrdinal(d3.schemePastel2);
const accentColors = d3.scaleOrdinal(d3.schemeAccent);
const schemeSet3Colors = d3.scaleOrdinal(d3.schemeSet3);

/* LOAD DATA */
d3.csv('./swiftSales.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.usSales)])
    .range([0, width]) // visual variable

    const yScale = d3.scaleBand()
    .domain(data.map(d => d.album))
    .range([0, height])
    .paddingInner(.2)

    // AXIS
    const xAxis = d3.axisBottom()
    .scale(xScale);

    const yAxis = d3.axisLeft()
    .scale(yScale);
    

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    
    // svg display area
    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 100)

    // bars
    svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", d => xScale(d.usSales))
    .attr("height", yScale.bandwidth())
    .attr("x", 0)
    .attr("y", d => yScale(d.album))
    .attr("fill", schemeSet3Colors)
    .attr("transform", "translate(100, 0)");

    // xAxis labels
    svg.append("g")
    .attr("transform", "translate(100, 300)")
    .call(xAxis);
    
    // yAxis labels
    svg.append("g")
    .attr("transform", "translate(100, 0)")
    .call(yAxis);
  });