(function () {
    'use strict';

    /**
     * Плагин: ProfileReload
     * Перезагружает страницу при каждой смене профиля в приложении Lampa.
     *
     * Установка: вставьте ссылку на этот файл в список плагинов Lampa.
     * Совместим со встроенной системой профилей CUB и сторонним плагином profiles.js.
     */

    var PLUGIN_NAME = 'ProfileReload';

    // --- Флаг первого запуска ---
    // Событие 'changed' срабатывает и при первоначальной загрузке приложения.
    // Чтобы не перезагружать страницу сразу при старте, запоминаем
    // первый полученный профиль и реагируем только на последующие смены.
    var initialProfileId = null;
    var initialized = false;

    /**
     * Подписка на события профиля через Lampa.Listener.
     * Канал 'profile' используется сторонним плагином profiles.js (levende/lampa-plugins).
     */
    function listenProfilePlugin() {
        Lampa.Listener.follow('profile', function (event) {
            if (event.type !== 'changed') return;

            var currentId = event.profileId !== undefined ? String(event.profileId) : '__default__';

            if (!initialized) {
                // Первое срабатывание — запоминаем текущий профиль, не перезагружаем
                initialProfileId = currentId;
                initialized = true;
                console.log('[' + PLUGIN_NAME + '] Инициализация, текущий профиль: ' + currentId);
                return;
            }

            if (currentId !== initialProfileId) {
                console.log('[' + PLUGIN_NAME + '] Смена профиля: ' + initialProfileId + ' → ' + currentId + '. Перезагрузка...');
                reloadPage();
            }
        });
    }

    /**
     * Запасной вариант: слежение за встроенным аккаунтом CUB через Lampa.Account.
     * Срабатывает, если сторонний плагин profiles.js не установлен,
     * но пользователь переключает аккаунты через CUB.
     */
    function listenAccountChange() {
        if (!Lampa.Account || typeof Lampa.Account.listener !== 'function') return;

        Lampa.Account.listener().follow('change', function () {
            if (!initialized) {
                initialized = true;
                return;
            }
            console.log('[' + PLUGIN_NAME + '] Смена аккаунта CUB. Перезагрузка...');
            reloadPage();
        });
    }

    /**
     * Перезагрузка страницы с небольшой задержкой,
     * чтобы Lampa успела сохранить данные.
     */
    function reloadPage() {
        setTimeout(function () {
            window.location.reload();
        }, 300);
    }

    /**
     * Точка входа плагина.
     * Ждём готовности Lampa, затем подписываемся на события.
     */
    function init() {
        listenProfilePlugin();
        listenAccountChange();
        console.log('[' + PLUGIN_NAME + '] Плагин загружен. Ожидание смены профиля.');
    }

    // Lampa вызывает window.plugin_* при добавлении через настройки,
    // либо плагин может быть загружен через <script>. Поддерживаем оба варианта.
    if (window.appready) {
        // Приложение уже инициализировано
        init();
    } else {
        // Ждём события готовности приложения
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }

})();
