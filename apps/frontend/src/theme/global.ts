import { createGlobalStyle } from 'styled-components';

// Global styles that reset browser defaults and set full-screen layout
export const GlobalStyle = createGlobalStyle`
    /* CSS Reset - Remove default browser styling */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    *::before,
    *::after {
        box-sizing: border-box;
    }

    /* Remove default styling from common elements */
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
    }

    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }

    /* Full-screen setup */
    html {
        height: 100%;
        width: 100%;
    }

    body {
        height: 100vh;
        width: 100vw;
        line-height: 1;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden; /* Prevent horizontal scroll */
    }

    /* Root element full-screen */
    #root {
        height: 100%;
        width: 100%;
    }

    /* Remove list styling */
    ol, ul {
        list-style: none;
    }

    /* Remove quotes from blockquotes */
    blockquote, q {
        quotes: none;
    }

    blockquote::before, blockquote::after,
    q::before, q::after {
        content: '';
        content: none;
    }

    /* Table reset */
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    /* Form elements reset */
    button, input, optgroup, select, textarea {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
    }

    button, input {
        overflow: visible;
    }

    button, select {
        text-transform: none;
    }

    button, [type="button"], [type="reset"], [type="submit"] {
        -webkit-appearance: button;
    }

    button::-moz-focus-inner,
    [type="button"]::-moz-focus-inner,
    [type="reset"]::-moz-focus-inner,
    [type="submit"]::-moz-focus-inner {
        border-style: none;
        padding: 0;
    }

    button:-moz-focusring,
    [type="button"]:-moz-focusring,
    [type="reset"]:-moz-focusring,
    [type="submit"]:-moz-focusring {
        outline: 1px dotted ButtonText;
    }

    /* Links */
    a {
        color: inherit;
        text-decoration: none;
    }

    /* Images */
    img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    /* Remove focus outline for non-keyboard users */
    [tabindex="-1"]:focus:not(:focus-visible) {
        outline: 0 !important;
    }
`;
