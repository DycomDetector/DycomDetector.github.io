/* September 2017 
 * Tommy Dang, Assistant professor, iDVL@TTU
 * Long Nguyen, PhD student, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 50 - margin.top - margin.bottom;
var heightSVG = 799;

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", heightSVG);
svg.call(tip);  

var personTerms, locTerms, misTerms, orgTerms;

var data, data2;
var minYear, maxYear, numMonth;

var nodes;
var numNode;

var termArray, relationship, termMax;
var terms;
var xStep = 210;
var searchTerm;

var isLensing;
var lensingMul = 8;
var lMonth;
var oldLmonth; // use this variable to compare if we are lensing over a different month

// Selected values from dropdown ****** used in main2.js and main3.js
var selectedSetNodeBy;
var selectedCut;


var XGAP_; // gap between months on xAxis
var numLens = 2;

function xScale(m) {
    if (isLensing) {
        var maxM = Math.max(0, lMonth - numLens - 1);
        var numMonthInLense = (lMonth + numLens - maxM + 1);

        //compute the new xGap
        var total = numMonth + numMonthInLense * (lensingMul - 1);
        var xGap = (XGAP_ * numMonth) / total;

        if (m < lMonth - numLens)
            return m * xGap;
        else if (m > lMonth + numLens) {
            return maxM * xGap + numMonthInLense * xGap * lensingMul + (m - (lMonth + numLens + 1)) * xGap;
        }
        else {
            return maxM * xGap + (m - maxM) * xGap * lensingMul;
        }
    }
    else {
        return m * XGAP_;
    }
}

var area = d3.svg.area()
    .interpolate("basic")
    .x(function (d) {
        return xStep + xScale(d.monthId);
    })
    .y0(function (d) {
        return d.yNode - yScale(d.value);
    })
    .y1(function (d) {
        return d.yNode + yScale(d.value);
    });

var optArray = [];   // FOR search box

var listMonth;

var categories = ["person","location","organization","miscellaneous"];
var getColor3;  // Colors of categories
 

//*****************************************************************
var isForFigure4 = false;

var fileList = ["WikiNews","Huffington","CrooksAndLiars","EmptyWheel","Esquire","FactCheck"
                ,"VIS_papers","IMDB","PopCha","Cards_PC","Cards_Fries"]
var initialDataset = "VIS_papers";

var fileName;


addDatasetsOptions(); // Add these dataset to the select dropdown, at the end of this files
drawControlPanel();

function loadData(){
    searchTerm = "";
    isLensing = false;
    termMax=0;
    oldLmonth = -1000;
    lMonth = -lensingMul * 2;
    fileName = "data/"+fileName+".tsv"; // Add data folder path
    
    if (fileName.indexOf("Cards_Fries")>=0){
        categories = ["increases_activity", "decreases_activity"];
    }
    else if (fileName.indexOf("Cards_PC")>=0){
        categories = ["adds_modification", "removes_modification", "increases","decreases", "binds", "translocation"];
    }
    else if (fileName.indexOf("PopCha")>=0){
        categories = ["Comedy","Drama","Action", "Fantasy", "Horror"];
    }
    else if (fileName.indexOf("IMDB")>=0){
        categories = ["Comedy","Drama","Action"];
    }
    else if (fileName.indexOf("VIS")>=0){
        categories = ["Vis","VAST","InfoVis","SciVis"];
    }
    else 
        categories = ["person","location","organization","miscellaneous"];
    
    getColor3 = d3.scale.category10(); 
    for (var cate=0; cate<categories.length;cate++){ // This loop makes sure person is Blue ...
        var category = categories[cate];
        getColor3(category);
    }  
    
    // START: loader spinner settings ****************************
    var opts = {
      lines: 25, // The number of lines to draw
      length: 15, // The length of each line
      width: 5, // The line thickness
      radius: 25, // The radius of the inner circle
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 2, // Rounds per second
      trail: 50, // Afterglow percentage
      className: 'spinner', // The CSS class to assign to the spinner
    };
    var target = document.getElementById('loadingSpinner');
    var spinner = new Spinner(opts).spin(target);
    // END: loader spinner settings ****************************

    d3.tsv(fileName, function (error, data_) {
        if (error) throw error;
        data = data_;

        terms = new Object();
        minYear = 9999;
        maxYear = 0;

        if (fileName.indexOf("VIS")>=0 || fileName.indexOf("IMDB")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
            data.forEach(function (d) { // Update month
                // Process date
                var year =+d["Year"];
                if (year<minYear)
                    minYear = year;
                if (year>maxYear)
                    maxYear = year;
                d.m = year;
            });    

            
            // Set the dropdown value
            document.getElementById('edgeWeightDropdown').value = "1";  
            document.getElementById('nodeDropdown').value = "1";  
            maxNodesInSnapshot =35;
            maxRel = 5;
            snapshotScale = 0.22; 
            if (fileName.indexOf("VIS")>=0){
               // minYear = 2000;
                snapshotScale = 0.14;   
                maxRel = 7;
            }
            else if (fileName.indexOf("IMDB")>=0){
                minYear = 1975;   // IMDB first movie was in 1919
               // minYear = 2001;   // IMDB first movie was in 1919
               // snapshotScale = 0.15;  
               snapshotScale = 0.22;  
            }  
            else if (fileName.indexOf("PopCha")>=0){
                minYear = 1980;   // PopCha first movie was in 1937

            }  
            else if (fileName.indexOf("Cards_PC")>=0){
                snapshotScale = 0.17;    // PopCha first movie was in 1937
            }  
            else if (fileName.indexOf("Cards_Fries")>=0){
                minYear = 1995; 
                maxNodesInSnapshot = 50;
                maxRel = 5;
                snapshotScale = 0.20;    // PopCha first movie was in 1937
            }   

            //minYear = 2004;
            // Update months
            numMonth = maxYear - minYear +1;
            XGAP_ = (width-xStep-1)/numMonth; // gap between months on xAxis

            data.forEach(function (d) {    
                d.m = d.m-minYear;
                var list = d["Author Names"].split(";");
                for (var i = 0; i < list.length; i++) {
                    var term = list[i];
                    d[term] = 1;
                    if (!terms[term]) {
                        terms[term] = new Object();
                        terms[term].max = 0;
                        terms[term].maxMonth = -100;   // initialized negative
                        terms[term].category = d.Conference;
                    }
                    if (!terms[term][d.m]){
                        terms[term][d.m] = 1;
                        terms[term].max = terms[term][d.m];
                        terms[term].maxMonth = d.m;
                    }         
                    else {
                        terms[term][d.m]++;
                        if (terms[term][d.m] > terms[term].max) {
                            terms[term].max = terms[term][d.m];
                            terms[term].maxMonth = d.m;
                        }
                    }
                }     
            });
            
        }
        else{
            data.forEach(function (d) {
                d.source = d["source"];
                // Process date
                var curDate = Date.parse(d["time"]);
                d.date = new Date(d["time"]);
                var year = d.date.getFullYear();
                // Compute min and max years from the data
                if (year<minYear)
                    minYear = year;
                if (year>maxYear)
                    maxYear = year;
                var m = 12 * year + d.date.getMonth();
                d.m = m;
                
            });

            if (fileName.indexOf("FactCheck")>=0){
                minYear = 2007;   
                document.getElementById('nodeDropdown').value = "1"; 
                document.getElementById('edgeWeightDropdown').value = "2";  
                maxNodesInSnapshot =30
                maxRel = 12;
                snapshotScale = 0.16;    
            }  
            else if (fileName.indexOf("Esquire")>=0){
                document.getElementById('nodeDropdown').value = "1";  
                document.getElementById('edgeWeightDropdown').value = "1";  
                maxNodesInSnapshot =15;
                maxRel = 8;
                snapshotScale = 0.16;   
            }
            else if (fileName.indexOf("EmptyWheel")>=0){
                minYear = 2012; 
                maxYear = 2015; 
                document.getElementById('nodeDropdown').value = "1";  
                document.getElementById('edgeWeightDropdown').value = "3";  
                maxNodesInSnapshot =20;
                maxRel = 17;
                snapshotScale = 0.15;   
            }
            else if (fileName.indexOf("CrooksAndLiars")>=0){
                document.getElementById('nodeDropdown').value = "3";  
                document.getElementById('edgeWeightDropdown').value = "2";  
                maxNodesInSnapshot =25;
                maxRel = 12;
                snapshotScale = 0.16;   
            }
            else if (fileName.indexOf("Huffington")>=0){
                minYear = 2012; 
                maxYear = 2015; 
                document.getElementById('nodeDropdown').value = "4";  
                document.getElementById('edgeWeightDropdown').value = "4";  
                maxNodesInSnapshot =150;
                maxRel = 30;
                snapshotScale = 0.13;   
            }
            else if (fileName.indexOf("WikiNews")>=0){
                minYear = 2010; 
                document.getElementById('nodeDropdown').value = "1";  
                document.getElementById('edgeWeightDropdown').value = "3";  
                maxNodesInSnapshot =35;
                maxRel = 10;
                snapshotScale = 0.19;   
            }
            //************************* Figure4 **********************
            //if (isForFigure4)
            //   minYear = 2012;
            //    maxYear = 2009;
            // Update months
            numMonth = 12*(maxYear - minYear);
            XGAP_ = (width-xStep)/numMonth; // gap between months on xAxis
            
            data.forEach(function (d) { // Update month
                d.m = d.m-12*minYear;
                for (var cate=0; cate<categories.length;cate++){
                    var category = categories[cate];
                    if (d[category]!="" &&  d[category] != 1) {
                        var list = d[category].split("|");
                        for (var i = 0; i < list.length; i++) {
                            var term = list[i];
                            d[term] = 1;
                            if (!terms[term]) {
                                terms[term] = new Object();
                                terms[term].max = 0;
                                terms[term].maxMonth = -100;   // initialized negative
                                terms[term].category = category;
                            }
                            if (!terms[term][d.m])
                                terms[term][d.m] = 1;
                            else {
                                terms[term][d.m]++;
                                if (terms[term][d.m] > terms[term].max) {
                                    terms[term].max = terms[term][d.m];
                                    terms[term].maxMonth = d.m;
                                }
                            }
                        }
                    }
                }
            });
        }
        // Set the value from dropdown (which might be changed depending on the input dataset above)
        selectedCut = document.getElementById('edgeWeightDropdown').value-1; // dropdown start at 1
        selectedSetNodeBy = document.getElementById('nodeDropdown').value; // Exceptional for categorical dropdown
        

        readTermsAndRelationships();
        console.log("DONE computing relationshipMax=" + relationshipMax);

        svg.append("rect")
            .attr("class", "background")
            .style("fill", "#fff")
            .attr("x", 0)
            .attr("y", yTimeBox)
            .attr("width", width)
            .attr("height", heightSVG)

        drawColorLegend();
        drawTimeLegend();
        drawTimeBox(); // This box is for brushing 
        
        // 2017. this function is main2.js
        computeMonthlyGraphs();
       
        // Spinner Stop ********************************************************************
        spinner.stop();


        var maxNum = Math.min(termArray.length, 10000);
        for (var i = 0; i < termArray.length; i++) {
            optArray.push(termArray[i].term);
        }
        optArray = optArray.sort();
        $(function () {
            $("#search").autocomplete({
                source: optArray
            });
        });
        //    chartStreamGraphs();  // Streamgraphs********************************************************************
        
        setTimeout(function(){
            svg.selectAll(".textTopEntities")
                 .text("Click on "+text1);
            var startTime = new Date().getTime();
            var interval = setInterval(function(){ 
                var d = new Date();
                var n = d.getMilliseconds();
                svg.selectAll(".textTopEntities")
                    .style("fill-opacity", (n%1000)/1000);
                if(new Date().getTime() - startTime > 5000){
                    clearInterval(interval);
                    svg.selectAll(".textTopEntities")
                        .attr("class", "textTopEntities2") // change class to stop flashing;  
                        .style("fill-opacity", 1)
                        .text(function () { return "Top " +top100termsArray.length +" "+text1;});    
                    return;
                }    
            }, 50);    
        }, 10000);  

        setTimeout(function(){
            svg.append("text")
                .attr("class", "textLensingArea")
                .attr("x", width/2)
                .attr("y", 20)
                .text("Lensing area")
                .attr("font-family", "sans-serif")
                .attr("font-size", "16px")
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("text-shadow", "0 0 5px #aaa")
                .style("fill", "#000");
            svg.selectAll(".timeLegendText")
                .style("fill-opacity", 0.05);

            var startTime = new Date().getTime();
            var interval2 = setInterval(function(){ 
                var d = new Date();
                var n = d.getMilliseconds();
                svg.selectAll(".textLensingArea")
                    .style("fill-opacity", (n%1000)/1000);
                if(new Date().getTime() - startTime > 4000){
                    clearInterval(interval2);
                    svg.selectAll(".textLensingArea").remove();
                    svg.selectAll(".timeLegendText")
                        .style("fill-opacity", function (d, i) {
                            return getOpacity(d,i);
                        });
                    return;
                }  
                
            }, 50);    
        }, 3000);  


    });

}    

function readTermsAndRelationships() {
    console.log("readTermsAndRelationships");
    data2 = data.filter(function (d, i) {
        if (!searchTerm || searchTerm == "") {
            return d;
        }
        else if (d[searchTerm])  // data2 contain the row which contains searched term
            return d;
    });

    var selected = {}
    if (searchTerm && searchTerm != "") {
        data2.forEach(function (d) {
            for (var term1 in d) {
                if (!selected[term1])
                    selected[term1] = {};
                else {
                    if (!selected[term1].isSelected)
                        selected[term1].isSelected = 1;
                    else
                        selected[term1].isSelected++;
                }
            }
        });
    }

    var removeList = {};   // remove list **************
    removeList["source"] = 1;
    removeList["person"] = 1;
    removeList["location"] = 1;
    removeList["organization"] = 1;
    removeList["miscellaneous"] = 1;

    removeList["muckreads weekly deadly force"] = 1
    removeList["propublica"] = 1;
    removeList["white this alabama judge has figured out how"] = 1;
    removeList["dea ’s facebook impersonato"] = 1;
    removeList["dismantle roe"] = 1;
    removeList["huffington post"] = 1;
    
    // For EmptyWheel data, Figure 5 in EuroVis 2018 paper, to fix the Entity resolution problem
    removeList["tsarnaev"] = 5;
    removeList["fbi"] = 5;
    removeList["tamerlan"] = 5;
    removeList["abc news"] = 5;
    removeList["todashev"] = 5;
    removeList["afghans"] = 5;
    removeList["administration"] = 5;
    removeList["state department"] = 5;
    removeList["senate intelligence committee"] = 5;
    removeList["emptywheel"] = 5;
    removeList["nyt"] = 5;
    removeList["google"] = 5;
    removeList["walton"] = 5;
    removeList["benghazi"] = 5;
    removeList["section"] = 5;
    removeList["brennan"] = 5;
    removeList["al-qaeda"] = 5;
    removeList["saudis"] = 5;
    removeList["clapper"] = 5;
    removeList["hamid karzai"] = 5;
    removeList["dzhokhar"] = 5;
    removeList["committee"] = 5;
    
    //terms["dzhokhar tsarnaev"].category = "person";
    //terms["tamerlan tsarnaev"].category = "person";
    //terms["ibragim todashev"].category = "person";
    //terms["waltham"].category = "location";
    //terms["verizon"].category = "organization";
    
    // For Huffington data, Figure 1 in EuroVis 2018 paper, to fix the Entity resolution problem
    removeList["hagel"] = 6;
    removeList["giglio"] = 6;
    removeList["thatcher"] = 6;
    removeList["trayvon"] = 6;
    removeList["zimmerman"] = 6;
    removeList["mandela"] = 6;
    removeList["marathon"] = 6;
    removeList["lapierre"] = 6;
    removeList["lanza"] = 6;
    removeList["occupy"] = 6;
    removeList["todd akin"] = 6;

   /* removeList["new york times"]=1;
    removeList["tsarnaev"] = 1;
    removeList["committee"] = 1;
    removeList["yahoo"] = 1;
     removeList["alexander"] = 1;
      removeList["intelligence committee"] = 1;*/
     
    
    /*
    removeList["lanza"] = 1;
    removeList["giglio"] = 1;
    removeList["portman"] = 1;
    removeList["thatcher"] = 1;
    removeList["ground"] = 1;
    removeList["summers"] = 1;
    removeList["lapierre"] = 1;
    removeList["hagel"] = 1;
    removeList["swartz"] = 1;
    removeList["tsarnaev"] = 1;
    removeList["marathon"] = 1;
    removeList["martin"] = 1;
    removeList["zimmerman"] = 1;
    removeList["karzai"] = 1;
    removeList["rice"] = 1;
    removeList["tamerlan"] = 1;
    removeList["boston"] = 1;
    removeList["foreign intelligence surveillance court"] = 1;
    removeList["trayvon"] = 1;
    */
    
    termArray = [];
    for (var att in terms) {
        var e = {};
        e.term = att;
        if (removeList[e.term] || (searchTerm && searchTerm != "" && !selected[e.term])) // remove list **************
            continue;

        var maxNet = 0;
        var maxMonth = -1;
        var count = 0;
        for (var m = 0; m < numMonth; m++) {
            if (terms[att][m]) {
                var previous = 0;
                if (terms[att][m - 1])
                    previous = terms[att][m - 1];
                var net = (terms[att][m] + 1) / (previous + 1);
                if (net > maxNet) {
                    maxNet = net;
                    maxMonth = m;
                }
                count+=terms[att][m];
            }
          //  console.log(att+" net="+net);
        }
        e.max = maxNet;
        e.count = count;
        e.maxMonth = maxMonth;
        e.category = terms[att].category;

        if (e.term == searchTerm) {
            e.max = 1000;
            e.isSearchTerm = 1;
        }
        else if (searchTerm && searchTerm != "" && selected[e.term] && selected[e.term].isSelected) {
            e.max = 500 + selected[e.term].isSelected;
        }

        if (fileName.indexOf("VIS")>=0 || fileName.indexOf("IMDB")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
            if (e.term.length>1)  
                termArray.push(e);
        }
        else{    
            if (e.max > 1.5 && e.term.length>2)    // Only get terms with some increase ************** with TEXT
                termArray.push(e);
        }
    }
    termArray.sort(function (a, b) {
        if (a.max < b.max) {
            return 1;
        }
        if (a.max > b.max) {
            return -1;
        }
        return 0;
    });

    // Compute relationship **********************************************************
    numNode = Math.min(topNumber, termArray.length);
    if (fileName.indexOf("VIS")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
        numNode = termArray.length;   
    }  
    else if (fileName.indexOf("IMDB")>=0){  
        numNode = Math.min(5000, termArray.length);
    }    
    top200terms ={};
    top100termsArray = [];
    for (var i=0; i<numNode;i++){
       top200terms[termArray[i].term] = termArray[i];  // top200terms is defined in main2.js
       if (top100termsArray.length<30)
             top100termsArray.push(termArray[i]);
       /*  // Sentiment request to server
       var query =  "http://127.0.0.1:1337/status?userID="+termArray[i].term;
         new Promise(function(resolve) {
          d3.json(query, function(d) { 
           // debugger;
            resolve(d) })
        });*/
    }
    console.log("numNode="+numNode);


    // compute the term frequency ************************************************************************************
    termMax = 0;
    for (var i = 0; i < numNode; i++) {
        for (var m = 0; m < numMonth; m++) {
            var mon = new Object();
            if (terms[termArray[i].term][m]) {
                mon.value = terms[termArray[i].term][m];
                if (mon.value > termMax)
                    termMax = mon.value;
            }
        }
    }
    relationship ={};
    relationshipMax =0;
    data2.forEach(function(d) { 
        var m = d.m;
        for (var term1 in d) {
            if (top200terms[term1]){   // if the term is in the selected 100 terms
                for (var term2 in d) {
                    if (top200terms[term2]){   // if the term is in the selected 100 terms
                        if (!relationship[term1+"__"+term2]){
                            relationship[term1+"__"+term2] = new Object();
                            relationship[term1+"__"+term2].max = 1;
                            relationship[term1+"__"+term2].maxMonth =m;
                        }    
                        if (!relationship[term1+"__"+term2][m])
                            relationship[term1+"__"+term2][m] = 1;
                        else{
                            relationship[term1+"__"+term2][m]++;
                            if (relationship[term1+"__"+term2][m]>relationship[term1+"__"+term2].max){
                                relationship[term1+"__"+term2].max = relationship[term1+"__"+term2][m];
                                relationship[term1+"__"+term2].maxMonth =m;  
                                if (relationship[term1+"__"+term2].max>relationshipMax) // max over time
                                    relationshipMax = relationship[term1+"__"+term2].max;
                            }  
                        }    
                    }
                }
            }
        }
    });  
}


