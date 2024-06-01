class piegraph {
    margin = {
        top: 20, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = '60vw', height = '35vw') {
   
        this.svg = svg;
        this.width = convertVwToPx(width);
        this.height = convertVwToPx(height);
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
      
    }

    initialize() {
    
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleBand();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(data,xVar,anotherFeature){

     this.container.selectAll("*").remove();
     this.xAxis.selectAll("*").remove();
     this.yAxis.selectAll("*").remove();
     this.legend.selectAll("*").remove();

  
    
        this.updatePieGraph(data,xVar);  
    }
   
    updatePieGraph(data,xVar){
    
     
          const counts = {};
          data.forEach(d => {
              counts[d[xVar]] = (counts[d[xVar]] || 0) + 1;
          });
 
          const topGenresCounts = {};
          let othersCount = 0;
      
          Object.keys(counts).forEach(category => {
              if (this.topGenres.includes(category)) {
                  topGenresCounts[category] = counts[category];
              } else {
                  othersCount += counts[category];
              }
          });
      
      
          this.topGenres.forEach(genre => {
              if (!(genre in topGenresCounts)) {
                  topGenresCounts[genre] = 0;
              }
          });
      
      
          const categories = Object.keys(topGenresCounts);
          if (othersCount > 0) {
              categories.push("Others");
              topGenresCounts["Others"] = othersCount;
          }
      
        
          const colorScale = d3.scaleOrdinal()
              .domain(categories)
              .range([...d3.schemeCategory10, '#FFFF11']); 
      
         
          const colorMapping = {};
          categories.forEach((category, index) => {
              colorMapping[category] = category === "Others" ? '#FFFF11' : d3.schemeCategory10[index % 10];
          });
      
          
      
      
          const margin = { top: 20, right: 20, bottom: 20, left: 20 };
          const translateX = this.width / 2 + margin.right; 
          const translateY = this.height / 2 + margin.bottom; 
          this.container.attr("transform", `translate(${translateX}, ${translateY})`);
          
      
          const pie = d3.pie().value(d => topGenresCounts[d]);
          const arc = d3.arc().innerRadius(0).outerRadius(Math.min(this.width, this.height) / 2 - margin.right - margin.bottom);
      
          const pieData = pie(categories);
      
        
          const pieSegments = this.container.selectAll("path").data(pieData);
      
      
          pieSegments
              .enter()
              .append("path")
              .attr("d", arc)
              .attr("fill", d => colorMapping[d.data]);
      
    
          pieSegments.attr("d", arc);
      
    
          pieSegments.exit().remove();
      
         
          const legend = this.container.selectAll(".legend")
              .data(categories);
      
         
          legend.exit().remove();
      
         
          const legendEnter = legend.enter().append("g")
              .attr("class", "legend")
              .attr("transform", (d, i) => `translate(-160, ${i * 20 + 20})`); 
      
          legendEnter.append("rect")
              .attr("x", this.width / 2 - margin.right)
              .attr("width", 18)
              .attr("height", 18)
              .attr("fill", d => colorMapping[d]);
      
          legendEnter.append("text")
              .attr("x", this.width / 2 - margin.right + 22)
              .attr("y", 9)
              .attr("dy", ".35em")
              .text(d => d);
      
      
          legend.select("rect")
              .attr("fill", d => colorMapping[d]);
      
          legend.select("text")
              .text(d => d);

    }
}
function convertVwToPx(value){
    if (typeof value === 'string' && value.endsWith('vw')) {
    const vw = parseFloat(value);
      return (vw / 100) * window.innerWidth;
    }
    return value; 
}