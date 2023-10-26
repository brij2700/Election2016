function createBarChart(data, selected) {
  ori_data = data
  data = data[selected]
  // console.log(data)
  const colors = {
    "Rural Middle America": "#ff8a65",
    "Evangelical Hubs": "#ffd54f",
    "African American South": "#b39ddb",
    "Graying America": "#7986cb",
    "Working Class Country": "#81c784",
    "Exurbs": "#dce775",
    "Hispanic Centers": "#ffd180",
    "Aging Farmlands": "#f48fb1",
    "College Towns": "#80deea",
    "Urban Suburbs": "#90a4ae",
    "Military Posts": "#a1887f",
    "Middle Suburbs": "#ce93d8",
    "Big Cities": "#4dd0e1",
    "LDS Enclaves": "#bcaaa4",
    "Native American Lands": "#ffab91"
  }

  var margin = { top: 40, right: 20, bottom: 110, left: 40 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Define the x and y scales
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  // Define the x and y axis
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y).ticks(5);
  d3.select("#bar-chart").selectAll("*").remove();
  // Define the chart area
  var resetButton = d3.select("#bar-chart")
    .append("button")
    .text("Reset")
    .on("click", function () {
      // Reset selected bar

      createBarChart(ori_data, selected)
      createHistogram(state_wages, selectedState, "all_types")
      createPieChart(party_count, selectedState, "all_types")
    });
  var svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  // console.log(colors["Rural Middle America"])
  // Update the x and y domains
  x.domain(Object.keys(data));
  y.domain([0, d3.max(Object.values(data))]);

  // console.log(xAxis)
  // Add the x axis to the chart area
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-60)")
    .style("fill", function (d, i) { return colors[d]; })
    .style("text-anchor", "end");


  // Add the y axis to the chart area
  svg.append("g")
    .call(yAxis);

  // Add the bars to the chart area
  bars = svg.selectAll(".bar")
    .data(Object.entries(data))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d[0]); })
    .attr("width", x.bandwidth())
    .attr("y", function (d) { return y(d[1]); })
    .attr("height", function (d) { return height - y(d[1]); })
    .attr("fill", function (d, i) { return colors[d[0]]; })





  bars.on("mouseover", function (d) {
    d3.select(this)
      // .attr("fill", )
      .attr("stroke", function (d, i) { return colors[d[0]]; })
      .attr("stroke-width", "3")
      .append("title")
      .text(function (d) { return d[1]; });
    d3.select(this)
      .attr("stroke-width", "10")
    var bar = d3.select(this);
    var barData = bar.data()[0];
    var count = barData[1];
    svg.append("text")
      .attr("class", "bar-count")
      .attr("x", bar.attr("x"))
      .attr("y", y(count) - 10)

      .text(count)
      .style("text-anchor", "middle");
  })
    .on("mouseout", function (d) {
      svg.select(".bar-count").remove();

      d3.select(this)
        .attr("stroke-width", "0")
        .select("title").remove()


    })
    .on("click", function (d) {
      bars.attr("fill", "#02576c").classed("selected", false);
      d3.select(this)
        .attr("fill", function (d, i) { return colors[d[0]]; })
        .attr("stroke-width", "0")
        .classed("selected", true);
      createPieChart(party_count, selected, d[0])
      createHistogram(state_wages, selected, d[0]);
    });

  svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 6)
    .attr('y', -20)
    .text("Types of Counties in " + selected)
    .attr("font-size", "20")

  // Add the color legend
  // var color = d3.scaleOrdinal(d3.schemeCategory10)
  //     .domain(Object.keys(data));

  // var legend = svg.selectAll(".legend")
  //     .data(Object.entries(data))
  //     .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  //     legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d[0]; });
}