import '/public/css/style.css';
import '/public/fonts/segoe-fluent-icons/segoe-fluent-icons.css';
import '/public/fonts/segoe-ui-variable/segoe-ui-variable.css';
import { ComponentRegistry } from '.';
import { 
    FluentNavigationViewContentFrame, 
    FluentNavigationViewHeaderContent, 
    FluentNavigationViewItemHeader 
} from './fluent-content';
import { FluentNavigationView } from './fluent-navigation-view';
import { FluentNavigationViewItem } from './fluent-navigation-view-item';
import { FluentNavigationViewMenuItems } from './fluent-navigation-view-menu-items';

ComponentRegistry.createRegistry()
    .register(
        FluentNavigationView,
        FluentNavigationViewItem,
        FluentNavigationViewMenuItems,
        FluentNavigationViewItemHeader,
        FluentNavigationViewHeaderContent,
        FluentNavigationViewContentFrame
    );

document.addEventListener('DOMContentLoaded', () => {
    const navigationView = document.querySelector('#navigation_view');

    navigationView.addEventListener('selectionchanged', (event: CustomEvent) => {
        var args = event.detail.args;

        if(args.isSettingsSelected)
            return;
        
        window.location.href = args.selectedItem.href;
    });

    const checkUrl = new URL('index.html', window.location.toString());

    if(checkUrl.href !== window.location.href)
        return;

    const displayModes = document.querySelectorAll('input[name=paneDisplayMode]') as NodeListOf<HTMLInputElement>;
    const paneTitleIpt = document.querySelector('input[name=paneTitle]') as HTMLInputElement;
    const toggleHeaderBtn = document.querySelector('#toggle_header');
    const toggleSettingsBtn = document.querySelector('#toggle_settings');
    
    var alwaysShowHeader = true;
    var isSettingsVisible = true;

    // Pane display mode.
    for (const option of displayModes) {
        option.addEventListener('change', () => {
            for (const option of displayModes) {
                if(option.checked) {
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
        navigationView.toggleAttribute("always-show-header", alwaysShowHeader);
    });

    toggleSettingsBtn.addEventListener('click', () => {
        isSettingsVisible = !isSettingsVisible;

        toggleSettingsBtn.innerHTML = `Toggle Header: ${isSettingsVisible.toString().toUpperCase()}`;
        navigationView.toggleAttribute('is-settings-visible', isSettingsVisible);
    });
});