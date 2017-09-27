/**
 * Created by vinhtngu on 3/10/17.
 */

var forceSize = 150; // Max size of force layouts at the bottom

/*function getColor3(study_type) {
 if (study_type == "person")
 return "#0f0";
 else if (study_type == "location")
 return "#f00";
 else if (study_type == "organization")
 return "#00f";
 else if (study_type == "miscellaneous")
 return "#ff0";
 else {
 return "black";
 }
 }*/

var getColor3 = d3.scale.category10();
var linkScale2 = d3.scale.linear()
    .range([0.05, 0.3])
    .domain([0, 10]);

var allSVG = [];
function updateSubLayout(nodes, links, m) {

    console.log("updateSubLayout:"+m);

    var fill = d3.scale.category10();
    var groups = d3.nest()
        .key(function (d) {
            return d.community;
        })
        .entries(nodes);
    groups = groups.filter(function (d) {
        return d.values.length > 1;
    });
    var partition = [];
    groups.forEach(function (d) {
        var temp = [];
        d.values.forEach(function (e) {
            temp.push(e.id);
        })
        partition.push(temp);
    });

    /*var filteredlinks = [];
     links.forEach(function (d) {
     partition.forEach(function (e) {
     if(e.indexOf(d.source.id)>=0&&e.indexOf(d.target.id)>=0){
     filteredlinks.push(d);
     }
     })
     });*/

    var groupPath = function (d) {
        var fakePoints = [];
        if (d.values.length == 2) {
            //[dx, dy] is the direction vector of the line
            var dx = d.values[1].x - d.values[0].x;
            var dy = d.values[1].y - d.values[0].y;

            //scale it to something very small
            dx *= 0.00001;
            dy *= 0.00001;

            //orthogonal directions to a 2D vector [dx, dy] are [dy, -dx] and [-dy, dx]
            //take the midpoint [mx, my] of the line and translate it in both directions
            var mx = (d.values[0].x + d.values[1].x) * 0.5;
            var my = (d.values[0].y + d.values[1].y) * 0.5;
            fakePoints = [[mx + dy, my - dx],
                [mx - dy, my + dx]];
            //the two additional points will be sufficient for the convex hull algorithm
        }
        //do not forget to append the fakePoints to the input data
        return "M" +
            d3.geom.hull(d.values.map(function (i) {
                return [i.x, i.y];
            })
                .concat(fakePoints))
                .join("L")
            + "Z";
    }
    var groupFill = function (d, i) {
        // return fill(+d.key);
        return "#000";
    };
    //var width = 20, height = 20;
    //var svg = d3.select("body").append("svg").attr("width", XGAP_).attr("height", XGAP_);


    svg.selectAll(".force" + m).remove();

    var svg2 = svg.append("svg")
        .attr("class", "force" + m)
        .attr("width", forceSize)
        .attr("height", forceSize)
        .attr("x", xStep - forceSize / 2 + m * XGAP_)
        .attr("y", height);
    allSVG.push(svg2);

    var force = d3.layout.force()
        .gravity(0.5)
        .distance(2)
        .charge(-2)
        .size([forceSize, forceSize]);
    force.nodes(nodes)
        .links(links)
        .start();
    //force.resume();

    var link = svg2.selectAll(".link5")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link5")
        .style("stroke", "#777")
        .style("stroke-width", function (d) {
            return linkScale2(d.count);
        });

    var node = svg2.selectAll(".node5")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", "node5")
        .attr("r", 0.5)
        .style("stroke", "#000")
        .style("stroke-width", 0.05)
        .style("stroke-opacity", 0.5)
        // .style("fill-opacity",0.3)
        .style("fill", function (d) {
            return getColor3(d.category);
        });

    force.on("tick", function () {

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
        svg2.selectAll("path")
            .data(groups)
            .attr("d", groupPath)
            .enter().append("path", "circle")
            .style("fill", groupFill)
            .style("stroke", groupFill)
            .style("stroke-width", 1)
            .style("stroke-linejoin", "round")
            .style("opacity", .2)
            .attr("d", groupPath);

    });
    force.on("end", function () {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
        }
    );
}