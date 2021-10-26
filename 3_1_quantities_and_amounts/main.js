// CONSTANTS ###############################
const 
  height = window.innerHeight * 0.8
  width = window.innerWidth * 0.8 > height ?
            height  :
            window.innerWidth * 0.8,
  margin = {
    top: 30,
    left: 50,
    right: 50,
    bottom: 60
  };

let xScale, yScale, colorScale, xAxis, yAxis;

// APPLICATION STATE ########################
let state = {
  data: [],
};

// LOAD DATA ###############################
d3.csv('CLEANED_OscarRaces.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  state.data = raw_data;
  init();
});

// INITIALIZING FUNCTION ###################
function init() {
  
  // SCALES ----------------------------------
  
  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.races))
    .range([margin.left, width - margin.right])
    .paddingInner(.2)
    .paddingOuter(.1);

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.count))
    .range([height - margin.top, margin.bottom])
    .nice();
  
  colorScale = d3.scaleOrdinal()
    .domain(state.data.map(d => d.races))
    .range(d3.schemePastel1);

  // AXIS -------------------------------------

  xAxis = d3.axisBottom()
    .scale(xScale);

  yAxis = d3.axisLeft()
    .scale(yScale);

  draw(); 
}

// DRAW FUNCTION ###############################
function draw() {
  
  // HTML ELEMENTS ----------------------------

  // SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  // X AXIS TICKS
  svg.append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
    .call(xAxis)
    .attr("font-weight", "bold");

  // Y AXIS TICKS
  svg.append("g")
    .attr("transform", `translate(${margin.left * 2}, ${-margin.top})`)
    .call(yAxis);

  // X AXIS TITLE
  svg.append("text")
    .attr("transform", 
      `translate(${width / 2 - margin.right * 2}, ${height - margin.bottom / 4})`)
    .attr("font-size", "1.15rem")
    .attr("font-weight", "bold")
    .text("Race of Oscar Award Winner");

  // X AXIS TITLE
  svg.append("text")
    .attr("y", margin.left)
    .attr("x", -margin.bottom * 8)
    .attr("font-size", "1.15rem")
    .attr("transform", "rotate(-90)")
    .attr("font-weight", "bold")
    .text("Number of Winners");

  // BAR NUMBERS
  svg.selectAll(".bar-nums")
    .data(state.data)
    .join(
      enter => enter
        .append("text")
        .attr("class", "bar-nums")
        .attr("y", height - margin.bottom)
        .attr("x", d => xScale(d.races) + 
                          margin.left + 
                          xScale.bandwidth() / 2 -
                          (String(d.count).length * 3.5))
        .attr("opacity", 0)
        .text(d => `${d.count}`)
        .call(enter => enter
          .transition()
            .duration((_, i) => i < 1 ? 3600 : 600)
            .attr("opacity", 1)
            .attr("y", d => yScale(d.count) - margin.bottom - 8)
        )
    )

  // BARS
  svg.selectAll("rect.bar")
    .data(state.data)
    .join(
      enter => enter
        .append("rect")
        .attr("class", "bar")
        .attr("width", xScale.bandwidth())
        .attr("x", d => xScale(d.races) + margin.left)
        .attr("y", height - margin.bottom)
        .attr("fill", d => colorScale(d.races))
        .attr("stroke", "black")
        .call(enter => enter
          .transition()
            .duration((_, i) => i < 1 ? 3500 : 500)
            .attr("height", d => height - yScale(d.count))
            .attr("y", d => yScale(d.count) - margin.bottom)
            )
        )
}