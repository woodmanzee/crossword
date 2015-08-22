function saveFile(gridSize) {

  var blackSquares = [];  // contains all black squares
  var letters = [];       // contains all answer letters

  for (var r = 0; r < gridSize; r++) {
    for (var c = 0; c < gridSize; c++) {
      var currentCell = $('#' + r + '-' + c);
      if (currentCell.hasClass('black')) {
        blackSquares.push(r + '-' + c);
      } else {
        letters.push($(currentCell).find('.cellValue').text);
      }
    }
  }
}

function loadFile() {
  
}
