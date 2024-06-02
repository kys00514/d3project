class Scatterplot {
  margin = {
    top: 10,
    right: 100,
    bottom: 40,
    left: 40,
  };

  constructor(svg, data, width = '35vw', height = '35vw') {
    this.svg = svg;
    this.data = data;
    this.width = convertVwToPx(width);
    this.height = convertVwToPx(height);
    this.topGenres = [];
    this.handlers = {};
    this.useFilter=false;
  }
  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
  initialize() {
    this.svg = d3.select(this.svg);
    this.container = this.svg.append("g");
    this.xAxis = this.svg.append("g");
    this.yAxis = this.svg.append("g");
    this.legend = this.svg.append("g");

    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10);

    this.svg
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.container.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top})`
    );
    this.topGenres = [
      "Tools",
      "Entertainment",
      "Education",
      "Medical",
      "Business",
      "Productivity",
      "Sports",
      "Personalization",
      "Communication",
      "Lifestyle",
    ];


    this.brush = d3
      .brush()
      .extent([
        [0, 0],
        [this.width, this.height],
      ])
      .on("start brush", (event) => {
        this.brushCircles(event);
      });
  }

  update(xVar, yVar, useFilter) {
    
    this.useFilter=useFilter;
    const formatNumber = (num) => {
      if (Math.abs(num) < 1) {
        return num.toFixed(1); 
      } else {
        let formatted;
        if (num >= 1e9) {
          formatted = (num / 1e9).toFixed(1) + "B";
        } else if (num >= 1e6) {
          formatted = num % 1e6 === 0 ? (num / 1e6).toFixed(0) + "M" : (num / 1e6).toFixed(1) + "M";
        } else if (num >= 1e3) {
          formatted = num % 1e3 === 0 ? (num / 1e3).toFixed(0) + "K" : (num / 1e3).toFixed(1) + "K";
        } else {
          formatted = num.toFixed(1);
        }
        if (formatted.endsWith('.0')) {
          formatted = formatted.slice(0, -2);
        }
        return formatted;
      }
    };
    this.container.call(this.brush);
    
    this.xVar = xVar;
    this.yVar = yVar;

    this.xScale
      .domain(d3.extent(this.data, (d) => d[xVar]))
      .range([0, this.width]);
    this.yScale
      .domain(d3.extent(this.data, (d) => d[yVar]))
      .range([this.height, 0]);
    this.zScale = d3
      .scaleOrdinal()
      .domain(this.topGenres)
      .range(d3.schemeCategory10);
    let filterdata=filterData(this.data);
    if(this.useFilter===true){
    this.circles = this.container.selectAll("circle").data(filterdata).join("circle");
    }
    else{
    this.circles = this.container.selectAll("circle").data(this.data).join("circle");
    }
    this.circles
      .transition()
      .attr("cx", (d) => this.xScale(d[xVar]))
      .attr("cy", (d) => this.yScale(d[yVar]))
      .attr("fill", (d) =>
      this.topGenres.includes(d.Genres)
            ? this.zScale(d.Genres)
            : "black"
      )
      .attr("r", 3);
    this.xAxis
      .attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.top + this.height})`
      )
      .transition()
      .call(d3.axisBottom(this.xScale).tickFormat(formatNumber));

    this.yAxis
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .transition()
      .call(d3.axisLeft(this.yScale).tickFormat(formatNumber));

  
      this.legend
        .style("display", "inline")
        .style("font-size", ".8em")
        .attr(
          "transform",
          `translate(${this.width + this.margin.left - 16}, ${this.height / 2})`
        )
        .call(d3.legendColor().scale(this.zScale));
    
  }

  isBrushed(d, selection) {
    let [[x0, y0], [x1, y1]] = selection;
    let x = this.xScale(d[this.xVar]);
    let y = this.yScale(d[this.yVar]);
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }


  brushCircles(event) {
    let selection = event.selection;
    if(this.useFilter===true){
    this.circles.classed("brushed", (d) => this.isBrushed(d, selection));
    let filterdata=filterData(this.data);
    if (this.handlers.brush)
      this.handlers.brush(
        
      filterdata.filter((d) => this.isBrushed(d, selection))
      );
    }
    else{
      this.circles.classed("brushed", (d) => this.isBrushed(d, selection));
      if (this.handlers.brush)
        this.handlers.brush(
          
        this.data.filter((d) => this.isBrushed(d, selection))
        );
    }

  }

  on(eventType, handler) {
    this.handlers[eventType] = handler;
  }
}
function filterData(data) {
  return data.filter((_, index) => index % 10 === 0);
}
function convertVwToPx(value){
  if (typeof value === 'string' && value.endsWith('vw')) {
    const vw = parseFloat(value);
    return (vw / 100) * window.innerWidth;
  }
  return value;
}