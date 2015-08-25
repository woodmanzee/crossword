var currentCellFocus;   // currently highlighted square
var cellDirection = 1;  // 1 for horizontal answer, 2 for vertical
var editMode = 2;       // 2 for writing black squares, 1 for writing letter
var cellHtml = '<div class="cellSquare"><div class="cellNumber"></div><div class="cellValue"></div></div>';
var gridSize;           // dimensions of the grid. 5 = a 5x5 grid

function onCellClick() {
  $( "td" ).click(function() {
    if (editMode == 1) {
        // if clicking a black cell, don't do anything
        if (!$(this).hasClass('black')) {
          if ($(this).get(0) === $(currentCellFocus).get(0)) {
            cellDirection = cellDirection == 1 ? 2 : 1;
          }
          clearRowHighlight();
          doSelect(this);
        }
    } else if (editMode == 2) {
        $(this).toggleClass('black');
        $(this).find('.cellValue').text('');
        var matchingCellLocation = ((gridSize - 1) - this.getAttribute('row')) + '-' + ((gridSize - 1) - this.getAttribute('col'));
        if ($(this).get(0) !== $('#' + matchingCellLocation).get(0)) {
          $('#' + matchingCellLocation).toggleClass('black');
          $('#' + matchingCellLocation).find('.cellValue').text('');
        }
        numberCells();
    }
  });
}

function highlightFocusCell(newCell) {
    if (currentCellFocus != null) {
      $(currentCellFocus).removeClass('edit');
    }
    currentCellFocus = newCell;
    $(newCell).addClass('edit');
}

function highlightFocusRow(newCell) {

    var curRow = parseInt($(currentCellFocus).attr('row'), 10);
    var curCol = parseInt($(currentCellFocus).attr('col'), 10);

    $(newCell).addClass('point');

    if (cellDirection == 1) {
      // iterate to the right and highlight
      for (var i = 1; i < gridSize; i++) {
        var nextCell = $('#' + curRow + '-' + (curCol + i));
        if ($(nextCell).hasClass('black')) {
          break;
        }
        if (curCol != (gridSize - 1) && !nextCell.hasClass('black')) {
          $(nextCell).addClass('point');
        }
      }
      // iterate to the left and highlight
      for (var i = 1; i < gridSize; i++) {
        var nextCell = $('#' + curRow + '-' + (curCol - i));
        if ($(nextCell).hasClass('black')) {
          break;
        }
        if (curCol != 0 && !nextCell.hasClass('black')) {
          $(nextCell).addClass('point');
        }
      }
    } else {
      // iterate down and highlight
      for (var i = 1; i < gridSize; i++) {
        var nextCell = $('#' + (curRow + i) + '-' + curCol);
        if ($(nextCell).hasClass('black')) {
          break;
        }
        if (curRow != (gridSize - 1) && !nextCell.hasClass('black')) {
          $(nextCell).addClass('point');
        }
      }
      // iterate up and highlight
      for (var i = 1; i < gridSize; i++) {
        var nextCell = $('#' + (curRow - i) + '-' + curCol);
        if ($(nextCell).hasClass('black')) {
          break;
        }
        if (curRow != 0 && !nextCell.hasClass('black')) {
          $(nextCell).addClass('point');
        }
      }
    }
}

function doSelect(newCell) {
    // clear existing focus color if one exists
    highlightFocusCell(newCell);
    highlightFocusRow(newCell);
}

function numberCells() {
  counter = 1;
  $('#acrossClues').empty();
  $('#downClues').empty();
  for (var r = 0; r < gridSize; ++r) {
    for (var c = 0; c < gridSize; ++c) {
      // get cell info
      var currentCell = $('#' + r + '-' + c);
      currentCell.find('.cellNumber').text('');
      isBlack = currentCell.hasClass('black');
      var hasNumber = false;

      if (isBlack) {
        continue;
      }

      if (isLeftInvalid(r, c)) {
        currentCell.find('.cellNumber').text(counter);
        generateAnswerInput('across', counter);
        hasNumber = true;
      }

      if (isTopInvalid(r, c)) {
        generateAnswerInput('down', counter);
        if (!hasNumber) {
          currentCell.find('.cellNumber').text(counter);
          hasNumber = true;
        }
      }

      if (hasNumber) {
        counter++;
      }
    }
  }
}

