// @TODO: YOUR CODE HERE!

var svgWidth = 650;
var svgHeight = 450;
var margin = {top: 20, right: 20, bottom: 60, left: 90};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Layout elements
var svg = d3.select("#scatter").append("svg")
    .attr("width",svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var chart = svg.append('g');

// Define the div for the tooltip
var div = d3.select("#scatter").append("div")
    .attr("class", "d3-tip")
    .style("opacity", 0);


d3.csv("assets/data/data.csv")
    .then(data => {
        // Healthcare vs Poverty
        data.forEach(function (d) {
            d.healthcare = +d.healthcare;
            d.poverty = +d.poverty;
        })
   
    // Scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(data, function(d) {
        return +d.poverty;
    });

    xMax = d3.max(data, function(d) {
        return +d.poverty;
    });

    yMin = d3.min(data, function(d) {
        return +d.healthcare;
    });

    yMax = d3.max(data, function(d) {
        return +d.healthcare;
    });
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

        
    // Initialize tooltip 
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        // .style("left", (d3.event.pageX) + "px")
        // .style("top", (d3.event.pageY) + "px")
        .html(function(d) {
            var stateName = d.state;
            var pov = +d.poverty;
            var healthcare = +d.healthcare;
            return (
                stateName + '<br> Poverty: ' + pov + '% <br> Health Care: ' + healthcare +'%'
            );
        });

    // Create tooltip
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xLinearScale(d.poverty)
        })
        .attr("cy", function(d) {
            return yLinearScale(d.healthcare)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")
        
        .on("mouseenter", function(d) {
            toolTip.show(d);
        })
  
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });
    // Appending a label to each data point
    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(data)
        .enter()
        .append("tspan")
            .attr("x", function(d) {
                return xLinearScale(d.poverty);
            })
            .attr("y", function(d) {
                return yLinearScale(d.healthcare);
            })
            .text(function(d) {
                return d.abbr
            });
            chart
            .append("g")
            .attr('transform', `translate(0, ${height})`)
            .call(bottomAxis);
    
       
        chart.append("g").call(leftAxis);
    
        // Append y-axis label
        chart
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0-margin.left + 40)
            .attr("x", 0 - height/2)
            .attr("dy","1em")
            .attr("class", "axis-text")
            .text("Lack of Healthcare (%)")
    
        // Append x-axis label
        chart
            .append("text")
            .attr(
                "transform",
                "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
            )
            .attr("class", "axis-text")
            .text("In Poverty (%)");
        });


