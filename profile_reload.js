(function () {
    window.plugin_reboot_on_profile_change = function () {
        // Подписываемся на событие изменения хранилища (в LAMPA смена профиля триггерит обновление настроек)
        // 'profile' - это ключ, который меняется при переключении аккаунта
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'account_active_id' || e.name === 'profile') {
                // Задержка в 500мс, чтобы приложение успело сохранить все данные нового профиля
                setTimeout(function(){
                    location.reload();
                }, 500);
            }
        });
    };

    // Ожидаем готовности приложения перед запуском плагина
    if (window.appready) {
        window.plugin_reboot_on_profile_change();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                window.plugin_reboot_on_profile_change();
            }
        });
    }
})();
