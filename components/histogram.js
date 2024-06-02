class Histogram {
    margin = {
        top: 20, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = '45vw', height = '35vw') {
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
    console.log(anotherFeature);
    this.container.selectAll("*").remove();
    this.xAxis.selectAll("*").remove();
    this.yAxis.selectAll("*").remove();
    this.legend.selectAll("*").remove();
    this.updateHistogram(data,xVar)
    }
    updateHistogram(data, xVar) {
    const counts = {};
    data.forEach(d => {
        if (!isNaN(d[xVar])) {
            let temp;
            if (xVar === 'Reviews') {
                temp = floorToNearestreview(d[xVar]);
            } else if (xVar === 'Size') {
                temp = floorToNearestsize(d[xVar]);
            } else if (xVar === 'Price') {
                temp = floorToNearestprice(d[xVar]);
            } else if (xVar === 'Rating') {
                temp = floorToNearestprice(d[xVar]);
            } else if (xVar === 'Android Ver') {
                temp = floorToNearestprice(d[xVar]);
            } else {
                temp = d[xVar];
            }
            if (!isNaN(temp)) {
                counts[temp] = (counts[temp] || 0) + 1;
            }
        }
    });
    const categories = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const countsArray = categories.map(category => counts[category]);


    this.xScale.domain(categories).range([0, this.width]).padding(0.3);
    this.yScale.domain([0, d3.max(countsArray)]).range([this.height, 0]);


    this.container.selectAll("rect")
        .data(categories)
        .join("rect")
        .attr("x", d => this.xScale(d))
        .attr("y", d => this.yScale(counts[d]))
        .attr("width", this.xScale.bandwidth())
        .attr("height", d => this.height - this.yScale(counts[d]))
        .attr("fill", "lightgray");
    this.xAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
        .call(d3.axisBottom(this.xScale).tickFormat(d => {
            if (d >= 1000000) {
                return `${d / 1000000}M`;
            } else if (d >= 1000) {
                return `${d / 1000}k`;
            }
            return d;
        }));

    this.yAxis
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.yScale));
    }
}
function convertVwToPx(value){
    if (typeof value === 'string' && value.endsWith('vw')) {
    const vw = parseFloat(value);
      return (vw / 100) * window.innerWidth;
    }
    return value;
}
function floorToNearestreview(number) {
    return Math.floor(number / 1000000) * 1000000;
}
function floorToNearestsize(number) {
    return Math.floor(number / 10) * 10;
}
function floorToNearestprice(number) {
    return Math.floor(number / 1) * 1;
}
