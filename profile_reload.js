(function () {

    var current = null;

    var _orig = Lampa.Storage.set.bind(Lampa.Storage);
    Lampa.Storage.set = function (key, val) {
        if (key === 'account') {
            try {
                var id = String(JSON.parse(val).profile || '');
                if (current === null) { current = id; }
                else if (current !== id) { window.location.reload(); }
            } catch (e) {}
        }
        return _orig(key, val);
    };

    // запомнить текущий профиль при старте
    try {
        var init = Lampa.Storage.get('account', '');
        if (init) current = String(JSON.parse(init).profile || '');
    } catch (e) {}

})();
