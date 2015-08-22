var currentCellFocus;
var cellDirection = 1;
var editMode = 2;
var cellHtml = '<div class="cellSquare"><div class="cellNumber"></div><div class="cellValue"></div></div>';
var inputHtml = '<input class="answerInput form-control" type="text">';
var gridSize;

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

function doSelect(newCell) {
    // clear existing focus color if one exists
    if (currentCellFocus != null) {
      $(currentCellFocus).removeClass('edit');
    }

    currentCellFocus = newCell;
    $(newCell).addClass('edit');

    var curRow = parseInt($(currentCellFocus).attr('row'), 10);
    var curCol = parseInt($(currentCellFocus).attr('col'), 10);
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

function clearBlacks() {
  for (var r = 0; r < gridSize; ++r) {
    for (var c = 0; c < gridSize; ++c) {
      // get cell info
      var currentCell = $('#' + r + '-' + c);
      currentCell.removeClass('black');
    }
  }
  numberCells();
}

function setBlacks() {
    editMode = 2;
    $( "#setBlacks" ).addClass('active');
    $( "#setLetters" ).removeClass('active');

    $(currentCellFocus).removeClass('edit');
    currentCellFocus = null;
    clearRowHighlight();
}

function setLetters() {
    editMode = 1;
    $( "#setLetters" ).addClass('active');
    $( "#setBlacks" ).removeClass('active');
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
        $('#acrossClues').append('<div class="input-group"><span class="input-group-addon" id="basic-addon1">' + count + '</span> <input type="text" class="form-control" placeholder="Across clue" aria-describedby="basic-addon1"></div>');
    } else {
        $('#downClues').append('<div class="input-group"><span class="input-group-addon" id="basic-addon1">' + count + '</span> <input type="text" class="form-control" placeholder="Down clue" aria-describedby="basic-addon1"></div>');
    }
}

function trackKeypress() {
  $(window).keypress(function(e) {
       var ev = e || window.event;
       var key = ev.keyCode || ev.which;
       var letter = String.fromCharCode(key);
       //do stuff with "key" here...
       if (currentCellFocus != null) {
         $(currentCellFocus).find('.cellValue').text(letter);
         getNextCell();
       }
   });
}

function trackLeaveGrid() {
  $( "#clues" ).click(function() {
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

function getNextCell() {
  var curRow = parseInt($(currentCellFocus).attr('row'), 10);
  var curCol = parseInt($(currentCellFocus).attr('col'), 10);

  if (cellDirection == 1) {
    var nextCell = $('#' + curRow + '-' + (curCol + 1));
    if (curCol != (gridSize - 1) && !nextCell.hasClass('black')) {
      doSelect(nextCell);
    }
  } else {
    var nextCell = $('#' + (curRow + 1) + '-' + curCol);
    if (curRow != (gridSize - 1) && !nextCell.hasClass('black')) {
      doSelect(nextCell);
    }
  }
}

//var grid = generateGrid();

$( document ).ready(function() {
  $('#createPanel').attr('style', 'display:none;');
  //$('#crosswordBody').append(grid);
});

function setGridSize() {
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
}

function saveCrossword() {
  saveFile(gridSize);
}
