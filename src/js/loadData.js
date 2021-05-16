var player_info = [];

var age = new Array();
var team = new Array();
var position = new Array();
var jersey_number = new Array();
var rating = new Array();
var height = new Array();
var weight = new Array();
var draft_year = new Array();
var salary = new Array();
var country = new Array();
var countryDefault = new Array();
var draft_round = new Array();
var draft_pick = new Array();



d3.csv("NbaV2.csv", function (data) {

    for (var i = 0; i < data.length; i++) {
        player_info[i] = {
            name: data[i]["Full Name"],
            age: data[i]["Birthday"],
            team: data[i]["Team"],
            position: data[i]["Position"],
            height: data[i]["Height"],
            weight: data[i]["Weight"],
            rating: parseInt(data[i]["Rating"]),
            jersey_number: parseInt(data[i]["Jersey Number"]),
            country: data[i]["Country"],
            salary: parseInt(data[i]["Salary"]),
            draft_year: parseInt(data[i]["Draft Year"]),
            draft_round: parseInt(data[i]["Draft Round"]),
            draft_pick: parseInt(data[i]["Draft Pick"])
        }
    }


    //data cleanup
    (function height_weight_clean() {
        for (var i = 0; i < player_info.length; i++) {
            var tempH = player_info[i].height.substring(6);
            player_info[i].height = Math.ceil((parseFloat(tempH)) * 100); //convert height to cms

            var tempW = player_info[i].weight.substring(11);
            player_info[i].weight = Math.ceil(parseFloat(tempW.trim()));
        }
    })();

    (function team_clean() {
        for (var i = 0; i < player_info.length; i++) {
            if (player_info[i].team == "") {
                player_info[i].team = "NA";
            } else {
                //player_info[i].team = player_info[i].team.split(' ').map(i => i.charAt(0)).toUpperCase();
                // var tmp = player_info[i].team.split(' ').map(function(item){return item[0]}).join('');
                // player_info[i].team = tmp;


                var tmp; var LA;
                var t3 = player_info[i].team.substring(0, 3);
                if (t3 == "Los") { //Special case for Los Angeles and NYC - Has 2 teams
                    LA = player_info[i].team.split(' ');
                    tmp = "LA" + LA[2][0];
                } else if (t3 == "New") { //New Orleans / New York
                    LA = player_info[i].team.split(' ');
                    var t = LA[1][0];
                    if (t == "Y") {
                        tmp = "NYC";
                    } else {
                        tmp = "NOP";
                    }
                } else {
                    tmp = t3.toUpperCase();
                }
                player_info[i].team = tmp;

            }

        }
    })();


    (function country_clean() {
        for (var i = 0; i < player_info.length; i++) {
            countryDefault[i] = player_info[i].country;
            var tmp;
            tmp = player_info[i].country.substring(0, 3);
            tmp = tmp.toUpperCase();
            if(tmp == "The"){
                tmp = "Bah";
            }
            player_info[i].country = tmp;
        }
    })();

    //Age cleanup [Available in string form as mm/DD/YYYY]
    (function () {
        for (var i = 0; i < player_info.length; i++) {
            var ageString = player_info[i].age;
            var birthYear = parseInt(ageString.substring(6));
            if (birthYear > 15) {
                birthYear = 1900 + birthYear;
            } else {
                birthYear = 2000 + birthYear;
            }
            player_info[i].age = 2021 - birthYear; //Calculating current approx. age 
        }
    })();

    for (var i = 0; i < player_info.length; i++) {
        age[i] = player_info[i].age;
        team[i] = player_info[i].team;
        position[i] = player_info[i].position;
        jersey_number[i] = player_info[i].jersey_number;
        rating[i] = player_info[i].rating;
        height[i] = player_info[i].height;
        weight[i] = player_info[i].weight;
        country[i] = player_info[i].country;
        salary[i] = player_info[i].salary;
        draft_year[i] = player_info[i].draft_year;
        draft_round[i] = player_info[i].draft_round;
        draft_pick[i] = player_info[i].draft_pick;
    }

});

