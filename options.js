var BR = {
    ready: function() {
        var testElement = document.getElementById('test');
        if (!localStorage.test) {
            // set default
            localStorage.test = 1;
        }
        if (testElement) {
            // set value
            testElement.checked = parseInt(localStorage.test, 10);
            testElement.onclick = function() {
                localStorage.test = (this.checked) ? 1 : 0;
            };
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    BR.ready();
});
