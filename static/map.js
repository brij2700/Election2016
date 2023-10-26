function createMap(data){
   
    // import * as d3 from 'd3';
    // import * as topojson from 'topojson-client';

   
    var temp = data;
    // console.log(data[0]);

    // Define the dimensions of the map
    const width = 960;
    const height = 600;

    // Define the projection to be used for the map
    const projection = d3.geoAlbersUsa()
        .scale(1280)
        .translate([width / 2, height / 2]);

    // Define the path generator
    const path = d3.geoPath().projection(projection);

    // Create a SVG element to contain the map
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define the color scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues);

    // Load the US counties data in TopoJSON format
    d3.json("https://d3js.org/us-10m.v1.json").then(function (us) {

        // Create a GeoJSON feature for each county in the data
        const counties = topojson.feature(us, us.objects.counties);
        // console.log(counties);
        // Load the data from the CSV file
        // d3.csv("CSE_564_final.csv", function (data) {

        // Convert the FIPS codes to numbers for easier matching
        temp.forEach(function (d) {
            d["FIPS"] = +d["FIPS"];
            d["Type Number"] = +d["Type Number"];
        });

        // Compute the min and max values of the data
        const minValue = d3.min(temp, d => d["Type Number"]);
        const maxValue = d3.max(temp, d => d["Type Number"]);

        // Set the color domain of the color scale
        colorScale.domain([minValue, maxValue]);

        // Create a map of the data values by FIPS code
        // const dataMap = d3.map(data, d => d["FIPS"]);
        const dataGroup = d3.group(temp, d => d["FIPS"]);

        // Create a Map object from the grouped data
        const dataMap = new Map(dataGroup);
        // console.log(dataGroup);
        // Add the counties to the map
        // var c = 0;
        console.log(dataMap);
        svg.append("g")
            .selectAll("path")
            .data(counties.features)
            // .data(temp)
            .enter()
            .append("path")
            // .join("path")
            .attr("d", path)
            .attr("fill", function (d) {
                // Lookup the value for this county by its FIPS code
                const value = dataMap.get((+d.id));
                // console.log(+d.id);
                // console.log(value);
                if (value) {
                    // value = (value[0]["Type Number"]);
                    const ans = colorScale(value[0]["Type Number"]);;
                    // console.log(ans);
                    return colorScale(value[0]["Type Number"]);

                }
                else {
                    // value = 0;
                    // c = c + 1;
                    return "#ccc";
                }
                // Map the value to a color using the color scale
                // return value ? colorScale(value.value) : "#ccc";
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5);
        // console.log(c);
        // Add a legend to the map
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(20,20)");

        const legendTitle = legend.append("text")
            .attr("class", "legend-title")
            .text("Data Values");

        const legendGradient = legend.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "0%")
            .attr("y2", "0%");

        legendGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", colorScale(minValue))
            .attr("stop-opacity", 1);

        legendGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", colorScale(maxValue))
            .attr("stop-opacity", 1);

        // Add a rectangle to display the color scale gradient
        const legendRect = legend.append("rect")
            .attr("class", "legend-gradient")
            .attr("width", 16)
            .attr("height", 150)
            .style("fill", "url(#gradient)");

        // Add the minimum value label
        legend.append("text")
            .attr("class", "legend-label")
            .attr("x", 20)
            .attr("y", 155)
            .text(minValue);

        // Add the maximum value label
        legend.append("text")
            .attr("class", "legend-label")
            .attr("x", 20)
            .attr("y", 20)
            .text(maxValue);
    })
}