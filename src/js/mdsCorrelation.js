window.addEventListener('load', (event) => {

async function getMDSDataCrd(){
    const url = "http://localhost:5000/fetchMDSCorrData"
    let response = await fetch(url)
    mdsData = await response.json()
    drawMDSScatter(mdsData)
}

function drawMDSScatter(data){
    d3.selectAll('.rBottomLeft svg').remove()
    var margin = {
        top: 10, 
        right: 50, 
        bottom: 40, 
        left: 60
    },
    width = 400 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;
    
    var svg = d3.select(".rBottomLeft")
        .append("svg")
        .attr("class", 'corrSvg')
        .attr("width", '420')
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Component1)).nice()
        .range([ 0, width ]);
    
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("stroke", "#33CC99")
        .call(d3.axisBottom(x));
    
    xAxis.append('text')
        .attr('class', 'bar_x_axis-label')
        .attr('y', 33)
        .attr('x', width / 2)
        .attr('fill', 'black')
        .text("Dimension 1")
        .attr("stroke", "#4997D0")
        .style("font-size","14px")
        .attr("font-family","sans-serif");

    var y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Component2)).nice()
        .range([ height, 0]);
    
    var yAxis = svg.append("g")
        .attr("stroke", "#33CC99")
        .call(d3.axisLeft(y));    

    yAxis.append('text')
        .attr('class', 'axis-label')
        .attr('y', -30)
        .attr('x', (-height+10)/2)
        .attr('fill', 'black')
        .text("Dimesnion 2")
        .attr("stroke", "#4997D0")
        .attr("transform","rotate(-90)")
        .style("font-size","14px")
        .attr("font-family","sans-serif");

    svg.append('g')
    .attr("stroke", "#D92121")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .transition()
        .duration(900)
        .attr("cx", function (d) { return x(d.Component1); } )
        .attr("cy", function (d) { return y(d.Component2); } )
        .attr("r", 5.5)
        .style("fill","#FF7A00")

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("dy", "0.35em")
        .attr('stroke','#33CC99')
        .attr("x", d => x(d.Component1) + 7)
        .attr("y", d => y(d.Component2))
        .text(d => d.name);
}
getMDSDataCrd()

});