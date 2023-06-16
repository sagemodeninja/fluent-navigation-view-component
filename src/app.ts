import '/public/css/style.css';
import '/public/fonts/segoe-fluent-icons/segoe-fluent-icons.css';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';

import './';
import colorSchemeProvider from '@sagemodeninja/color-scheme-provider';
import { DesignToken } from '@sagemodeninja/design-token-provider';

document.addEventListener('DOMContentLoaded', () => {
    const navigationView = document.querySelector('#navigation_view');
    const toggleTheme = document.getElementById('toggle_theme');

    // Design tokens
    const backgroundFillMicaBase = new DesignToken<string>('background-fill-mica-base');
    const strokeCardDefault = new DesignToken<string>('stroke-card-default');
    const shadowFlyout = new DesignToken<string>('shadow-flyout');
    const fillAccentDefault = new DesignToken<string>('fill-accent-default');
    const fillSubtleSecondary = new DesignToken<string>('fill-subtle-secondary');
    const fillSubtleTertiary = new DesignToken<string>('fill-subtle-tertiary');
    const fillTextPrimary = new DesignToken<string>('fill-text-primary');
    const fillTextSecondary = new DesignToken<string>('fill-text-secondary');
    const backgroundFillLayerDefault = new DesignToken<string>('background-fill-layer-default');

    navigationView.addEventListener('selectionchanged', (event: CustomEvent) => {
        var args = event.detail.args;

        if (args.isSettingsSelected) return;

        window.location.href = args.selectedItem.href;
    });

    const checkUrl = new URL('index.html', window.location.toString());

    if (checkUrl.href !== window.location.href) return;

    const displayModes = document.querySelectorAll(
        'input[name=paneDisplayMode]'
    ) as NodeListOf<HTMLInputElement>;
    const paneTitleIpt = document.querySelector('input[name=paneTitle]') as HTMLInputElement;
    const toggleHeaderBtn = document.querySelector('#toggle_header');
    const toggleSettingsBtn = document.querySelector('#toggle_settings');

    var alwaysShowHeader = true;
    var isSettingsVisible = true;

    // Pane display mode.
    for (const option of displayModes) {
        option.addEventListener('change', () => {
            for (const option of displayModes) {
                if (option.checked) {
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

        toggleSettingsBtn.innerHTML = `Toggle Header: ${isSettingsVisible
            .toString()
            .toUpperCase()}`;
        navigationView.toggleAttribute('is-settings-visible', isSettingsVisible);
    });

    colorSchemeProvider.subscribeNotification(() => {
        const isLight = colorSchemeProvider.colorScheme === 'light';

        document.body.style.colorScheme = isLight ? 'light' : 'dark';
        backgroundFillMicaBase.setDefault(isLight ? '#f3f3f3' : '#202020');
        strokeCardDefault.setDefault(isLight ? '#e5e5e5' : 'rgb(255 255 255 / 8.37%)');
        shadowFlyout.setDefault(isLight ? 'rgb(0 0 0 / 14%)' : 'rgb(0 0 0 / 26%)');
        fillAccentDefault.setDefault(isLight ? '#005FB8' : '#60CDFF');
        fillSubtleSecondary.setDefault(isLight ? 'rgb(0 0 0 / 3.73%)' : 'rgb(255 255 255 / 6.05%)');
        fillSubtleTertiary.setDefault(isLight ? 'rgb(0 0 0 / 2.41%)' : 'rgb(255 255 255 / 4.19%)');
        fillTextPrimary.setDefault(isLight ? 'rgb(0 0 0 / 89.56%)' : '#ffffff');
        fillTextSecondary.setDefault(isLight ? 'rgb(0 0 0 / 60.63%)' : 'rgb(255 255 255 / 78.6%)');
        backgroundFillLayerDefault.setDefault(
            isLight ? 'rgb(255 255 255 / 50%)' : 'rgb(58 58 58 / 30%)'
        );
    });

    toggleTheme.addEventListener('click', () => {
        colorSchemeProvider.toggle();
    });
});