function isLeftInvalid(r, c) {
    var leftCellIsBlack = $('#' + r + '-' + (c-1)).hasClass('black');
    if (leftCellIsBlack || c == 0) {
      return true;
    }
    return false;
}

function isTopInvalid(r, c) {
    var topCellIsBlack = $('#' + (r-1) + '-' + c).hasClass('black');
    if (topCellIsBlack || r == 0) {
      return true;
    }
    return false;
}

function generateAnswerInput(type, count) {
    if (type == 'across') {
        $('#acrossClues').append('<div class="input-group"><span class="input-group-addon" id="basic-addon1">' + count + '</span> <input id="across' + count + '" type="text" class="form-control clueInput" placeholder="Across clue" aria-describedby="basic-addon1"></div>');
    } else {
        $('#downClues').append('<div class="input-group"><span class="input-group-addon" id="basic-addon1">' + count + '</span> <input id="down' + count + '" type="text" class="form-control clueInput" placeholder="Down clue" aria-describedby="basic-addon1"></div>');
    }
}

function trackKeypress() {
  $(window).keyup(function(e) {
       var ev = e || window.event;
       var key = ev.keyCode || ev.which;
       var letter = String.fromCharCode(key);
       //do stuff with "key" here...
       if (currentCellFocus != null) {
         if (key == 8) {
           e.preventDefault();
           $(currentCellFocus).find('.cellValue').text('');
           getNextCell(-1);
         } else if (key == 38) {   // up
           navigateGrid(2, -1, e);
         } else if (key == 39) {   // right
           navigateGrid(1, 1, e);
         } else if (key == 40) {   // down
           navigateGrid(2, 1, e);
         } else if (key == 37) {   // left
           navigateGrid(1, -1, e);
         } else {
           $(currentCellFocus).find('.cellValue').text(letter);
           getNextCell(1);
         }

       }
   });
}

function navigateGrid(desiredDirection, desiredAmount, event) {
    event.preventDefault();
    if (cellDirection == desiredDirection) {
     getNextCell(desiredAmount);
    } else {
     cellDirection = desiredDirection;
     clearRowHighlight();
     highlightFocusRow(currentCellFocus);
    }
}

function getNextCell(direction) {
  var curRow = parseInt($(currentCellFocus).attr('row'), 10);
  var curCol = parseInt($(currentCellFocus).attr('col'), 10);

  // EDGE CASES
  // max column, direction + 1, cellDirection = 1
  // min column, direction - 1, cellDirection = 1
  // max row, direction + 1, cellDirection = 2
  // min row, direction - 1, cellDirection == 2

  if (
    (curCol == (gridSize - 1) && (direction == 1) && cellDirection == 1) ||
    (curCol == 0 && (direction == -1) && cellDirection == 1) ||
    (curRow == (gridSize - 1) && (direction == 1) && cellDirection == 2) ||
    (curRow == 0 && (direction == -1) && cellDirection == 2)
  ) {
    // if we're on an edge and we're going to go off it, go nowhere
  } else {
      var targetCell = (cellDirection == 1) ? $('#' + curRow + '-' + (curCol + direction)) : $('#' + (curRow + direction) + '-' + curCol);
      if (!targetCell.hasClass('black')) {
        highlightFocusCell(targetCell);
      }
  }
}

function trackLeaveGrid() {
  $( "#clues" ).click(function() {
    $(currentCellFocus).removeClass('edit');
    currentCellFocus = null;
    clearRowHighlight();
  });
  $( "#puzzleTitleValue" ).click(function() {
    $(currentCellFocus).removeClass('edit');
    currentCellFocus = null;
    clearRowHighlight();
  });
}

function clearRowHighlight() {
    // clear existing row highlight if one exists
    for (var r = 0; r < gridSize; r++) {
      for (var c = 0; c < gridSize; c++) {
        $('#' + r + '-' + c).removeClass('point');
      }
    }
}

function onNewClick() {
  if (gridSize != null) {
    if (confirm("Are you sure you want to delete your puzzle and start a new one?")) {
      newPuzzle();
    }
    return false;
  } else {
    newPuzzle();
  }
}

