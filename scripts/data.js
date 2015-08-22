function saveFile(gridSize) {

  var squaresOuter = [];  // array of arrays
  var squaresInner;       // inner array

  for (var r = 0; r < gridSize; r++) {
    squaresInner = [];
    for (var c = 0; c < gridSize; c++) {
      var currentCell = $('#' + r + '-' + c);
      if (currentCell.hasClass('black')) {
        squaresInner.push('*');
      } else {
        squaresInner.push($(currentCell).find('.cellValue').text());
      }
    }
    squaresOuter.push(squaresInner);
  }

  var jsonString = JSON.stringify(squaresOuter);
  var titleInput = $('#puzzleTitleValue').val();
  var puzzleTitle = titleInput == '' ? 'mypuzzle.cw' : $('#puzzleTitleValue').val() + '.cw';
  download(puzzleTitle, jsonString);
}

function convertToJson(crosswordInfo) {
    return '';
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function loadFile() {
  var input = $('#fileInput')[0].files[0];
  var reader = new FileReader();

  var jsonString;

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      jsonString = e.target.result.toString();
    };
  })(input);

  reader.readAsText(input);
  jsonString = JSON.parse(jsonString);
  console.log(jsonString);

  // parse string into array of arrays
  //var puzzleInfo = jQuery.parseJSON(jsonString);
  $.each(jsonString, function(i, object) {
          alert(object);
  });
  //console.log(puzzleInfo.length());
  //buildLoadedPuzzle(puzzleInfo.length(), puzzleInfo);

}

function buildLoadedPuzzle(puzzleSize, puzzleInfo) {

}
