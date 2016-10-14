

function timeDifference(date, olderDate) {

    //var msPerDay = 1000 * 60 * 60 * 24;

    var date_ms = date.getTime();
    var olderDate_ms = olderDate.getTime();

    var temp = date_ms - olderDate_ms;
    temp = temp / 1000;
    var seconds = Math.floor(temp % 60);

    temp = temp / 60;
    var minutes = Math.floor(temp % 60);

    temp = temp / 60;
    var hours = Math.floor(temp % 24);

    var days = Math.floor(temp / 24);

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

function pad(n) {
    return pad_n(n, 2);
}

function pad_n(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function updateView() {
    var now = new Date();
    var targetDate = new Date(2016, 10, 12);
    var timeDiff = timeDifference(targetDate, now);
    var timeStr = 'Faltam ' + pad(timeDiff.days) + ' Dias ' + pad(timeDiff.hours) + ' : ' + pad(timeDiff.minutes) + ' : ' + pad(timeDiff.seconds);
    
    document.getElementById('timer').innerHTML = timeStr;
}

window.onload = function (e) {
    setInterval(updateView, 1000);
};


