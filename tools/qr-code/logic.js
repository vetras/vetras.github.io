var MODULE_SIZE = 8; 
var QUIET_ZONE = 4;  

function drawQrCode(canvas, text) {
    // 0 = pick the smallest version that fits
    var qr = qrcode(0, 'M'); 
    qr.addData(text, 'Byte');
    qr.make();

    var count = qr.getModuleCount();
    var size = (count + QUIET_ZONE * 2) * MODULE_SIZE;
    canvas.width = size;
    canvas.height = size;

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';

    for (var row = 0; row < count; row++) {
        for (var col = 0; col < count; col++) {
            if (qr.isDark(row, col)) {
                ctx.fillRect((col + QUIET_ZONE) * MODULE_SIZE, (row + QUIET_ZONE) * MODULE_SIZE, MODULE_SIZE, MODULE_SIZE);
            }
        }
    }
}

window.onload = function () {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

    var form = document.getElementById('qr-form');
    var input = document.getElementById('qr-text');
    var canvas = document.getElementById('qr-canvas');
    var message = document.getElementById('qr-message');
    var clear = document.getElementById('qr-clear');

    input.addEventListener('input', function () {
        clear.hidden = !input.value;
    });

    clear.addEventListener('click', function () {
        input.value = '';
        clear.hidden = true;
        message.textContent = '';
        canvas.hidden = true;
        input.focus();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        message.textContent = '';
        canvas.hidden = true;

        var text = input.value;
        if (!text.trim()) {
            message.textContent = 'Type some text first.';
            return;
        }

        try {
            drawQrCode(canvas, text);
            canvas.setAttribute('aria-label', 'QR code for: ' + text);
            canvas.hidden = false;
        } catch (err) {
            message.textContent = 'That text is too long for a QR code.';
        }
    });
};
