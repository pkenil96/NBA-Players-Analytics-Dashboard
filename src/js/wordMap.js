window.addEventListener('load', (event) => {

    var colors = ["#a50026", "#a70226", "#a90426", "#ab0626", "#ad0826", "#af0926", "#b10b26", "#b30d26", "#b50f26", "#b61127", "#b81327", "#ba1527", "#bc1727", "#be1927", "#c01b27", "#c21d28", "#c41f28", "#c52128", "#c72328", "#c92529", "#cb2729", "#cc2929", "#ce2b2a", "#d02d2a", "#d12f2b", "#d3312b", "#d4332c", "#d6352c", "#d7382d", "#d93a2e", "#da3c2e", "#dc3e2f", "#dd4030", "#de4331", "#e04532", "#e14733", "#e24a33", "#e34c34", "#e44e35", "#e55136", "#e75337", "#e85538", "#e95839", "#ea5a3a", "#eb5d3c", "#ec5f3d", "#ed613e", "#ed643f", "#ee6640", "#ef6941", "#f06b42", "#f16e43", "#f17044", "#f27346", "#f37547", "#f37848", "#f47a49", "#f57d4a", "#f57f4b", "#f6824d", "#f6844e", "#f7864f", "#f78950", "#f88b51", "#f88e53", "#f89054", "#f99355", "#f99556", "#f99858", "#fa9a59", "#fa9c5a", "#fa9f5b", "#fba15d", "#fba35e", "#fba660", "#fba861", "#fcaa62", "#fcad64", "#fcaf65", "#fcb167", "#fcb368", "#fcb56a", "#fdb86b", "#fdba6d", "#fdbc6e", "#fdbe70", "#fdc071", "#fdc273", "#fdc474", "#fdc676", "#fdc878", "#fdca79", "#fecc7b", "#fecd7d", "#fecf7e", "#fed180", "#fed382", "#fed584", "#fed685", "#fed887", "#feda89", "#fedb8b", "#fedd8d", "#fede8f", "#fee090", "#fee192", "#fee394", "#fee496", "#fee698", "#fee79a", "#fee89b", "#feea9d", "#feeb9f", "#feeca0", "#feeda2", "#feeea3", "#fdefa5", "#fdf0a6", "#fdf1a7", "#fdf2a9", "#fcf3aa", "#fcf4ab", "#fcf5ab", "#fbf5ac", "#fbf6ad", "#faf6ad", "#faf7ad", "#f9f7ae", "#f8f7ae", "#f7f8ad", "#f7f8ad", "#f6f8ad", "#f5f8ac", "#f4f8ab", "#f3f8ab", "#f1f8aa", "#f0f7a9", "#eff7a8", "#eef7a6", "#edf6a5", "#ebf6a4", "#eaf6a2", "#e8f5a1", "#e7f59f", "#e6f49d", "#e4f39c", "#e2f39a", "#e1f298", "#dff297", "#def195", "#dcf093", "#daef92", "#d9ef90", "#d7ee8e", "#d5ed8d", "#d3ec8b", "#d2ec89", "#d0eb88", "#ceea86", "#cce985", "#cae983", "#c8e882", "#c6e780", "#c4e67f", "#c2e57e", "#c0e47c", "#bee47b", "#bce37a", "#bae279", "#b8e178", "#b6e076", "#b4df75", "#b2de74", "#b0dd73", "#aedc72", "#acdb71", "#a9da70", "#a7d970", "#a5d86f", "#a3d86e", "#a0d76d", "#9ed66c", "#9cd56c", "#99d36b", "#97d26b", "#95d16a", "#92d069", "#90cf69", "#8ece68", "#8bcd68", "#89cc67", "#86cb67", "#84ca66", "#81c966", "#7fc866", "#7cc665", "#79c565", "#77c464", "#74c364", "#71c263", "#6fc063", "#6cbf62", "#69be62", "#67bd62", "#64bc61", "#61ba60", "#5eb960", "#5cb85f", "#59b65f", "#56b55e", "#53b45e", "#51b25d", "#4eb15c", "#4baf5c", "#48ae5b", "#46ad5a", "#43ab5a", "#40aa59", "#3da858", "#3ba757", "#38a557", "#36a456", "#33a255", "#31a154", "#2e9f54", "#2c9d53", "#2a9c52", "#289a51", "#259950", "#23974f", "#21954f", "#1f944e", "#1e924d", "#1c904c", "#1a8f4b", "#188d4a", "#178b49", "#158948", "#148747", "#128646", "#118446", "#108245", "#0e8044", "#0d7e43", "#0c7d42", "#0b7b41", "#0a7940", "#08773f", "#07753e", "#06733d", "#05713c", "#04703b", "#036e3a", "#026c39", "#016a38", "#006837"];
    const getFrequencyMap = (data) => {
        //alert(typeof(data))
        const map = {};
        data.forEach(item => {
            if (map[item]) {
                map[item]++;
            } else {
                map[item] = 1;
            }
        });
        return map;
    };

    function minmax(x, nums) {
        return (x - Math.min(nums)) / (Math.max(nums) - Math.min(nums))
    }

    function fetchData(selectedVar = "position") {

        var xvals = [];
        var yvals = [];

        var data = [];

        if (selectedVar == "teams") {
            data = team;
        } else if (selectedVar == "country") {
            data = country;
        } else if (selectedVar == "position") {
            data = position;
        } else if (selectedVar == "draftyear") {
            data = draft_year;
        } //else if(selectedVar == "round"){
        //     console.log(draft_round)
        //     data = draft_round;
        // }

        let freq_map = getFrequencyMap(data);
        for (let key in freq_map) {
            yvals.push(key);
            xvals.push(freq_map[key]);
        }

        myData = [];
        for (let key in freq_map) {
            if (selectedVar == "country") {
                if (key == "USA") {
                    myData.push({ 'word': key, 'size': 60 });
                } else {
                    myData.push({ 'word': key, 'size': freq_map[key] });
                }
            } else if (selectedVar == "teams") {
                myData.push(
                    {
                        'word': key,
                        'size': freq_map[key]
                    }
                );
            } else if (selectedVar == "position") {
                if (key == "G") {
                    myData.push({ 'word': key, 'size': 90 });
                } else if (key == "F") {
                    myData.push({ 'word': key, 'size': 80 });
                } else {
                    myData.push({ 'word': key, 'size': freq_map[key] });
                }
            } else if (selectedVar == "draftyear") {
                myData.push(
                    {
                        'word': key,
                        'size': freq_map[key]
                    }
                );
            }
        }
        wordCloud(myData);
    }

    function wordCloud(myWords) {
        // set the dimensions and margins of the graph

        d3.selectAll(".rBottomRight svg").remove();
        // console.log(myWords)
        var margin = { top: 10, right: 10, bottom: 5, left: 10 },
            width = 260 - margin.left - margin.right,
            height = 280 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(".rBottomRight").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        // Wordcloud features that are different from one word to the other must be here
        var layout = d3.layout.cloud()
            .size([width, height])
            .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
            .padding(3)        //space between words
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .fontSize(function (d) { return (d.size); })      // font size of words
            .on("end", draw);
        layout.start();

        // This function takes the output of 'layout' above and draw the words
        // Wordcloud features that are THE SAME from one word to the other can be here
        function draw(words) {
            svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) { return (d.size) / 1.1; })
                .style("fill", function () {
                    colr = Math.floor(Math.random() * (255));
                    return colors[colr];
                })
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; });
        }
    }

    $('.menuContainer button').on('click', function () {
        var field = this.value;
        constructPlot(field)
    });

    function constructPlot(filter) {
        switch (filter) {
            case 'country':
                fetchData('country')
                break;
            case 'position':
                fetchData('position')
                break;
            case 'draftClass':
                fetchData('draftyear')
                break;
            default:
                console.log(".");
        }
    }

    fetchData();


});