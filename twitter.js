"use strict";

const POP_THRESHHOLD = 5;

var pp = _.chain(links.links).supergroup(['pp','arp'])
            .filter(d=>d.children.length >= POP_THRESHHOLD)
            .filter(d=>userdata[d+''])
            .addSupergroupMethods()
            .value();
console.log(pp);
var allWords = _.reduce(_.values(words), function(memo,user) { 
    _.each(user, function(w,v) {
      memo[w.toString()]=(memo[w.toString()]||0)+v
    })
    return memo;
  },{})

var getX = d => userdata[d+''].followers_count;
var getY = d => d.children.length;
var getSize = d => userdata[d+''].statuses_count;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.log()
    .range([0, width]);

var size = d3.scale.log()
    .range([5, 30]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#root").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `<strong>${d.toString()}</strong> mentioned by <strong>${d.children.length}</strong> at risk people`;
  })

svg.call(tip);

  x.domain(d3.extent(pp, getX));
  y.domain(d3.extent(pp, getY));
  size.domain(d3.extent(pp, getSize));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Followers");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("At risk popularity")

  svg.selectAll(".dot")
      .data(pp)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", d => size(getSize(d)))
      .attr("cx", function(d) { return x(getX(d)); })
      .attr("cy", function(d) { return y(getY(d)); })
      .style("opacity", .4)
      .on('mouseover', tip.show)
      .on('mouseover.word', wordcloud)
      .on('mouseout', tip.hide)
      
      .style("fill", function(d) { return color(d+''); });

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style('opacity', .4)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });



var fill = d3.scale.category20();
var fontSize = d3.scale.sqrt().range([20,120]);

var wcwidth = 800, wcheight = 300;
var wcsvg = d3.select("body")
        .append("svg")
        .attr("width", wcwidth)
        .attr("height", wcheight)
      .append("g")
        .attr("transform", "translate(" + wcwidth / 2 + "," + wcheight / 2 + ")")

function wordcloud(pp) {
  fontSize.domain(d3.extent(_.values(words[pp])));
  console.log(fontSize.domain());
  //var junk = [];
  var layout = d3.layout.cloud()
      .size([wcwidth, wcheight])
      .words(_.map(words[pp.toString()], function(cnt, word) {
        //_.range(cnt).forEach(()=>junk.push(word));
        var w = {text: word, size: fontSize(cnt), test: "haha"};
        //var w = {text: word, size: cnt, test: "haha"};
        return w;
      }))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      //.rotate(()=>0)
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw);
  //console.log(junk.join(' '));
  layout.start();
  function draw(words, bounds) {
    wcsvg.selectAll("text").remove();
    wcsvg.selectAll("text")
      .data(words, d=>d.text)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          console.log(d);
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    //debugger;
  }
}


