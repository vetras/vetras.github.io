window.onload = function(e) {
    var msPerDay = 24*60*60*1000; 
    var firstDate = new Date();
    var secondDate = new Date(2016,10,13);
    var diffDays = Math.round(Math.abs((secondDate.getTime() - firstDate.getTime())/(msPerDay)));
    document.getElementById('numberOfDays').innerHTML  = diffDays;
};
