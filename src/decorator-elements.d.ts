interface DecoratorElementAttributes {
    'app-name'?: string;
    environment?: string;
    'url-format'?: string;
    fnr?: string;
    enhet?: string;
    'fnr-sync-mode'?: string;
    'enhet-sync-mode'?: string;
    'show-enheter'?: string;
    'show-search-area'?: string;
    'show-hotkeys'?: string;
    'enable-hotkeys'?: string;
    'fetch-active-enhet-on-mount'?: string;
    'fetch-active-user-on-mount'?: string;
    markup?: string;
    hotkeys?: string;
    proxy?: string;
    'websocket-url'?: string;
    'access-token'?: string;
    'include-credentials'?: string;
    'user-key'?: string;
}

declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'internarbeidsflate-decorator': React.HTMLAttributes<HTMLElement> &
                React.RefAttributes<HTMLElement> &
                DecoratorElementAttributes;
        }
    }
}