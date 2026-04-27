(function () {

    var current = null;

    function getId(val) {
        try {
            var obj = typeof val === 'string' ? JSON.parse(val) : val;
            var p = obj.profile;
            return String(typeof p === 'object' ? p.id : p);
        } catch (e) { return null; }
    }

    current = getId(Lampa.Storage.get('account', '{}'));

    var _orig = Lampa.Storage.set.bind(Lampa.Storage);
    Lampa.Storage.set = function (key, val) {
        if (key === 'account') {
            var id = getId(val);
            if (id && current && id !== current) { window.location.reload(); }
            else { current = id; }
        }
        return _orig(key, val);
    };

})();
