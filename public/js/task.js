var time = document.getElementById('stopwatch'),
        start = document.getElementById('start'),
        stop = document.getElementById('stop'),
        clear = document.getElementById('clear'),
        seconds = 0,hours = 0, minutes = 0,
        t;

    function tic() {
        seconds++;
        if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
        }
        time.textContent = String(hours).padStart(2, '0') + ":" 
                            + String(minutes).padStart(2, '0') + ":" 
                            + String(seconds).padStart(2, '0');
        
        timer();
    }
    function timer() {
        t = setTimeout(tic, 1000);
    }
    timer();

    stop.onclick = function() {
        clearTimeout(t);
        //document.getElementById("newTime").value = time.textContent;
    }