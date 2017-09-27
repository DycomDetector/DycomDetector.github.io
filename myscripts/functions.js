/**
 * Created by vinhtngu on 3/29/17.
 */
var cutoff_Check=[];
function get_bestCut(graph) {
 var temp = JSON.parse(JSON.stringify(graph));
 var cutArray =[];
    temp.forEach(function (d,i) {
        if(d!==null){
            if(d.length==0){
                cutArray[i]='NaN';
            }else{
                cutArray[i]=d.sort(function (a,b) {
                    return b.Qmodularity - a.Qmodularity
                })[0].cutoff;
            }
        }


 })
return cutArray;
}
/*@input : graph with nodes and links
*@output: betweeness centrality
*/
function calculate_betweenness_centrality(graph) {
    var adjlist = create_adjacencylist(graph);
    var betweenness = betweenness_centrality(adjlist);
    return betweenness;

}
/*@input: graph, @cutoffvalue
*@output: return graph with cutoff value
*/
function getGraphbyCutoffvalue(graph, cutoff) {
    var cutoffgraph=[];
    var temp = JSON.parse(JSON.stringify(graph));
    temp.forEach(function (d,i) {
        if(d!==null){
            cutoffgraph[i]=[];
            if(d.length!=0){
                d.forEach(function (a) {
                    if(a.cutoff==cutoff){
                        cutoffgraph[i].push(a);
                    }
                })
            }
        }
    })
    return cutoffgraph;
}

function graphInsertBetweeness(graph, cutoff) {
    
    graph.forEach(function (graphlist) {
        graphlist.forEach(function (subgraph) {
            if(subgraph.cutoff==cutoff){
                var betweenness = calculate_betweenness_centrality(subgraph);
                subgraph.nodes.forEach(function (n,i) {
                    n.betweenness = betweenness[i];
                })
            }
        })
    });
return graph;
}