var loadedGrid;
var fileName;
var readOnly = false;

function saveFile(gridSize) {

  exitHelp();

  var squaresOuter = [];  // array of arrays
  var squaresInner;       // inner array
  var clueMap = {};       // clues
  var fullString;         // full string of data

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

  fullString = JSON.stringify(squaresOuter);

  $('.clueInput').each(function(index) {
    clueMap[$(this).attr('id')] = $(this).val();
  });
  console.log(clueMap);

  fullString += 'BREAK';
  fullString += JSON.stringify(clueMap);
  console.log(fullString);

  var titleInput = $('#puzzleTitleValue').val();
  var puzzleTitle = titleInput == '' ? 'mypuzzle' : $('#puzzleTitleValue').val();
  download(puzzleTitle, fullString);
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
  } else {
    loadFile(type);
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
      var resultSplit = result.split('BREAK');
      loadedGrid = $.parseJSON(resultSplit[0]);
      var loadedClues = $.parseJSON(resultSplit[1]);
      buildLoadedPuzzle(loadedGrid.length, loadedGrid, fileName, loadedClues);
  };
}

function buildLoadedPuzzle(puzzleSize, puzzleInfo, puzzleName, puzzleClues) {
    gridSize = puzzleSize;
    $('#puzzleTitleValue').val(puzzleName);
    $('#createPanel').attr('style', 'display:block;');
    $('#promptPanel').attr('style', 'display:none;');
    $('#crosswordBody').empty();
    $('#crosswordBody').append(generateGrid());
    setupHandlers();
    editMode = 1;

    // populate grid with letters and blacks
    for (var r = 0; r < puzzleSize; r++) {
      for (var c = 0; c < puzzleSize; c++) {
        var cur = $('#' + r + '-' + c);
        if (puzzleInfo[r][c] == '*') {
          $(cur).addClass('black');
        } else if (!readOnly) {
          $(cur).find('.cellValue').text(puzzleInfo[r][c]);
        }
      }
    }

    // number cells now that the blacks are in place
    numberCells();

  // add clues now that inputs are in place
  $('.clueInput').each(function(index) {
    $(this).val(puzzleClues[$(this).attr('id')]);
    if (readOnly) {
      $(this).attr('disabled', 'true');
    }
  });

  // start in letter mode so we dont accidentally add blacks
  setLetters();
  if (readOnly) {
    $('#puzzleTitleValue').attr('disabled', 'true');
    $( "#editPanel" ).attr('style', 'display:none;');
    $( "#blacksPanel" ).attr('style', 'display:none;');
    $( "#blackWarning" ).attr('style', 'display:none;');
    $( "#solvePanel" ).attr('style', 'display: block');
    $( "#checkPanel" ).attr('style', 'display: block');
  } else {
    $('#puzzleTitleValue').removeAttr('disabled');
    $( "#editPanel" ).attr('style', 'display: block;');
    $( "#blacksPanel" ).attr('style', 'display: block;');
    $( "#blackWarning" ).attr('style', 'display: block;');
    $( "#solvePanel" ).attr('style', 'display: none');
    $( "#checkPanel" ).attr('style', 'display: none');
  }

}

function setLoadType() {
  // if readOnly is true, hide certain buttons and don't add the
}