$('#btnUpload').click(function () {
    var bar = document.getElementById('progBar'),
        fallback = document.getElementById('downloadProgress'),
        loaded = 0;
    var load = function () {
        loaded += 1;
        bar.value = loaded;

        /* The below will be visible if the progress tag is not supported */
        $(fallback).empty().append("HTML5 progress tag not supported: ");
        $('#progUpdate').empty().append(loaded + "% loaded");

        if (loaded == 100) {
            clearInterval(beginLoad);
            $('#progUpdate').empty().append("Upload Complete");
            console.log('Load was performed.');
        }
    };
    var beginLoad = setInterval(function () {
        load();
    }, 50);

});

// Stream graphs ***********************************************
function chartStreamGraphs(color) {
    var datearray = [];
    var colorrange = [];

    if (color == "blue") {
      colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
    }
    else if (color == "pink") {
      colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
    }
    else if (color == "orange") {
      colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
    }
    strokecolor = colorrange[0];
    var format = d3.time.format("%m/%d/%y");
    var width = document.body.clientWidth ;
    var height = 1000;

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "20")
        .style("visibility", "hidden")
        .style("top", "30px")
        .style("left", "55px");
    var x = d3.time.scale()
        .range([xStep, width]);
    var y = d3.scale.linear()
        .range([height, 400]);
    var z = d3.scale.ordinal()
        .range(colorrange);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(4);
    var yAxisr = d3.svg.axis()
        .scale(y);
    var stack = d3.layout.stack()
        .offset("silhouette")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });
    var nest = d3.nest()
        .key(function(d) { return d.key; });
    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });
        var data2 = [];
        var maxNet2 = 0;
        for (var k in top200terms){
            for (var m = 0; m < numMonth; m++) {
                var obj = {};
                obj.key = k;
                obj.date = m;
                //obj.category = top200terms[k].category;
                if (terms[k][m]) {
                    obj.value = terms[k][m];
                }
                else
                    obj.value = 0;
                if (terms[k].max>maxNet2)
                    maxNet2 = terms[k].max;
                data2.push(obj);
            }    
        }
        data2.sort(function (a, b) {
        if (getPosition(categories,top200terms[a.key].category) < getPosition(categories,top200terms[b.key].category)) {
            return 1;
        }
        else if (getPosition(categories,top200terms[a.key].category) > getPosition(categories,top200terms[b.key].category) ) {
            return -1;
        }
        else{
            if (terms[a.key].max > terms[b.key].max) {
                return 1;
            }
            else if (terms[a.key].max < terms[b.key].max) {
                return -1;
            }
            else{    
                if (a.date < b.date) {
                    return 1;
                }
                else if (a.date > b.date) {
                    return -1;
                }

                 return 0;
            } 
        }
      });
      

        function getPosition(arrayName,arrayItem) {
            for(var i=0;i<arrayName.length;i++){ 
                if(arrayName[i]==arrayItem)
                return i;
        }
      }   
      var data = data2;
        
      var layers = stack(nest.entries(data));
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);


     /* svg.append("text")
            .attr("class", "nodeLegend5")
            .attr("x", 0)
            .attr("y", 0)
            .text("Frequency")
            .attr("dy", ".21em")
            .attr("font-family", "sans-serif")
            .attr("font-size", "15px")
            .attr("transform", "translate("+(xStep+15)+",420) rotate(-90)")
            .style("text-anchor", "end")
            .style("fill", "#000");*/

    svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
          .attr("class", "layer")
          .attr("d", function(d) { return area(d.values); })
          .style("fill", function(d, i) { 
            console.log(top200terms[d.key].category);
           return getColor3(top200terms[d.key].category); })
          .style("fill-opacity", function(d, i) { 
            var count = terms[d.key].max;
            var opac = Math.min(Math.sqrt(0.1+count/maxNet2),1);
            return opac;
          });
    /*svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + xStep + ", 0)")
          .attr("stroke-width",1)
          .call(yAxis.orient("left"));*/

    svg.selectAll(".layer")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
          svg.selectAll(".layer").transition()
          .duration(250)
          .attr("opacity", function(d, j) {
            return j != i ? 0.6 : 1;
        })})

        .on("mousemove", function(d, i) {
          mousex = d3.mouse(this);
          mousex = mousex[0];
          var invertedx = x.invert(mousex);
          invertedx = invertedx.getMonth() + invertedx.getDate();
          var selected = (d.values);
          for (var k = 0; k < selected.length; k++) {
            datearray[k] = selected[k].date
            datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
          }

          mousedate = datearray.indexOf(invertedx);
          pro = d.values[mousedate].value;

          d3.select(this)
          .classed("hover", true)
          .attr("stroke", strokecolor)
          .attr("stroke-width", "0.5px"), 
          tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
          
        })
        .on("mouseout", function(d, i) {
         svg.selectAll(".layer")
          .transition()
          .duration(250)
          .attr("opacity", "1");
          d3.select(this)
          .classed("hover", false)
          .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
      })
        
      var vertical = d3.select(".chart")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "19")
            .style("width", "1px")
            .style("height", "380px")
            .style("top", "10px")
            .style("bottom", "30px")
            .style("left", "0px")
            .style("background", "#fff");

    d3.select(".chart")
        .on("mousemove", function(){  
             mousex = d3.mouse(this);
             mousex = mousex[0] + 5;
             vertical.style("left", mousex + "px" )})
        .on("mouseover", function(){  
             mousex = d3.mouse(this);
             mousex = mousex[0] + 5;
             vertical.style("left", mousex + "px")});
}


