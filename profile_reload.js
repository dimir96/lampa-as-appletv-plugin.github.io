(function () {

    var current = null;

    function check() {
        try {
            var raw = localStorage.getItem('account_user');
            if (!raw) return;
            var val = JSON.parse(raw).profile;
            if (val === undefined) return;
            var id = String(val);
            if (current === null) { current = id; return; }
            if (current !== id) window.location.reload();
        } catch (e) {}
    }

    setInterval(check, 500);

})();