function newPuzzle() {
    var gridInput = parseInt($('#gridSizePicklist').find(":selected").text(), 10);
    if (gridInput >= 5 && gridInput <= 30) {
      gridSize = gridInput;
      $('#createPanel').attr('style', 'display:block;');
      $('#promptPanel').attr('style', 'display:none;');
      $('#crosswordBody').empty();
      $('#crosswordBody').append(generateGrid());
      setupHandlers();
      numberCells();
    }
    $('#puzzleTitleValue').removeAttr('disabled');
    $('#puzzleTitleValue').val('');
    $( "#editPanel" ).attr('style', 'display: block;');
    $( "#blacksPanel" ).attr('style', 'display: block;');
    $( "#blackWarning" ).attr('style', 'display: block;');
    $( "#solvePanel" ).attr('style', 'display: none');
    $( "#checkPanel" ).attr('style', 'display: none');
    exitHelp();
}

function generateGrid() {
  var i = 0;
  var grid = document.createElement('table');
  grid.className = 'grid';

  for (var r = 0; r < gridSize; ++r) {
    var tableRow = grid.appendChild(document.createElement('tr'));
    for (var c = 0; c < gridSize; ++c) {
      var cell = tableRow.appendChild(document.createElement('td'));
      cell.id = r + '-' + c;
      cell.setAttribute("row", r);
      cell.setAttribute("col", c);
      cell.innerHTML = cellHtml;
    }
  }
  return grid;
}

function setupHandlers() {
    setBlacks();
    onCellClick();
    trackKeypress();
    trackLeaveGrid();
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1 || ([32].indexOf(e.keyCode) > -1 && currentCellFocus != null)) {
        e.preventDefault();
    }
}, false);

function puzzleDone() {

}

$( document ).ready(function() {
  $('#createPanel').attr('style', 'display:none;');
  //$('#crosswordBody').append(grid);
});

// ******************** BUTTONS *************************

function saveCrossword() {
  saveFile(gridSize);
}

function clearBlacks() {
  if (confirm("Are you sure? Clearing all black squares will delete ANY AND ALL written clues.")) {
      for (var r = 0; r < gridSize; ++r) {
        for (var c = 0; c < gridSize; ++c) {
          // get cell info
          var currentCell = $('#' + r + '-' + c);
          currentCell.removeClass('black');
        }
      }
      numberCells();
    }
    return false;
}

function lockBlacks() {
  setLetters();
    $( "#setBlacks" ).attr('style', 'display:none;');
    $( "#lockBlacks" ).attr('style', 'display:none;');
    $( "#clearBlacks" ).attr('style', 'display:none;');
    $( "#unlockBlacks" ).attr('style', 'display:inline-block;');
}

function unlockBlacks() {
    $( "#setBlacks" ).attr('style', 'display:inline-block;');
    $( "#lockBlacks" ).attr('style', 'display:inline-block;');
    $( "#clearBlacks" ).attr('style', 'display:inline-block;');
    $( "#unlockBlacks" ).attr('style', 'display:none;');
}

function setBlacks() {
    editMode = 2;
    $('#blackWarning').attr('style', 'display: block;')
    $( "#setBlacks" ).addClass('active');
    $( "#setLetters" ).removeClass('active');

    $(currentCellFocus).removeClass('edit');
    currentCellFocus = null;
    clearRowHighlight();
}

function setLetters() {
    editMode = 1;
    $('#blackWarning').attr('style', 'display: none;')
    $( "#setLetters" ).addClass('active');
    $( "#setBlacks" ).removeClass('active');
}

function help() {
  $('#createPanel').attr('style', 'display: none;');
  $('#helpButton').attr('style', 'display: none;');
  $('#exitHelpButton').attr('style', 'display: inline-block;');
  $('#helpPanel').attr('style', 'display: block;');
}

function exitHelp() {
  if (gridSize != null) {
    $('#createPanel').attr('style', 'display: block;');
  }
  $('#helpButton').attr('style', 'display: inline-block;');
  $('#exitHelpButton').attr('style', 'display: none;');
  $('#helpPanel').attr('style', 'display: none;');
}

function checkLetter() {

}

function checkWord() {

}

function checkPuzzle() {

}

function revealLetter() {

  var curRow = parseInt($(currentCellFocus).attr('row'), 10);
  var curCol = parseInt($(currentCellFocus).attr('col'), 10);

  $(currentCellFocus).find('.cellValue').text(loadedGrid[curRow][curCol]);
}

function revealWord() {

}

function revealPuzzle() {
  for (var r = 0; r < gridSize; r++) {
    for (var c = 0; c < gridSize; c++) {
      if (loadedGrid[r][c] != '*') {
        $('#' + r + '-' + c).find('.cellValue').text(loadedGrid[r][c]);
      }
    }
  }
  puzzleDone();
}
