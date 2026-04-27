(function () {
    var current = Lampa.Storage.get('account', {}).profile.id;
    var orig = Lampa.Storage.set.bind(Lampa.Storage);
    Lampa.Storage.set = function (key, val) {
        if (key === 'account' && val.profile.id !== current) window.location.reload();
        return orig(key, val);
    };
})();
 
