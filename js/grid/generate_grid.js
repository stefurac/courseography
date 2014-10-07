/**
 * Generates the duplex timetable grid.
 */
function generateGrid() {
    'use strict';

    var rowDiv = $('<div></div>').addClass('row');
    var timetableContainerDivFall = createTimeTableContainer();
    var timetableContainerDivSpring = createTimeTableContainer();
    var timetableTableFall = createTimeTable('F');
    var fallCaption = $('<caption></caption>').html('Fall');
    var fallThead = $('<thead></thead>');
    var timetableTableSpring = createTimeTable('S');
    var springCaption = $('<caption></caption>').html('Spring');
    var springThead = $('<thead></thead>');

    /* Appends caption elements first to display them above table. */
    timetableTableFall.append(fallCaption)
                      .append(fallThead);
    timetableTableSpring.append(springCaption)
                        .append(springThead);

    appendHeaders(fallThead, springThead);
    appendTableRows(timetableTableFall, timetableTableSpring);

    timetableContainerDivFall.append(timetableTableFall);
    timetableContainerDivSpring.append(timetableTableSpring);

    rowDiv.append(timetableContainerDivFall)
          .append(timetableContainerDivSpring)
          .insertBefore($('#info'));
}


/**
 * Creates a timetable.
 * @param {string} idSuffix The suffix of the ID of the timetable.
 * @returns {jQuery}
 */
function createTimeTable(idSuffix) {
    'use strict';

    return $('<table></table>')
        .addClass('timetable table')
        .attr('id', 'timetable-' + idSuffix);
}


/**
 * Creates and returns a timetable container HTML div element.
 * @returns {jQuery}
 */
function createTimeTableContainer() {
    'use strict';

    return $('<div></div>')
        .addClass('col-md-6 col-xs-12 timetable-container');
}


/**
 * Appends table headers to the timetables.
 * @param {jQuery} fallThead The fall table header.
 * @param {jQuery} springThead The spring table header.
 */
function appendHeaders(fallThead, springThead) {
    'use strict';

    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    fallThead.append($('<th></th>')
        .attr('id', 'no-border')
        .addClass('timetable-time'));

    for (var j = 0; j < 5; j++) {
        fallThead.append($('<th></th>').html(days[j]));
        springThead.append($('<th></th>').html(days[j]));
    }

    springThead.append($('<th></th>')
        .attr('id', 'no-border')
        .addClass('timetable-time'));
}


/**
 * Appends all table rows to the timetables.
 * @param {jQuery} timetableTableFall The fall timetable.
 * @param {jQuery} timetableTableSpring The spring timetable.
 */
function appendTableRows(timetableTableFall, timetableTableSpring) {
    'use strict';

    for (var i = 9; i < 22; i++) {
        var trFall = $('<tr></tr>');
        var trSpring = $('<tr></tr>');
        appendTableData(trFall, trSpring, i);
        timetableTableSpring.append(trSpring);
        timetableTableFall.append(trFall);
    }
}


/**
 * Appends table cells to table rows.
 * @param {jQuery} trFall The fall table row.
 * @param {jQuery} trSpring The spring table row.
 * @param {int} time The table row's time.
 */
function appendTableData(trFall, trSpring, time) {
    'use strict';

    var weekPrefixArray = ["M", "T", "W", "R", "F"];

    var adjustedTime = (time === 12 ? 12 : time % 12) + ':00';
    trFall.append($("<td></td>").addClass("timetable-time").html(adjustedTime));

    for (var k = 0; k < 5; k++) {
        trFall.append($("<td></td>")
            .attr("id", weekPrefixArray[k] + time + "F")
            .attr('in-conflict', 'false')
            .attr("satisfied", "true")
            .addClass("timetable-cell"));
        trSpring.append($("<td></td>")
            .attr("id", weekPrefixArray[k] + time + "S")
            .attr('in-conflict', 'false')
            .attr("satisfied", "true")
            .addClass("timetable-cell"));
    }

    trSpring.append($("<td></td>").addClass("timetable-time").html(adjustedTime));
}