
document.addEventListener('DOMContentLoaded', e => {
    const navigationView = document.querySelector('#navigation_view');
    
    navigationView.addEventListener('selectionchanged', e => {
        var args = e.detail.args;

        if(args.isSettingsSelected)
            return;
        
        window.location.href = args.selectedItem.href;
    });

    const checkUrl = new URL("index.html", window.location);
    if(checkUrl.href !== window.location.href)
        return;

    const displayModes = document.querySelectorAll('input[name=paneDisplayMode');
    const paneTitleIpt = document.querySelector('input[name=paneTitle]');
    const toggleHeaderBtn = document.querySelector('#toggle_header');
    const toggleSettingsBtn = document.querySelector('#toggle_settings');
    
    var alwaysShowHeader = true;
    var isSettingsVisible = true;

    // Pane display mode.
    for (const option of displayModes)
    {
        option.addEventListener('change', () => {
            for (const option of displayModes)
            {
                if(option.checked)
                {
                    navigationView.setAttribute('pane-display-mode', option.value);
                    break;
                }
            }
        });
    }

    paneTitleIpt.addEventListener('input', () => {
        navigationView.setAttribute('pane-title', paneTitleIpt.value);
    });

    toggleHeaderBtn.addEventListener('click', () => {
        alwaysShowHeader = !alwaysShowHeader;

        toggleHeaderBtn.innerHTML = `Toggle Header: ${alwaysShowHeader.toString().toUpperCase()}`;
        navigationView.toggleAttribute('always-show-header', alwaysShowHeader);
    });

    toggleSettingsBtn.addEventListener('click', () => {
        isSettingsVisible = !isSettingsVisible;

        toggleSettingsBtn.innerHTML = `Toggle Header: ${isSettingsVisible.toString().toUpperCase()}`;
        navigationView.toggleAttribute('is-settings-visible', isSettingsVisible);
    });
});