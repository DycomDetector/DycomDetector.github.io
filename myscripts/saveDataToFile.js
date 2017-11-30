// Work on FIREFOX

function saveData() {
  console.log("*********** saveTimeArcsData ******************");
  var csvContent = "Variables\tTerms";
  for (var m=0; m<numMonth;m++){
    var year =  minYear+Math.floor(m / 12); 
    var month = months[m % 12];

    if (fileName.indexOf("VIS")>=0 || fileName.indexOf("IMDB")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){      
       csvContent += "\t"+(minYear+m);
    }
    else{
       csvContent += "\t"+year+" "+month;
    }
  } 
  csvContent += "\n";

  if (fileName.indexOf("VIS")>=0 || fileName.indexOf("IMDB")>=0 || fileName.indexOf("PopCha")>=0 || fileName.indexOf("Cards")>=0){      
    for (var i=0; i<topNumber;i++){
      var term = top100termsArray[i].term;
      csvContent += "Node Frequnecy\t"+term;
      for (var m=0; m<numMonth;m++){
        if (terms[term][m]==undefined)
          csvContent += "\t"+"0";
        else
          csvContent += "\t"+terms[term][m];
      } 
      csvContent += "\n";
    }
    for (var i=0; i<topNumber;i++){
      var term = top100termsArray[i].term;
      csvContent += "Node degree\t"+term;
      for (var m=0; m<numMonth;m++){
          csvContent += "\t"+getNodeDegree(m,term);
      } 
      csvContent += "\n";
    }
  }
  else{
    for (var i=0; i<top100termsArray.length;i++){
        var term = top100termsArray[i].term;
        csvContent += "Term Frequnecy\t"+term;
        for (var m=0; m<numMonth;m++){
          if (terms[term][m]==undefined)
            csvContent += "\t"+"0";
          else
            csvContent += "\t"+terms[term][m];
        } 
        csvContent += "\n";
    }
  }
 // var data = "{name: ['Bob','aa'], occupation: 'Plumber'}";
  var url = 'data:text;charset=utf8,' + encodeURIComponent(csvContent);
  window.open(url, '_blank');
  window.focus();
}

function getNodeDegree(m, term){
  for (var i=0;i<graphByMonths[m][0].nodes.length;i++){
    if (graphByMonths[m][0].nodes[i].name==term){
      if (graphByMonths[m][0].nodes[i].weight!=undefined)
        return graphByMonths[m][0].nodes[i].weight;
      else
        return 0;
    }
  }
  return 0;
}

