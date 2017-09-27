var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Add color legend

var yTimeBox = 0;
    

function drawColorLegend() {
    var xx = 10;
    var yy = 267;
    var rr = 6;

    // number of input terms
    var text1 = "terms";
    var text2 = "articles";
    var textFile = "";
    if (fileName.indexOf("CardsFries")>=0){
        text1 = "proteins";
        text2 = "index cards";
        textFile = "Fries Cards";
    }
    else if (fileName.indexOf("CardsPC")>=0){
        text1 = "proteins";
        text2 = "publicationw";
        textFile = "Pathway Commons";
    }
    else if (fileName.indexOf("PopCha")>=0){
        text1 = "actors";
        text2 = "movies";
        textFile = "PopCha movies";
    }
    else if (fileName.indexOf("imdb")>=0){
        text1 = "actors";
        text2 = "movies";
        textFile = "IMDB movies";
    }
    else if (fileName == "data2/VISpapers1990-2016.tsv"){
        text1 = "authors";
        text2 = "papers";
        textFile = "VIS publications";
    }
    else{
        textFile = fileName.split("/")[1].split(".tsv")[0];
    }

    svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx - 10)
        .attr("y", yy-40)
        .text("Data:")
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .style("text-anchor", "left")
        .style("fill", "#000");

    svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx + 24)
        .attr("y", yy-40)
        .text(textFile)
        .attr("dy", ".21em")
        .attr("font-family", "Impact, Charcoal, sans-serif")
        .attr("font-size", "18px")
        .style("text-anchor", "left")
        .style("fill", "#000");    

    svg.append("text")
        .attr("class", "nodeLegend")
        .attr("x", xx - 10)
        .attr("y", yy-17)
        .text(termArray.length + " "+text1+" of " + data.length + " "+text2)
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .style("text-anchor", "left")
        .style("fill", "#000000");

     // Count terms for each category
    var countList = {};      
    for(var i = 0;i <termArray.length; i++){
        if (countList[termArray[i].category]==undefined)
            countList[termArray[i].category] = 1;
        else
            countList[termArray[i].category]++;
    }   

    // Draw color legend
     svg.selectAll(".legends")
        .data(categories)
        .enter()
        .append("circle")
        .attr("class", "legends")
        .attr("cx", xx)
        .attr("cy", function (d, i) {
            return yy + i * 16;
        })
        .attr("r", rr)
        .style("fill", function (d, i) {
            return getColor3(d);
        });

    svg.selectAll(".legendText")
        .data(categories)
        .enter()
        .append("text")
        .attr("class", "legendText")
        .attr("x", xx + 10)
        .attr("y", function (d, i) {
            return yy + i * 16+2;
        })
        .text(function (d) {
            return d + " ("+countList[d]+" "+text1+")";
        })
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .style("text-anchor", "left")
        .style("fill", function (d, i) {
            return getColor3(d);
        });

}

function removeColorLegend() {
    svg.selectAll(".nodeLegend").remove();
}

function drawTimeLegend() {
    var listX = [];
    if (fileName == "data2/VISpapers1990-2016.tsv" || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
        for (var i = minYear; i <= maxYear; i++) {
            var xx = xStep + xScale(i - minYear);
            var obj = {};
            obj.x = xx;
            obj.year = i;
            listX.push(obj);   
        }
    }
    else{    
        for (var i = minYear; i <= maxYear; i++) {
            for (var j = 0; j < 12; j++) {
                var xx = xStep + xScale((i - minYear) * 12 + j);
                var obj = {};
                obj.x = xx;
                obj.year = i;
                listX.push(obj);
            }
        }
    }

    svg.selectAll(".timeLegendLine").data(listX)
        .enter().append("line")
        .attr("class", "timeLegendLine")
        .style("stroke", "000")
        .style("stroke-opacity", 1)
        .style("stroke-width", 0.3)
        .attr("x1", function (d) {
            return d.x;
        })
        .attr("x2", function (d) {
            return d.x;
        })
        .attr("y1", 0)
        .attr("y2", 1500);
    svg.selectAll(".timeLegendText").data(listX)
        .enter().append("text")
        .attr("class", "timeLegendText")
        .style("fill", "#000000")
        .style("text-anchor", "start")
        .style("text-shadow", "1px 1px 0 rgba(255, 255, 255, 0.6")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d, i) {
                return height - 15;
        })
        .attr("dy", ".21em")
        .attr("font-family", "sans-serif")
        .attr("font-size", "13px")
        .text(function (d, i) {
            if (fileName == "data2/VISpapers1990-2016.tsv" || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
                return d.year;
            }    
            else{
                if (i % 12 == 0)
                    return d.year;
                else
                    return months[i % 12];
            }    
        });
}

