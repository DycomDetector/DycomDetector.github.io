/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

var tipWidth = 270;
var tipHeight = 470;
var tip_svg;
var y_svg;

var colorHighlight = "#fc8";
var buttonColor = "#ddd";
var timeDelay = 150;


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .style('border', '1px solid #555');


function showTip(d,tipItem) { 
  // Update network
  for (var i=0; i<allSVG.length;i++){
      var svg2 = allSVG[i];
      svg2.selectAll(".node5")
          //.transition().duration(timeDelay)
          .style("fill-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0.2; })
          .style("stroke-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0; }); 
      svg2.selectAll(".link5")
          //.transition().duration(timeDelay)
          .style("stroke-opacity", function(d2){
              return (d.name == d2.source.name || d.name == d2.target.name) ? 1 : 0.1;
             });   
      svg.selectAll(".textCloud3") 
        //.transition().duration(timeDelay)      
        .style("fill-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0.1; });  
      svg.selectAll(".layer3")
        //.transition().duration(timeDelay)  
        .style("fill-opacity", function(d2){ return (d.name == d2.name) ? 0.8 : 0.08; })
        .style("stroke-opacity", function(d2){ return (d.name == d2.name) ? 1 : 0; });  
       
       var nameList = "";
       svg.selectAll(".linkArc3") 
        //.transition().duration(timeDelay)
          .style("stroke-opacity", function(d2){
            // Create list of name
            if (d.name == d2.source.name || d.name == d2.target.name) {
              if (nameList.indexOf(d2.source.name)<0)
                nameList+= "__"+d2.source.name;
              if (nameList.indexOf(d2.target.name)<0)
                nameList+= "_"+d2.target.name+"_";
            }
            return (d.name == d2.source.name || d.name == d2.target.name) ? 1 : 0.1;
           });   
      svg.selectAll(".nodeText3")  
        //.transition().duration(timeDelay)      
        .style("fill-opacity", function(d2){ return (nameList.indexOf("_"+d2.name+"_")>=0) ? 1 : 0.1; });  
  }

  // Add time series of frequeny{}
  var monthly = computeMonthlyData(d.name); // count number of items in the time series to position the tooltip
  tip.html(function(d) {
    var str ="";
    if (d.ref==undefined) { //  In the main View
      str+="<b> Node info: </b>"
      str+="<table border='0.5px'  style='width:100%'>"
      for (key in d) {
        if (key== "net"){     
          str+=  "<tr><td>frequency net</td> <td align='right'>  <span style='color:black'>" +Math.round(d[key])+ "</span> </td></tr>";
        }
        else if (key== "measurement"){     
          str+=  "<tr><td>Measurement</td> <td align='right'>  <span style='color:black'>" +Math.round(d[key])+ "</span> </td></tr>";
        }
        else if (key== "weight"){     
          str+=  "<tr><td>Degree</td> <td align='right'>  <span style='color:black'>" +d[key]+ "</span> </td></tr>";
        }
        else if (key== "name"){
            str+=  "<tr><td>"+key+"</td> <td>  <span style='color:"+ getColor3(d.category)+";text-shadow: 0px 0px 0px #000;'>" + d[key] + "</span> </td></tr>"; 
        }
        else if (key== "x" || key== "y" || key== "px" || key== "py" || key== "category"|| key== "index" || 
          key== "isConnected" || key=="indexForTextClouds" || key=="monthly"|| key=="frequency" || key=="m")
            ;// Do nothing
        else{
          var value = d[key];
          if (value==undefined)
            value = "?";
          str+=  "<tr><td>"+key+"</td> <td align='right'>  <span style='color:black'>" + value + "</span> </td></tr>";
        }     
      } 
      str+="</table>"

      // Add time series of frequeny{}
      if (monthly){
        str+="<table border='0.5px'  style='background-color:rgba(0, 0, 0, 0);width:100%'>"

        // table header 
        if (fileName.indexOf("VIS")>=0|| fileName.indexOf("IMDB")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
            str+=  "<tr><td align='right' style='background-color:rgba(0, 0, 0, 0);'><b>Year</b></td> <td align='right' style='background-color:rgba(0, 0, 0, 0);'>  <span style='color:black'> <b>frequency<b> </span> </td></tr>";
        }
        else 
          str+=  "<tr><td align='right' style='background-color:rgba(0, 0, 0, 0);'><b>Month</b></td> <td align='right' style='background-color:rgba(0, 0, 0, 0);'>  <span style='color:black'> <b>frequency<b> </span> </td></tr>";

        for (var key in monthly) {
          var value = monthly[key].value;
          if (value>0){
            // table header 
            var time ;
            if (fileName.indexOf("VIS")>=0 || fileName.indexOf("IMDB")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){
                time =  (+monthly[key].monthId+minYear);
              }
            else {
               time =  months[monthly[key].monthId%12] +" "+(minYear+Math.round(monthly[key].monthId/12)); 
            }
            if (d.m==monthly[key].monthId)
              str+=  "<tr><td  align='right'><b>"+time+"</b></td> <td align='right'>  <span style='color:black'><b>" + value + "</b></span> </td></tr>";
            else
              str+=  "<tr><td  align='right'>"+time+"</td> <td align='right'>  <span style='color:black'>" + value + "</span> </td></tr>";
          }   
        } 
        str+="</table>"
      }
      return str;
    }
      
   });   
  tip.direction('se');
  //tip.direction('n') 

  tip.offset([-d3.event.pageY+380,-d3.event.pageX]) // d3.event.pageX is the mouse position in the main windown
      
  tip.show(d);   
}    

function hideTip(d) { 
  // Update network
  for (var i=0; i<allSVG.length;i++){
      var svg2 = allSVG[i];
      svg2.selectAll(".node5")
          //.transition().duration(100)
          .style("fill-opacity", 1)
          .style("stroke-opacity", 1); 
      svg2.selectAll(".link5")
          //.transition().duration(100)
          .style("stroke-opacity", 0.6);   
  }
  svg.selectAll(".textCloud3")  
        //.transition().duration(100)       
        .style("fill-opacity", 1);    
  svg.selectAll(".layer3")  
        //.transition().duration(100)
        .style("fill-opacity", 0.3)
        .style("stroke-opacity", 1);  
  svg.selectAll(".linkArc3") 
        //.transition().duration(100)
        .style("stroke-opacity", 0.6);     
  svg.selectAll(".nodeText3")  
        //.transition().duration(timeDelay)      
        .style("fill-opacity", 1);       
  tip.hide();
}  



