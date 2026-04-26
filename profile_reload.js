(function () {

    var currentProfile = null;

    function onProfileChange(id) {
        id = String(id === undefined || id === null ? '' : id);
        if (currentProfile === null) { currentProfile = id; return; }
        if (currentProfile !== id) { window.location.reload(); }
    }

    // 1) profiles.js plugin (levende/lampa-plugins)
    Lampa.Listener.follow('profile', function (e) {
        if (e.type === 'changed') onProfileChange(e.profileId);
    });

    // 2) built-in CUB account change
    Lampa.Listener.follow('account', function (e) {
        if (e.type === 'change' || e.type === 'changed') {
            onProfileChange(e.uid || e.hash || e.id);
        }
    });

    // 3) fallback: watch Storage key that profiles.js writes on select
    var lastStored = null;
    setInterval(function () {
        try {
            var v = String(Lampa.Storage.get('profile_id', '') || '');
            if (lastStored === null) { lastStored = v; return; }
            if (lastStored !== v) { window.location.reload(); }
        } catch (err) {}
    }, 1000);

})();
