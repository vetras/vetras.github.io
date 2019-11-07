function timeDifference(date, olderDate) {
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
    var currentYear = now.getFullYear();
    var targetDate = new Date(currentYear, 11 - 1, 12);
    if(targetDate < now) {
        targetDate = new Date(currentYear + 1, 11 - 1, 12);
    }
    var timeDiff = timeDifference(targetDate, now);

    var textStr = 'Faltam ' + pad(timeDiff.days) + ' Dias';
    var timeStr = pad(timeDiff.hours) + ' : ' + pad(timeDiff.minutes) + ' : ' + pad(timeDiff.seconds);

    document.getElementsByClassName('text1')[0].innerHTML  = textStr;
    document.getElementsByClassName('text2')[0].innerHTML  = 'E';
    document.getElementsByClassName('text3')[0].innerHTML = timeStr;
}

window.onload = function (e) {
    setInterval(updateView, 1000);
};