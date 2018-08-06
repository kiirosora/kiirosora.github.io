console.log('test');

$(function() {
  console.log('jQuery');
  var $content = $('#content');
  var $dropzone = $('#dropzone');
  var $panelContainer = $('#panel-container');
  var $rawDataContainerTbody = $('#raw-data-container').find('tbody');
  var $resultsTime = $('#result-time');
  var $resultsNumber = $('#result-number');
  var $resultsCopy = $('#result-copy');
  var $resultsClipboard = $('#result-clipboard');
  var settings = {};
  settings.roundMinutes = 5;
  var tickets = {};
  
  
  /* Jquery Events */
  
  $resultsClipboard.tooltip({
    animation: true,
    placement: 'top'
  }).tooltip('disable');
  
  $content.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    $dropzone.addClass('hover');
  })
  .on('dragend dragleave drop', function() {
    $dropzone.removeClass('hover')
    // if ($panelContainer.is(':visible')) $dropzone.removeClass('hover-fixed');
  })
  .on('drop', getFiles);
  
  $('#settings-form').on('submit', function(e) {
    e.preventDefault();
    calculate();
  });
  
  $('#settings-button').on('click', function(e) {
    e.preventDefault();
    $('#settings').slideToggle();
  });
  
  $resultsClipboard.on('click', function(e) {
    e.preventDefault();
    
    selectAllText($resultsCopy[0]);
    document.execCommand("copy");
    
    $resultsClipboard.tooltip('enable').tooltip('show');
    setTimeout(function() {
      $resultsClipboard.tooltip('hide')
      $resultsClipboard.tooltip('disable');
    }, 1500);
  });
  
  
  
  /* Core Functions */
  
  function getFiles(e) {
    if (isAdvancedUpload) {
      var droppedFiles = e.originalEvent.dataTransfer.files;
      var reader = new FileReader();
      var ctr = 0;
      
      reader.onload = function(ev) {
        var result = ev.target.result.replace(/","/gim, '|,,|');
        var lines = result.split("\n");
        
        for (var line = 1; line < lines.length - 1; line++) {
          var ticketLog = new TicketLog(lines[line]);
          
          if (ticketLog.id in tickets) {
            tickets[ticketLog.id].addMinutes(ticketLog.minutes);
          }
          else {
            tickets[ticketLog.id] = new Ticket(ticketLog.id, ticketLog.date);
            tickets[ticketLog.id].addMinutes(ticketLog.minutes);
          }
          
          createDomRawData(ticketLog);
        }
        
        if (++ctr < droppedFiles.length) reader.readAsText(droppedFiles[ctr]);
        else calculate();
      }
      
      if (droppedFiles.length) {
        tickets = {};
        
        reader.readAsText(droppedFiles[0]);
        
        $rawDataContainerTbody.empty();
      }
    }
  }
  
  function calculate() {
    if (!$.isEmptyObject(tickets)) {
      // Update settings for calculation
      settings.roundMinutes = parseInt($('#settings-roundminutes').val());
      
      $resultsTime.html(getTotalHours() + ' hour(s)');
      $resultsNumber.html(getTotalTickets());

      createDomResultCopy();

      $dropzone.fadeOut({
        complete: function() {
          $(this).addClass('hover-fixed');
        }
      });

      $panelContainer.fadeIn();

      selectAllText($resultsCopy[0]);
    }
  }
  
  function convertToHours(minutes) { // Function to convert minutes to hours rounded up by the roundMinutes setting
    var
    hours = minutes / 60,
    totalHours = 0;
    
    totalHours = Math.ceil(hours / (settings.roundMinutes / 60)) * (settings.roundMinutes / 60);
    
    return round(totalHours, 2); // Round to 2 decimal points
    // return totalHours;
  }
  
  function getTotalMinutes() { // Function to get the grand total minutes from all the tickets
    var total = 0;
    
    if (!$.isEmptyObject(tickets)) {
      for (id in tickets) {
        total += tickets[id].getTotalMinutes();
      }
    }
    
    return total;
  }
  
  function getTotalHours() { // Function to get the grand total hours from all the tickets
    var total = 0;
    
    if (!$.isEmptyObject(tickets)) {
      for (id in tickets) {
        total += convertToHours(tickets[id].getTotalMinutes());
      }
    }
    
    return total;
  }
  
  function getTotalTickets() { // Function to get the grand total number of tickets
    var total = 0;
    
    if (!$.isEmptyObject(tickets)) {
      for (id in tickets) total++
    }
    
    return total;
  }
  
  function createDomRawData(ticketLog) {
    var $row = $('<tr>');
    
    $row.append('<td>' + ticketLog.date + '</td>');
    $row.append('<td>' + ticketLog.id + '</td>');
    $row.append('<td>' + ticketLog.minutes + '</td>');
    
    $row.appendTo($rawDataContainerTbody);
  }
  
  function createDomResultCopy() {
    
    if (!$.isEmptyObject(tickets)) {
      $resultsCopy.empty();
      for (id in tickets) {
        var ticket = tickets[id];
        
        $resultsCopy.append(ticket.id + " (" + ticket.getTotalMinutes() + " minutes) - " + convertToHours(ticket.getTotalMinutes()) + "<br>");
      }
    }
  }

  /* Helper Functions */
  
  function selectAllText(element) {
    var range = document.createRange();
    
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
});

/* Class - TicketLog */
class TicketLog {
  constructor(line) {
    this.lineString = line.substr(1, line.length - 2);
    this.lineArray = this.lineString.split("|,,|");
    this.id = 1 * this.lineArray[2];
    this.date = this.lineArray[0];
    this.subject = this.lineArray[3];
    this.minutes = 1 * this.lineArray[4];
  }
}


/* Class - Ticket */
class Ticket {
  constructor(id, date) {
    this.id = id;
    this.date = date;
    this.minutes = [];
  }
  
  addMinutes(minute) {
    this.minutes.push(minute);
    return true;
  }
  
  getTotalMinutes() {
    return this.minutes.reduce((a, b) => a + b, 0);
  }
}


/* Helper Functions */
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();