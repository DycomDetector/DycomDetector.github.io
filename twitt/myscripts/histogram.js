/**
 * Created by vinhtngu on 3/27/17.
 */
var hisSize = 300;
function drawHistogram(graph, m) {
    var histogram = svg.append("svg")
        .attr("class", "histogram" + m)
        .attr("width", hisSize)
        .attr("height", hisSize)
        .attr("x", m * XGAP_)
        .attr("y", height + 150)
    histogram.append("rect").attr("x")


}