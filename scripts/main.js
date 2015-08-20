var currentCellFocus;
var nextCellFocus;
var cellDirection = 1;
var editMode = 2;
var cellHtml = '<div class="cellSquare"><div class="cellNumber"></div><div class="cellValue"></div></div>';
var inputHtml = '<input class="answerInput" type="text">';

function generateGrid() {
  var i = 0;
  var grid = document.createElement('table');
  grid.className = 'grid';

  for (var r = 0; r < 15; ++r) {
    var tableRow = grid.appendChild(document.createElement('tr'));
    for (var c = 0; c < 15; ++c) {
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
        if ($(this).get(0) === $(currentCellFocus).get(0)) {
          cellDirection = cellDirection == 1 ? 2 : 1;
        }
        doSelect(this);
    } else if (editMode == 2) {
        $(this).toggleClass('black');
        var matchingCellLocation = (14 - this.getAttribute('row')) + '-' + (14 - this.getAttribute('col'));
        if ($(this).get(0) !== $('#' + matchingCellLocation).get(0)) {
          $('#' + matchingCellLocation).toggleClass('black');
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

    // clear existing pointer color if one exists
    if (nextCellFocus != null) {
      $(nextCellFocus).removeClass('point');
    }

    currentCellFocus = newCell;
    $(newCell).addClass('edit');

    var curRow = parseInt($(currentCellFocus).attr('row'), 10);
    var curCol = parseInt($(currentCellFocus).attr('col'), 10);
    if (cellDirection == 1) {
      var nextCell = $('#' + curRow + '-' + (curCol + 1));
      if (curCol != 14 && !nextCell.hasClass('black')) {
        $(nextCell).addClass('point');
        nextCellFocus = nextCell;
      }
    } else {
      var nextCell = $('#' + (curRow + 1) + '-' + curCol);
      if (curRow != 14 && !nextCell.hasClass('black')) {
        $(nextCell).addClass('point');
        nextCellFocus = nextCell;
      }
    }
}

function clearBlacks() {
  for (var r = 0; r < 15; ++r) {
    for (var c = 0; c < 15; ++c) {
      // get cell info
      var currentCell = $('#' + r + '-' + c);
      currentCell.removeClass('black');
    }
  }
  numberCells();
}

function setBlacks() {
    editMode = 2;
    $( "#setBlacks" ).addClass('editMode');
    $( "#setLetters" ).removeClass('editMode');

    $(nextCellFocus).removeClass('point');
    nextCellFocus = null;
    $(currentCellFocus).removeClass('edit');
    currentCellFocus = null;
}

function setLetters() {
    editMode = 1;
    $( "#setLetters" ).addClass('editMode');
    $( "#setBlacks" ).removeClass('editMode');
}

function numberCells() {
  counter = 1;
  $('#acrossClues').empty();
  $('#downClues').empty();
  for (var r = 0; r < 15; ++r) {
    for (var c = 0; c < 15; ++c) {
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
        $('#acrossClues').append('<div class="inputRow">' + count + inputHtml + '</div>');
    } else {
        $('#downClues').append('<div class="inputRow">' + count + inputHtml + '</div>');
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
    $(nextCellFocus).removeClass('point');
    nextCellFocus = null;
    $(currentCellFocus).removeClass('edit');
    currentCellFocus = null;
  });
}

function getNextCell() {
  var curRow = parseInt($(currentCellFocus).attr('row'), 10);
  var curCol = parseInt($(currentCellFocus).attr('col'), 10);

  if (cellDirection == 1) {
    var nextCell = $('#' + curRow + '-' + (curCol + 1));
    if (curCol != 14 && !nextCell.hasClass('black')) {
      doSelect(nextCell);
    }
  } else {
    var nextCell = $('#' + (curRow + 1) + '-' + curCol);
    if (curRow != 14 && !nextCell.hasClass('black')) {
      doSelect(nextCell);
    }
  }
}

var grid = generateGrid();

$( document ).ready(function() {
  $('#crosswordBody').append(grid);
  setupHandlers();
  numberCells();
});