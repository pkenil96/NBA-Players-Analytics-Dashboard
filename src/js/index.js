window.addEventListener('load', (event) => {


    var currentBarLabel = "";
    var currentHistogramLabel = "";
    var histVal = new Array();
    var barVal = new Array();
    var countryFilter = ""
    var barGlobal = ""





    function createBarPlot(catVal) {

        //Resets any pre-existing svg content on the page
        count = {};
        d3.selectAll(".lBottomCanvas svg").remove();
        // catVal = position;
        //mapping each value to its frequency
        catVal.forEach(e => count[e] ? count[e]++ : count[e] = 1);


        var keys = Object.keys(count);
        var frequency = Object.values(count);


        var margin = { top: 40, right: 30, bottom: 180, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 460 - margin.top - margin.bottom;

        var svg = d3.select(".lBottomCanvas")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", 370)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        x.domain(keys);
        y.domain([0, d3.max(frequency, function (d) { return d; })]);

        // "0.5em"
        // "+0.7em"
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("stroke", "red")
            .attr("transform", "translate(0," + height + ")")
            .transition().duration(1000)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", function () {
                if (currentBarLabel == "Country" || currentBarLabel == "Team" || currentBarLabel == "Draft Class (YYYY)") {
                    return "-.8em"
                } else {
                    return "0.5em"
                }
            })
            .attr("dy", function () {
                if (currentBarLabel == "Country" || currentBarLabel == "Team") {
                    return "-.45em"
                } else if (currentBarLabel == "Draft Class (YYYY)") {
                    return "0.25em"
                } else {
                    return "1.2em"
                }
            })
            .attr("transform", function () {
                if (currentBarLabel == "Country" || currentBarLabel == "Team") {
                    return "rotate(-90)"
                } else if (currentBarLabel == "Draft Class (YYYY)") {
                    return "rotate(-65)"
                } else {
                    return "rotate(0)"
                }
            }); //"rotate(-90)"

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("stroke", "red")
            .transition().duration(1000)
            .call(d3.axisLeft(y).ticks(keys.count));

        //y Axis Label
        var yAxis_label = svg.append("g")
            .append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -42).attr("dy", ".1em")
            .attr("x", -60).attr("dy", ".1em")
            .style("text-anchor", "end").
            text("Number of Players");


        var xAxis_label = svg.append("g")
            .append("text")
            .attr("class", "x-label")
            .attr("y", 290).attr("dy", ".1em")
            .attr("x", 250).attr("dy", ".1em")
            .style("text-anchor", "end").
            text(currentBarLabel);

        // Create rectangles
        let bars = svg.selectAll('.bar')
            .data(keys)
            .enter()
            .append("g")
            .attr('class', 'rectMain');

        //appeding each rect and their co-ordinates are specified
        bars.append('rect')
            .attr('class', 'bar')
            .attr("x", function (d) { return x(d); })
            .attr("y", function (d) { return y(count[d]); })
            .attr("width", x.bandwidth())
            .transition()
            .duration(900)
            .attr("height", function (d) { return height - y(count[d]); })
            .attr('value', function (d) {
                return d;
            })
            .attr("fill", "#CCFF00");  // 66FF66 CCFF00 FAFA37


        //Appending text over the bar
        bars.append("text")
            .text(function (d) {
                return count[d]; // just d to get the corresponding label
            })
            .attr("x", function (d) {
                return x(d) + x.bandwidth() / 2;
            })
            .attr("y", function (d) {
                return y(count[d]) - 5;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "red")
            .attr("text-anchor", "middle")
            .attr('class', 'topText')
            .style('visibility', 'hidden');

        $('.rectMain').on('mouseover', function () {

            $(this).children("text").css('visibility', 'visible');
            $(this).children("rect").css("fill", "#FE4C40");
        })

        $('.rectMain').on('mouseleave', function () {
            $(this).children("text").css('visibility', 'hidden');

            $(this).children("rect").css("fill", "#FFFF66");
        })

        $('.rectMain').on('click', function () {
            console.log($(this).children("rect").attr('value'))

            //Call to change data on Histogram
            barGlobal = $(this).children("rect").attr('value');
            applyBarFilter($(this).children("rect").attr('value'));
        })
    }




    function renderWorldMap() {
        d3.selectAll(".lTopCanvas svg").remove();

        var svg = d3.select(".lTopCanvas").append('svg').attr('class', 'mapCan'),
            width = 180,
            height = 200;

        // Map and projection
        var path = d3.geoPath();
        var projection = d3.geoMercator()
            .scale(80)
            .center([-120, 25])
            .translate([width, height]);

        // Data and color scale
        var data = d3.map();
        var colorScale = d3.scaleThreshold()
            .domain([0, 1, 2, 15, 50, 150, 350])
            .range(d3.schemeGreens[7]);


        // Load external data and boot
        d3.queue()
            .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            //.defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function (d) { data.set(d.code, +d.pop); })
            .defer(d3.csv, "country_pop.csv", function (d) { data.set(d.code, +d.pop); })
            .await(ready);

        function ready(error, topo) {

            let mouseOver = function (d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .5)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "black")
            }

            let mouseclick = function (d) {
                console.log(d.properties.name);
                countryFilter = d.properties.name;
                barGlobal = "";
                applyCountryFilter(d.properties.name);
            }

            let mouseLeave = function (d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .8)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("stroke", "transparent")
            }

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(topo.features)
                .enter()
                .append("path")
                // draw each country
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                // set the color of each country
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    return colorScale(d.total);
                })
                .style("stroke", "transparent")
                .attr("class", function (d) { return "Country" })
                .style("opacity", .8)
                .on("mouseover", mouseOver)
                .on("mouseleave", mouseLeave)
                .on("click", mouseclick)
        }

    }



    //Function to implement histogram
    function buildHistogram(binNumber = 6, numVal = rating) {

        var salaryFlag = false;

        if (currentHistogramLabel == "Annual Salary in USD") {
            salaryFlag = true;
        }

        d3.selectAll(".rTopCanvas svg").remove();

        //Finding min and max value of data 
        var min = numVal[0], max = numVal[0];
        for (var i = 1; i < numVal.length; i++) {
            if (numVal[i] < min) {
                min = numVal[i];
            }
        }

        for (var i = 1; i < numVal.length; i++) {
            if (numVal[i] > max) {
                max = numVal[i];
            }
        }

        var number_of_bins = binNumber;



        //Object creation

        var data = [];

        for (var i = 0; i < age.length; i++) {
            data.push({
                xVar: numVal[i],
            });
        }



        // Setting margins, dimensions of the graph
        var margin = { top: 40, right: 30, bottom: 180, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 460 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".rTopCanvas")
            .append("svg")
            .attr("class", 'hSvg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        // X axis: scale and draw:
        var x = d3.scaleLinear()
            .domain([min - 1, max + 4])
            .range([0, width]);

        svg.append("g")
            .attr('class', 'xTickMain')
            .attr("transform", "translate(0," + height + ")")
            .attr("stroke", "#4997D0")
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr("font-size", "12px");

        if (salaryFlag) {
            svg.select('.xTickMain')
                .selectAll('text')
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");
        }

        // // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function (d) { return d.xVar; })
            .domain(x.domain())
            .thresholds(x.ticks(number_of_bins)); // Setting number of bins

        // // And apply this function to data to get the bins
        var bins = histogram(data);

        // Y axis: scale and draw:
        var y = d3.scaleLinear()
            .range([height, 0]);
        y.domain([0, d3.max(bins, function (d) { return d.length; })]);
        svg.append("g")
            .attr("stroke", "#4997D0")
            .call(d3.axisLeft(y))
            .selectAll('text')
            .attr("font-size", "12px");

        // Appending the rectangles to the svg element (data fed from 'bins')
        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("g")
            .attr("class", "recMain")
            .append("rect")
            .attr("x", 1)
            .attr("class", "rec")
            .transition()
            .duration(700)
            .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; }) //x,y axis co-ordinate
            .attr("width", function (d) {
                if ((x(d.x1) - x(d.x0) - 1) > 0) {
                    return x(d.x1) - x(d.x0) - 1;
                } else {
                    return 0;
                }
            })
            .attr("height", function (d) { return height - y(d.length); }) // height of svg - 'y' Scale times of each bin's length
            .style("fill", "#FD3A4A"); //E77200

        svg.selectAll(".recMain").append("text")
            .text(function (d) {
                if (d.length != 0) {
                    return d.length
                } else {
                    return ""
                };
            })
            .attr("transform", function (d) { return "translate(" + (x(d.x0) + 25) + "," + (y(d.length) - 10) + ")"; }) //x,y axis co-ordinate
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("fill", "red")
            .attr("text-anchor", "middle")
            .attr('class', 'topText')
            .style('visibility', 'hidden');


        var binSizes = [];
        for (var i = 0; i < bins.length; i++) {
            binSizes[i] = bins[i].length;
        }


        //Labels for x and y axes
        var yAxis_label = svg.append("g")
            .append("text")
            .attr("class", "y-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -45).attr("dy", ".1em")
            .attr("x", -60).attr("dy", ".1em")
            .style("text-anchor", "end").
            text("Number Of Players");


        var xAxis_label = svg.append("g")
            .append("text")
            .attr("class", "x-label")
            .attr("y", 290).attr("dy", ".1em")
            .attr("x", 220).attr("dy", ".1em")
            .style("text-anchor", "end").
            text(currentHistogramLabel);

        if (salaryFlag) {
            xAxis_label
                .attr("y", 340).attr("dy", ".1em")
                .attr("x", 260).attr("dy", ".1em")
        }

        $('.hSvg').css('height', '400px');
        //binChange();




        //Write on hover function for histogram 
        $('.recMain').on('mouseover', function () {

            $(this).children("text").css('visibility', 'visible');

            $(this).children("rect").css("fill", "#5DADEC");
        })

        $('.recMain').on('mouseleave', function () {

            $(this).children("text").css('visibility', 'hidden');

            $(this).children("rect").css("fill", "#E77200");
        })

    }

    $('.menuContainer button').on('click', function () {
        var field = this.value;
        constructPlot(field)
    });


    function constructPlot(filter) {
        switch (filter) {
            case 'age':
                currentHistogramLabel = "Player Age";
                histVal = age;
                if (barGlobal == "") {
                    buildHistogram(6, age);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            case 'rating':
                currentHistogramLabel = "Player Rating";
                histVal = rating;
                if (barGlobal == "") {
                    buildHistogram(6, rating);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            case 'height':
                currentHistogramLabel = "Height (cm)";
                histVal = height;
                if (barGlobal == "") {
                    buildHistogram(6, height);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            case 'weight':
                currentHistogramLabel = "Weight (kg)";
                histVal = weight;
                if (barGlobal == "") {
                    buildHistogram(6, weight);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            case 'team':
                currentBarLabel = "Team";
                barVal = team;
                createBarPlot(team);
                break;
            case 'draftClass':
                currentBarLabel = "Draft Class (YYYY)";
                barVal = draft_year;
                createBarPlot(draft_year);
                break;
            case 'draftPick':
                currentHistogramLabel = "Draft Pick";
                histVal = draft_pick;
                if (barGlobal == "") {
                    buildHistogram(6, draft_pick);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            case 'draftRound':
                currentBarLabel = "Draft Round";
                barVal = draft_round;
                createBarPlot(draft_round);
                break;
            case 'salary':
                currentHistogramLabel = "Annual Salary in USD";
                histVal = salary;
                if (barGlobal == "") {
                    buildHistogram(6, salary);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            case 'position':
                currentBarLabel = "Playing Position";
                barVal = position;
                createBarPlot(position);
                break;
            case 'country':
                currentBarLabel = "Country";
                barVal = country;
                createBarPlot(country);
                break;
            case 'jersey':
                currentHistogramLabel = "Jersey Number";
                histVal = jersey_number;
                if (barGlobal == "") {
                    buildHistogram(6, jersey_number);
                } else {
                    applyBarFilter(barGlobal);
                }
                break;
            default:
                console.log(".");
        }
    }


    function applyCountryFilter(ctryFilter = "none") {

        //Required to store the current country filter in a global level
        countryFilter = ctryFilter

        //Setting value of span element repping country 
        if (countryFilter == "none") {
            jQuery('#countryFilter').text('N/A');
        } else if (countryFilter == "USA") {
            jQuery('#countryFilter').text('United States of America');
        } else {
            jQuery('#countryFilter').text(countryFilter);
        }

        jQuery('#barTag').css('visibility', 'hidden');
        jQuery('#barLabel').text('');
        jQuery('#barFilter').text('');

        var barData = [];
        var histData = [];

        if (ctryFilter == "none") {
            if (currentBarLabel == "Team") {
                barData = team;
            } else if (currentBarLabel == "Country") {
                barData = country;
            } else if (currentBarLabel == "Playing Position") {
                barData = position;
            } else if (currentBarLabel == "Draft Class (YYYY)") {
                barData = draft_year;
            }
            else if (currentBarLabel == "Draft Round") {
                barData = draft_round;
            }
        } else {
            if (currentBarLabel == "Team") {
                for (var i = 0; i < team.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        barData[i] = team[i];
                    }
                }
            } else if (currentBarLabel == "Playing Position") {
                for (var i = 0; i < position.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        barData[i] = position[i];
                    }
                }
            } else if (currentBarLabel == "Country") {
                for (var i = 0; i < country.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        barData[i] = country[i];
                    }
                }
            }
            else if (currentBarLabel == "Draft Class (YYYY)") {
                for (var i = 0; i < draft_year.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        barData[i] = draft_year[i];
                    }
                }
            } else if (currentBarLabel == "Draft Round") {
                for (var i = 0; i < draft_round.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        barData[i] = draft_round[i];
                    }
                }
            }
        }


        if (ctryFilter == "none") {
            if (currentHistogramLabel == "Player Rating") {
                histData = rating;
            } else if (currentHistogramLabel == "Height (cm)") {
                histData = height;
            } else if (currentHistogramLabel == "Player Age") {
                histData = age;
            } else if (currentHistogramLabel == "Weight (kg)") {
                histData = weight;
            } else if (currentHistogramLabel == "Draft Pick") {
                histData = draft_pick;
            }
            else if (currentHistogramLabel == "Annual Salary in USD") {
                histData = salary;
            }
            else if (currentHistogramLabel == "Jersey Number") {
                histData = salary;
            }
        } else {
            if (currentHistogramLabel == "Player Rating") {
                for (var i = 0; i < rating.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(rating[i])
                    }
                }
            } else if (currentHistogramLabel == "Height (cm)") {
                for (var i = 0; i < height.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(height[i]);
                    }
                }
            } else if (currentHistogramLabel == "Weight (kg)") {
                for (var i = 0; i < weight.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(weight[i]);
                    }
                }
            }
            else if (currentHistogramLabel == "Draft Pick") {
                for (var i = 0; i < draft_pick.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(draft_pick[i]);
                    }
                }
            } else if (currentHistogramLabel == "Player Age") {
                for (var i = 0; i < age.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(age[i]);
                    }
                }
            }
            else if (currentHistogramLabel == "Annual Salary in USD") {
                for (var i = 0; i < salary.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(salary[i]);
                    }
                }
            }
            else if (currentHistogramLabel == "Jersey Number") {
                for (var i = 0; i < jersey_number.length; i++) {
                    if (countryDefault[i] == ctryFilter) {
                        histData.push(jersey_number[i]);
                    }
                }
            }
        }


        createBarPlot(barData);
        buildHistogram(6, histData);
    }


    function applyBarFilter(barFilter) {

        var baseBarData = []
        var baseHisData = []

        var finalHisData = []
        switch (currentBarLabel) {
            case 'Playing Position':
                baseBarData = position;
                break;
            case 'Country':
                baseBarData = country;
                break;
            case 'Draft Class (YYYY)':
                baseBarData = draft_year;
                break;
            case 'Team':
                baseBarData = team;
                break;
            case 'Draft Round':
                baseBarData = draft_round
                break;
            default:
                console.log(".")
        }

        jQuery('#barTag').css('visibility', 'visible');
        jQuery('#barLabel').text((currentBarLabel + ": "));
        jQuery('#barFilter').text(barFilter);

        if (currentBarLabel == "Country") {
            jQuery('#barLabel').text("Nationality: ");
        } else if (currentBarLabel == "Draft Class (YYYY)") {
            jQuery('#barLabel').text("Draft Class: ");
        }

        switch (currentHistogramLabel) {
            case 'Player Age':
                baseHisData = age;
                break;
            case 'Player Rating':
                baseHisData = rating;
                break;
            case 'Draft Pick':
                baseHisData = draft_pick;
                break;
            case 'Height (cm)':
                baseHisData = height;
                break;
            case 'Weight (kg)':
                baseHisData = weight
                break;
            case 'Annual Salary in USD':
                baseHisData = salary;
                break;
            case 'Jersey Number':
                baseHisData = jersey_number;
                break;
            default:
                console.log(".")
        }

        for (i = 0; i < baseHisData.length; i++) {
            if (countryFilter == "none") {
                if (baseBarData[i] == barFilter) {
                    finalHisData.push(baseHisData[i]);
                }
            } else {
                if (baseBarData[i] == barFilter && countryDefault[i] == countryFilter) {
                    finalHisData.push(baseHisData[i]);
                }
            }
        }

        // console.log("This is final histogram data from bar chart")

        // console.log(finalHisData);
        buildHistogram(6, finalHisData);


    }

    function pageLoad() {
        renderWorldMap();
        currentHistogramLabel = "Player Rating"
        histVal = rating
        barVal = position
        currentBarLabel = "Playing Position"
        countryFilter = ""
        barGlobal = ""
        applyCountryFilter();
    }

    jQuery('#refreshBtn').on('click',function(){
        pageLoad();
    });

    jQuery('#nbaLogo').on('click',function(){
        pageLoad();
    });

    pageLoad();




});