function createPieChart(data, selectedState, selectedACP) {
  // console.log(data['USA']['all_types'])
  d3.select("#pie-chart").selectAll("*").remove();
  // console.log(data)
  data = data[selectedState][selectedACP]

  // console.log(data)
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;
  const colors = d3.scaleOrdinal()
    .domain(Object.keys(data))
    .range(d3.schemeSet2);

  const svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const pie = d3.pie()
    .value(d => d.value);

  const data_ready = pie(d3.entries(data));

  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  svg.selectAll('slices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', d => colors(d.data.key))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1);

  keys = ["Republic", "Democratic"]
  svg.selectAll('slices')
    .data(data_ready)
    .enter()
    .append('text')
    .text((d, i) => `${keys[i]}: ${d.data.value}`)
    .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
    .style('text-anchor', 'middle')
    .style('font-size', 12);

  // Define the bottom label text
  var label = "Number of counties won in " + selectedState;

  // Append a text element to the SVG
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text(label);


}