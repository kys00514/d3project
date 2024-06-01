class DataTable {
  constructor(id) {
    this.id = id;
  }

  update(data, columns,datatype,sort) {
    
    const selectedIndices = [0,1, 6, 7,8,9,10];
    const selectedIndices1 = [0,2, 3, 4,5,11,12];

    let subsetColumns;
    if(datatype)
        subsetColumns = selectedIndices.map(index => columns[index]);
    else
        subsetColumns= selectedIndices1.map(index=>columns[index]);
    
        data.sort((a, b) => {
          let sorts=0;
          if(sort==='App'){
            sorts=0;
          }
          if(sort==='Android Ver'){
            sorts=12;
          }
          if(sort==='Genres'){
            sorts=1;
          }
          let aValue = a[columns[sorts]];
          let bValue = b[columns[sorts]];

          // Convert to numbers if they are numeric strings
          if (!isNaN(aValue) && !isNaN(bValue)) {
              aValue = +aValue;
              bValue = +bValue;
          }

          if (aValue < bValue) return true ? -1 : 1;
          if (aValue > bValue) return true ? 1 : -1;
          return 0;
      });
  
    let rows = d3.select(this.id).selectAll("tr").data(data).join("tr");

   
    this.anotherFunction(rows, subsetColumns);
    
  }
  anotherFunction(rows, subsetColumns) {
    
    
    rows
      .selectAll("td")
      .data((rowData) => subsetColumns.map((column) => rowData[column]))
      .join("td")
      .text((cellData) => cellData);
  }
}
