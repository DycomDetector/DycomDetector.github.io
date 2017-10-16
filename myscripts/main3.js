/* March 2017
 * Tommy Dang, Assistant professor, iDVL@TTU
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */


function setCut(cutvalue){
    var selectedvalue = cutvalue;
    if (selectedvalue === "optimized") {
        selectedCut = -100;
        cutOffvalue=get_bestCut(graphByMonths);
        createForceOptimized();
        updateHistogramOptimized();
    } else {
        selectedCut = +selectedvalue - 1;
        selectHistogram();
    }
     drawgraph2();
}

function setNodesBy(){
    selectedSetNodeBy = d3.select('#nodeDropdown').property('value');

    // Recompute the sub graphs
    computeMonthlyGraphs();


    if(selectedSetNodeBy==1){
       console.log(selectedSetNodeBy);
    }
    else if(selectedSetNodeBy==2){
        console.log(selectedSetNodeBy);
    }
    else if(selectedSetNodeBy==3){
        console.log(selectedSetNodeBy);
    }
    else if(selectedSetNodeBy==4){
        var cut_value = $('#nodeDropdown').val();
        //Check if cutoff is calculated, if yes then skip
        if(cutoff_Check.indexOf(+cut_value)===-1){
            graphInsertBetweeness(graphByMonths, +cut_value);
            cutoff_Check.push(+cut_value);
        }
    }
    drawgraph2();
}


function selectHistogram() {
    for (var c = 0; c < numCut; c++) {
        if (c == selectedCut) {
            svg.selectAll(".histogram" + c).style("fill-opacity", 0)
                .style("stroke-opacity", 1);
            for (var m = 1; m < numMonth; m++) {
                var nodes = [];
                if (graphByMonths[m][c] != undefined) {
                    nodes = graphByMonths[m][c].nodes;
                }
                var links = [];
                if (graphByMonths[m][c] != undefined) {
                    links = graphByMonths[m][c].links;
                }
                updateSubLayout(nodes, links, m);
            }
        }
        else {
            svg.selectAll(".histogram" + c).style("fill-opacity", 0.1)
                .style("stroke-opacity", 0.3);
        }
    }
}
function updateHistogramOptimized() {
    for (var c = 0; c < numCut; c++) {
        svg.selectAll(".histogram" + c)
            .style("fill-opacity", function (d,m) {
                if (c==cutOffvalue[m]-1){
                    return 1;
               }
               else{
                   return 0.1;
               }
            })
            .style("stroke-opacity", function (d,m) {
                if (c==cutOffvalue[m]-1){
                    return 1;
                }
                else{
                    return 0.3;
                }
            });
    }
}
function createForceOptimized() {
    console.log("createForceOptimized");
    for (var c = 0; c < numCut; c++) {
        for (var m = 1; m < numMonth; m++) {
            if (c==cutOffvalue[m]-1){
                var nodes = [];
                if (graphByMonths[m][c] != undefined) {
                    nodes = graphByMonths[m][c].nodes;
                }
                var links = [];
                if (graphByMonths[m][c] != undefined) {
                    links = graphByMonths[m][c].links;
                }
                updateSubLayout(nodes, links, m);
            }
        }
    }
}

function drawHistograms(yStartHistogram) {
    for (var cut = 0; cut < numCut; cut++) {
        svg.selectAll(".histogram" + cut).remove();
        var updateHistogram = svg.selectAll(".histogram" + cut)
            .data(graphByMonths);
        var enterHistogram = updateHistogram.enter();
        enterHistogram.append("rect")
            .attr("class", "histogram" + cut)
            .attr("id", cut)
            .style("stroke", "#000")
            .style("stroke-width", 0.4)
            .style("stroke-opacity", function () {
                return cut == selectedCut ? 1 : 0.25;
            })
            .style("fill", getColor3(cut))
            .style("fill-opacity", function () {
                return cut == selectedCut ? 1 : 0.12;
            })
            .attr("x", function (d, i) {
                var w = XGAP_ / (numCut + 4);
                if (lMonth - numLens <= i && i <= lMonth + numLens){
                     w = w * lensingMul / 2;
                     w = Math.min(w, 15);
                }
                return xStep + xScale(i) + cut * w - 2 * w;    // x position is at the arcs
            })
            .attr("y", function (d, i) {
                if (d == undefined || d[cut] == undefined)
                    return yStartHistogram;
                var hScale = d3.scale.linear()
                    .range([1, 50])
                    .domain([0, 1]);
                return yStartHistogram - hScale(d[cut].Qmodularity);
            })
            .attr("height", function (d, i) {
                if (d == undefined || d[cut] == undefined)
                    return 0;
                var hScale = d3.scale.linear()
                    .range([0, 50])
                    .domain([0, 1]);
                return hScale(d[cut].Qmodularity);
            })
            .attr("width", function (d, i) {
                var w = XGAP_ / (numCut + 4);
                if (lMonth - numLens <= i && i <= lMonth + numLens){
                    w = w * lensingMul / 2;
                    w = Math.min(w, 15);
                }
                    
                return w;
            });
    }
}


