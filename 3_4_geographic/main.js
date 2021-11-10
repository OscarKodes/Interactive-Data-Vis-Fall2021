// CONSTANTS
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = { top: 25, bottom: 50, left: 50, right: 25 };


/**
* APPLICATION STATE
* */
let state = {

};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
 d3.json("usState.json"),
 d3.csv("airport-clean-data.csv")
]).then(([geojson, data]) => {
 state.geojson = geojson;
 state.data = data;

 console.log("state: ", state);
 console.log("data: ", data);

 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
 
    const projection = d3.geoAlbersUsa()
        .fitSize([width - margin.left - margin.right, 
            height - margin.top - margin.bottom], 
            state.geojson);
        // Fit size tells D3 to fit usMapData into the specified x and y area

    // CREATE SVG
    const svg = d3.select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // PATH GENERATOR FOR MAP
    const pathGen = d3.geoPath(projection);

    // DRAW THE US MAP USING THE PATH GEN
    const states = svg.selectAll(".state-path")
        .data(state.geojson.features)
        .join("path")
        .attr("class", "state-path")
        .attr("stroke", "black")
        .attr("fill", "transparent")
        .attr("d", pathGen)

    draw(); // calls the draw function
}

/**
* DRAW FUNCTION
* we call this every time there is an update to the data/state
* */
function draw() {
 

}