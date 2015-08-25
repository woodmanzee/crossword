var loadedGrid;
var fileName;
var readOnly = false;

function saveFile(gridSize) {

  exitHelp();

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
  var puzzleTitle = titleInput == '' ? 'mypuzzle' : $('#puzzleTitleValue').val();
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

function onLoadClick(type) {
  if (gridSize != null) {
    if (confirm("Are you sure you want to leave this puzzle and load a different one?")) {
      loadFile(type);
    }
    return false;
  }
}

// type 1 is edit, type 2 is read only for solve
function loadFile(type) {
  exitHelp();
  readOnly = type == 1 ? false : true;
  setLoadType();
  var input = document.getElementById('fileInput').files[0];
  fileName = input.name;
  var reader = new FileReader();
  reader.readAsText(input);
  reader.onload = function(e) {
      // browser completed reading file - display it
      var result = (e.target.result).toString();
      loadedGrid = $.parseJSON(result);
      buildLoadedPuzzle(loadedGrid.length, loadedGrid, fileName);
  };
}

function buildLoadedPuzzle(puzzleSize, puzzleInfo, puzzleName) {
    gridSize = puzzleSize;
    $('#puzzleTitleValue').val(puzzleName);
    $('#createPanel').attr('style', 'display:block;');
    $('#promptPanel').attr('style', 'display:none;');
    $('#crosswordBody').empty();
    $('#crosswordBody').append(generateGrid());
    setupHandlers();
    editMode = 1;

    for (var r = 0; r < puzzleSize; r++) {
      for (var c = 0; c < puzzleSize; c++) {
        var cur = $('#' + r + '-' + c);
        if (puzzleInfo[r][c] == '*') {
          $(cur).addClass('black');
        } else {
          $(cur).find('.cellValue').text(puzzleInfo[r][c]);
        }
      }
    }
    numberCells();
}

function setLoadType() {
  // if readOnly is true, hide certain buttons and don't add the
}