// This Texts is independent from the lower text with stream graphs
var tNodes;
function drawTextClouds(yTextClouds) {
    var numTerms = 5; // numTerms in each month
    tNodes = [];
    for (var m = 0; m < numMonth; m++) {
        var newCut = selectedCut;
        if (newCut<0){  // Best Q modularity selected
            newCut = cutOffvalue[m]-1;
        }

        var nodes = [];
        if (graphByMonths[m] == undefined || graphByMonths[m][newCut] == undefined) continue;
        for (var i = 0; i < graphByMonths[m][newCut].nodes.length; i++) {
            var nod = graphByMonths[m][newCut].nodes[i];
            nodes.push(nod);
        }

        // compute the frequency of node at month m
        for (var i=0; i<nodes.length; i++){
            var nod = nodes[i];
            nod.frequency = 0;
            if (terms[nod.name][nod.m])
                nod.frequency = terms[nod.name][nod.m];
        }

        // Now compute the node size based on a selected measure
        for (var i=0; i<nodes.length; i++){
            var nod = nodes[i];
            nod.measurement = 0;
            if (selectedSetNodeBy==1) {
                nod.measurement = 100*nod.frequency+nod.net+nod.weight;
            }
            else if (selectedSetNodeBy==2) {
                nod.measurement = nod.frequency+100*nod.net+nod.weight;
            }
            else if (selectedSetNodeBy==3) {
                nod.measurement = nod.frequency+nod.net+100*nod.weight;
            }
            else if (selectedSetNodeBy==4) {
                var bet= nod.betweenness;
                if (bet==undefined || isNaN(bet)) {
                    bet=0;
                }
                else if (bet>1) {
                    bet=1;
                    nod.betweenness =1;
                }
                nod.measurement = nod.frequency+nod.net+nod.weight+100*bet;
            }
        }


        nodes.sort(function (a, b) {
            if (a.measurement < b.measurement) {   // weight is the degree of nodes
                return 1;
            }
            else if (a.measurement > b.measurement) {
                return -1;
            }
            else {
                if (a.community < b.community) { // cluster id, generated by Vinh Nguyen
                    return 1;
                }
                else if (a.community > b.community) {
                    return -1;
                }
                else {
                    -1
                }
            }
        });
        for (var i = 0; i < numTerms && i < nodes.length; i++) {
            nodes[i].indexForTextClouds = i;  // This is  the index for textcloud for every month
            tNodes.push(nodes[i]);
        }
    }



    var max = 1;
    var min =  100000;
    for (var i=0;i<tNodes.length;i++){
        if (tNodes[i].measurement>max)
            max = tNodes[i].measurement;
        if (tNodes[i].measurement<min)
            min = tNodes[i].measurement;
    }


    svg.selectAll(".textCloud3").remove();
    var yStep = 12;
    var updateText = svg.selectAll(".textCloud3")
        .data(tNodes);
    var enterText = updateText.enter();
    enterText.append("text")
        .attr("class", "textCloud3")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d) {
            var s;
            if (lMonth-numLens<=d.m && d.m<=lMonth+numLens){
                var sizeScale = d3.scale.linear()
                    .range([10, 17])
                    .domain([min, max]);
                s = sizeScale(d.measurement);
            }
            else{
                var sizeScale = d3.scale.linear()
                    .range([2, 12])
                    .domain([min, max]);
                s = sizeScale(d.measurement);
            }
            if (isNaN(s)) // exception
                s=5;
            return s+"px";
        })
        .style("fill", function(d) {
           // return "#000";
            return getColor3(d.category);
        })
        .attr("x", function(d) {
            return xStep + xScale(d.m);    // x position is at the arcs
        })
        .attr("y", function (d) {
            return yTextClouds + d.indexForTextClouds * yStep;     // Copy node y coordinate
        })
        .text(function(d) {
            if (lMonth-numLens<=d.m && d.m<=lMonth+numLens){
                return d.name.substring(0,18);//+" ("+d.count+")";
            }
            else{
                return d.name.substring(0,10);
            }
        });

}