function updateTimeLegend() {
    var listX = [];

    if (fileName == "data2/VISpapers1990-2016.tsv" || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
        for (var i = minYear; i <= maxYear; i++) {
            var xx = xStep + xScale(i - minYear);
            var obj = {};
            obj.x = xx;
            obj.year = i;
            listX.push(obj);   
        }
    }
    else{    
        for (var i = minYear; i <= maxYear; i++) {
            for (var j = 0; j < 12; j++) {
                var xx = xStep + xScale((i - minYear) * 12 + j);
                var obj = {};
                obj.x = xx;
                obj.year = i;
                listX.push(obj);
            }
        }
    }

    svg.selectAll(".timeLegendLine").data(listX).transition().duration(500)
        .style("stroke-dasharray", function (d, i) {
            if (fileName == "data2/VISpapers1990-2016.tsv" || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
                return i % 5 == 0 ? "3, 1" : "1, 3"
            }
            else{ 
                if (!isLensing)
                    return "1, 2";
                else
                    return i % 12 == 0 ? "3, 1" : "1, 3"
            }    
        })
        .style("stroke-opacity", function (d, i) {
            if (fileName == "data2/VISpapers1990-2016.tsv" || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
                return 1;
            }
            else{    
                if (i % 12 == 0)
                    return 1;
                else {
                    if (isLensing && lMonth - numLens <= i && i <= lMonth + numLens)
                        return 1;
                    else
                        return 0;
                }
            }
        })
        .attr("x1", function (d) {
            return d.x;
        })
        .attr("x2", function (d) {
            return d.x;
        });
    svg.selectAll(".timeLegendText").data(listX).transition().duration(500)
        .style("fill-opacity", function (d, i) {
            if (fileName == "data2/VISpapers1990-2016.tsv" || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
                if (i % 5 == 0)
                    return 1;
                else {
                    if (isLensing && lMonth - numLens <= i && i <= lMonth + numLens)
                        return 1;
                    else
                        return 0;
                }
            }    
            else{
                if (i % 12 == 0)
                    return 1;
                else {
                    if (isLensing && lMonth - numLens <= i && i <= lMonth + numLens)
                        return 1;
                    else
                        return 0;
                }
            }    
        })
        .attr("x", function (d, i) {
            return d.x;
        });

    // SCALE force layouts ************************************
    for (var i = minYear; i <= maxYear; i++) {
        for (var j = 0; j < 12; j++) {
            var m = (i - minYear) * 12 + j;
            var view = "0 0 " + forceSize + " " + forceSize;

            var scale = 0.12;
            if (lMonth - numLens <= m && m <= lMonth + numLens)
                view = (forceSize * (1-scale)/2) + " " + (forceSize * (1-scale)/2) + " " + (forceSize * scale) + " " + (forceSize * scale);
            svg.selectAll(".force" + m).transition().duration(500)
                .attr("x", xStep - forceSize / 2 + xScale(m))
                .attr("viewBox", view);
        }
    }

}

function drawTimeBox() {
    svg.append("rect")
        .attr("class", "timeBox")
        .style("fill", "#aaa")
        .style("fill-opacity", 0.2)
        .attr("x", xStep)
        .attr("y", yTimeBox)
        .attr("width", XGAP_ * numMonth)
        .attr("height", 30)
        .on("mouseout", function () {
            isLensing = false;
            coordinate = d3.mouse(this);
            lMonth = Math.floor((coordinate[0] - xStep) / XGAP_);
        })
        .on("mousemove", function () {
            isLensing = true;
            coordinate = d3.mouse(this);
            lMonth = Math.floor((coordinate[0] - xStep) / XGAP_);
            
            // Update layout
            updateTimeLegend();
            updateTimeBox();

        });
}

function updateTimeBox() {
    svg.selectAll(".timeLegendText")
        /*.style("fill-opacity", function (d, i) {
            if (i % 12 == 0)
                return 1;
            else {
                if (isLensing && lMonth - numLens <= i && i <= lMonth + numLens)
                    return 1;
                else
                    return 0;
            }
        })*/
        .attr("y", function (d, i) {
            if (fileName == "data2/VISpapers1990-2016.tsv"  || fileName.indexOf("imdb")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
                return yTimeBox + 20;
            }
            else{
                return (i % 12 == 0) ? yTimeBox + 12 : yTimeBox + 22;
            }    
            
        })
        .attr("x", function (d, i) {
            return d.x;
        });

    // Recompute the timeArcs
    if (oldLmonth != lMonth) {
        drawgraph2();
        oldLmonth = lMonth;
    }
}

var buttonLensingWidth =100;
var buttonheight =18;
var roundConner = 4;
var colorHighlight = "#fc8";
var buttonColor = "#ddd";

function drawControlPanel(){
    // Control panel on the left *********************
    var yControl = 80;
    var data =[{"id":1, "value":">=1"},{"id":2, "value":">=2"},{"id":3, "value":">=3"},{"id":4, "value":">=4"},{"id":5, "value":">=5"},{"id":"optimized", "value":"Best Q modularity"}];
    svg.append('rect').attr("class", "rect1").attr('x',0.1).attr('y',yControl).attr('width',150).attr('height',110).style("stroke","black").attr("stroke-width", 0.1).style('fill',"#eee").attr("rx", roundConner)
        .attr("ry", roundConner)
    svg.append('text')
        .attr('class','textcutoff')
        .style("font-style","italic")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr('x',13)
        .attr('y', yControl+22)
        .text('Select nodes by');
    svg.append('text')
        .attr('class','textcutoff')
        .style("font-style","italic")
        .attr('x',13)
        .attr('y', yControl+71)
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .text('Select edge weight');

    // Control panel on the left *********************
    var select = d3.select('body').append('select').attr('id','sdropdown').on('change',function () {
        selectValue = d3.select('#sdropdown').property('value');
        setCut(selectValue);

    })
    var options = select.selectAll('option').data(data).enter().append('option').attr('value', function (d) {
        return d.id;
    }).text(function (d) {
        return d.value;
    })

    var orderdata = [{"id": 1, "value": "Frequency"}, {"id": 2, "value": "Net frequency"}, {"id": 3, "value": "Degree"},{
        "id": 4,
        "value": "Betweenness centrality"
    }];
    var selectOrder = d3.select('body').append('select').attr('id', 'orderdropdown').on('change',setNodesBy);
    var Orderoptions = selectOrder.selectAll('option').data(orderdata).enter().append('option').attr('value', function (d) {
        return d.id;
    }).text(function (d) {
        return d.value;
    })
}