function recompute() {
    var bar = document.getElementById('progBar'),
        fallback = document.getElementById('downloadProgress'),
        loaded = 0;
        
    var load = function () {
        loaded += 5;
        bar.value = loaded;
        /* The below will be visible if the progress tag is not supported */
        $(fallback).empty().append("HTML5 progress tag not supported: ");
        $('#progUpdate').empty().append(loaded + "% loaded");

        if (loaded == 100) {
            clearInterval(beginLoad);
            $('#progUpdate').empty().append("Complete");
        }
    };

    var beginLoad = setInterval(function () {
        load();
    }, 1);
    readTermsAndRelationships();
    computeMonthlyGraphs();
}

// Other fucntions *******************************************************
function searchNode() {
    searchTerm = document.getElementById('search').value;
    recompute();
}

function addDatasetsOptions() {
    var select = document.getElementById("datasetsSelect");   
    for(var i = 0; i < fileList.length; i++) {
        var opt = fileList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        el["data-image"]="images2/datasetThumnails/"+fileList[i]+".png";
        select.appendChild(el);
    }        
    document.getElementById('datasetsSelect').value = initialDataset;  //************************************************
    fileName = document.getElementById("datasetsSelect").value;
    loadData();
}


function loadNewData(event) {
    //alert(this.options[this.selectedIndex].text + " this.selectedIndex="+this.selectedIndex);
    svg.selectAll("*").remove();
    fileName = this.options[this.selectedIndex].text;
    loadData();
}