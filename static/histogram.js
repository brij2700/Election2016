function createHistogram(data, selectedState, selectedACP) {
  // console.log(data)
  var original_col = "#DE3163"
  var transition_col = "lightpink"
  d3.select("#histogram").selectAll("*").remove();
  var all_data = data['USA']['all_types']

  var data = data[selectedState][selectedACP]


  var bins = d3.histogram()
    .domain([0, d3.max(data)])
    .thresholds(10)
    (data);
  // console.log(bins)
  tickvalues = []
  for (var i = 0; i < bins.length; i++) {

    tickvalues.push((bins[i].x0 + bins[i].x1) / 2)
  }
  // console.log()
  xAxisLabel = "Weekly wages"
  var margin = { top: 40, right: 30, bottom: 100, left: 90 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  offset = 0;

  // append the svg object to the body of the page
  var svg = d3.select("#histogram")
    .append("svg")
    .attr("width", width + offset + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var dollarPattern = svg.append("defs")
    .append("pattern")
    .attr("id", "dollar-pattern")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 100)
    .attr("height", 100)
    .append("image")
    .attr("xlink:href", "static/images.png")
    .attr("width", 100)
    .attr("height", 100);

  var x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, width])
    .nice()


  // console.log(tickvalues)

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickValues(tickvalues))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");
  svg.append('text')
    .attr('class', 'axis-label')
    .attr('y', height + margin.bottom / 2)
    .attr('x', (width + offset) / 4)

    .attr('font-size', '15')
    // .attr('fill', 'black')
    .text(xAxisLabel);




  var y = d3.scaleLinear()
    .range([height, 0])
    .nice();
  y.domain([0, d3.max(bins, function (d) { return d.length; })]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append('text')
    .attr('class', 'axis-label')
    .attr('y', -50)
    .attr('x', -height / 2)
    .attr('font-size', '15')
    // .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text("Number of Counties");

  var bar_width = width / bins.length


  var mouseevent = d3.select("#histogram").append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);

  svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", bar_width)
    // .attr("fill", original_col)
    .attr("fill", "url(#dollar-pattern)")
    .style("opacity", "0.9")
    .style("stroke-width", "1")
    .style("stroke", "rgb(255,255,255)")
    .on('mouseover', function (i, d) {

      d3.select(this).transition()
        .duration('50')
        .attr('fill', transition_col);
      mouseevent.transition()
        .duration(50)
        .style("opacity", 1);

      mouseevent.html(i.length)
        .style("left", (x.pageX + 10) + "px")
        .style("top", (x.pageY - 15) + "px");
    })
    .on('mouseout', function (i, d) {

      d3.select(this).transition()
        .duration('50')
        .attr("fill", "url(#dollar-pattern)")
      mouseevent.transition()
        .duration(50)
        .style("opacity", 0);
    })


    .transition()
    .duration(2000)
    .attr("height", function (d) { return height - y(d.length); });



  svg.append('text')
    .attr('class', 'title')
    .attr('y', -20)
    .text("Average Weekly wages of " + selectedACP + " in " + selectedState)
    .attr("font-size", "20")
}