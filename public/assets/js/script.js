var feedT;
$("#view").on('click', function(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:4000/view',
        data: {},
        crossDomain: true,
        success: function (msg) {
            feedT = JSON.parse(msg);
            console.log(feedT);
            $("#mod").fadeIn(1000);
            buildHtmlTable("#feedTable");
        }
    });
});
$("#download").on('click', function(){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:4000/download',
        data: {},
        crossDomain: true,
        success: function (msg) {
            alert("successful");
        }
    });
});

function buildHtmlTable(selector) {
    var columns = addAllColumnHeaders(feedT, selector);
    for (var i = 0; i < feedT.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = feedT[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}
// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(feedT, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0; i < feedT.length; i++) {
        var rowHash = feedT[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(selector).append(headerTr$);
    return columnSet;
}

$(".close").on('click',function(){
    $("#mod").fadeOut(300);
});
