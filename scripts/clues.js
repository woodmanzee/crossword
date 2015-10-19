var highlightedClueInput;

function trackClueClick() {
  $("input.clueInput").click(function(evt) {
    removePreviousClueHighlighting();
  });
}

function trackClueSolveClick() {
  $("li").click(function(evt) {
    removePreviousClueSolveHighlighting();
  });
}

/*function highlightClueFromInputs() {
  $("input.clueInput").click(function(evt) {
    removePreviousClueHighlighting();
    highlightedClueInput = $('#' + $(this).attr('id'));
    console.log(highlightedClueInput.attr('id'));
    highlightedClueInput.addClass('currentClue');
    highlightedClueInput.prev().addClass('currentClue');
    if (readOnly) {
      $('#' + highlightedClueInput.attr('relsquare')).trigger('click');
    } else {
    //  $('#' + curClueClick.parent().attr('relsquare')).addClass('edit');
      doSelect($('#' + highlightedClueInput.parent().attr('relsquare')));
    }
  });
}*/

function highlightClueFromGrid(number) {
  removePreviousClueHighlighting();
  if (gridDirection == 1) {
    highlightedClueInput = $('#across' + number);
    $('#across' + number).addClass('active');
    $('#across' + number).children('span').addClass('active');

    // scroll to see clue
    var scrollVal = highlightedClueInput.attr('num') * 40;
    console.log('scroll: ' + scrollVal);
    $('#acrossClues').scrollTop(scrollVal);
  } else {
    highlightedClueInput = $('#down' + number);
    $('#down' + number).addClass('active');
    $('#down' + number).children('span').addClass('active');

    // scroll to see clue
    var scrollVal = highlightedClueInput.attr('num') * 40;
    $('#downClues').scrollTop(scrollVal);
  }
}

function removePreviousClueSolveHighlighting() {
    $(highlightedClueInput).removeClass('active');
}

function removePreviousClueHighlighting() {
    $(highlightedClueInput).removeClass('active');
    $(highlightedClueInput).children().removeClass('active');
}
