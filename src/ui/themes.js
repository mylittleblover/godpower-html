/* Theme composition owns appearance only. No classroom state or business commands. */
window.GodpowerTheme = (() => {
  "use strict";
  const KEY = "godpower_appearance_v1";
  const names = { classic: "上帝的力量", marx: "马克思的力量" };
  const star =
    "M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z";
  /* Google Material Design 3 (Material Symbols / Icons Rounded, 24x24 filled SVG geometry). */
  const classicPaths = {
    home: "M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",
    battle:
      "M3 3l2.2.2 10.1 10.1 1.7-1.7 1.2 1.2-1.6 1.6 3.2 3.2-1.4 1.4-3.2-3.2-1.6 1.6-1.2-1.2 1.7-1.7L3.2 5.2 3 3zm18 0l-2.2.2-10.1 10.1-1.7-1.7-1.2 1.2 1.6 1.6-3.2 3.2 1.4 1.4 3.2-3.2 1.6 1.6 1.2-1.2-1.7-1.7L20.8 5.2 21 3z",
    gift: "M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z",
    history:
      "M13 3a9 9 0 0 0-9 9H2.21a.5.5 0 0 0-.35.85l2.79 2.79c.2.2.51.2.71 0l2.79-2.79a.5.5 0 0 0-.36-.85H6a7 7 0 1 1 2.06 4.95.996.996 0 1 0-1.41 1.41A8.99 8.99 0 0 0 13 21a9 9 0 0 0 0-18zm-.25 5a.75.75 0 0 0-.75.75v3.69c0 .35.19.68.49.86l3.12 1.85a.75.75 0 0 0 .76-1.29l-2.87-1.71V8.75c0-.41-.34-.75-.75-.75z",
    archive:
      "M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm5-7H4V4h16v3z",
    spark:
      "M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z",
    settings:
      "M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z",
    users:
      "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    sound:
      "M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z",
    book: "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z",
    shield:
      "M11.19 1.36l-7 3.11C3.47 4.79 3 5.51 3 6.3V11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6.3c0-.79-.47-1.51-1.19-1.83l-7-3.11a2 2 0 0 0-1.62 0zm-1.9 14.93L6.7 13.7a.996.996 0 1 1 1.41-1.41L10 14.17l5.88-5.88a.996.996 0 1 1 1.41 1.41l-6.59 6.59a.996.996 0 0 1-1.41 0z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    lock_open:
      "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75-.14.54.18 1.08.72 1.22.53.14 1.08-.18 1.22-.72C9.44 3.93 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 11c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-8c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v8z",
    arrow:
      "M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6a.996.996 0 1 0-1.41 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z",
    north_east:
      "M9 6c0 .55.45 1 1 1h5.59L5.7 16.89a.996.996 0 1 0 1.41 1.41L17 8.41V14c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-8c-.55 0-1 .45-1 1z",
    chevron_left:
      "M14.71 6.71a.996.996 0 0 0-1.41 0L8.71 11.3a.996.996 0 0 0 0 1.41l4.59 4.59a.996.996 0 1 0 1.41-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z",
    chevron_right:
      "M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z",
    search:
      "M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    add: "M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z",
    undo: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2.85 7.85c-.31-.31-.85-.09-.85.36V14.5c0 .28.22.5.5.5h6.29c.45 0 .67-.54.35-.85l-2.06-2.06c1.39-1.16 3.16-1.88 5.12-1.88 3.16 0 5.89 1.84 7.19 4.5.27.56.91.84 1.5.64.71-.23 1.06-1.03.75-1.71C20.24 10.22 16.65 8 12.5 8z",
    hand: "M21.5 4c-.83 0-1.5.67-1.5 1.5v5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-8c0-.83-.67-1.5-1.5-1.5S16 1.67 16 2.5v8c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-9c0-.83-.67-1.5-1.5-1.5S12 .67 12 1.5v8.99c0 .28-.22.5-.5.5s-.5-.22-.5-.5V4.5c0-.83-.67-1.5-1.5-1.5S8 3.67 8 4.5v11.41l-4.12-2.35c-.58-.33-1.3-.24-1.78.22-.6.58-.62 1.54-.03 2.13l6.78 6.89c.75.77 1.77 1.2 2.85 1.2H19c2.21 0 4-1.79 4-4V5.5c0-.83-.67-1.5-1.5-1.5z",
    casino:
      "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18zm0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9z",
    trophy:
      "M19 5h-2V4c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1h-3v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z",
    info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z",
    zoom_in:
      "M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z",
    zoom_out:
      "M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z",
    restart:
      "M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 13c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 8.74A7.93 7.93 0 0 0 4 13c0 4.42 3.58 8 8 8v3l4-4-4-4v3z",
    play: "M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z",
    trending_up:
      "M16.85 6.85l1.44 1.44-4.88 4.88-3.29-3.29a.996.996 0 0 0-1.41 0l-6 6.01a.996.996 0 1 0 1.41 1.41L9.41 12l3.29 3.29c.39.39 1.02.39 1.41 0l5.59-5.58 1.44 1.44a.5.5 0 0 0 .85-.35V6.5a.48.48 0 0 0-.49-.5h-4.3c-.44 0-.67.54-.35.85z",
    bolt: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z",
    star,
    leaderboard:
      "M6.5 21H3c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1zm7.25-18h-3.5c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h3.5c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm7.25 8h-3.5c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1H21c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1z",
    timeline:
      "M22 10c0-1.1-.9-2-2-2s-2 .9-2 2c0 .18.04.34.08.5l-3.55 3.57c-.34-.1-.72-.1-1.06 0l-2.55-2.55c.04-.17.08-.34.08-.52 0-1.1-.9-2-2-2s-2 .9-2 2c0 .18.04.35.08.52L3.51 15.08c-.17-.04-.33-.08-.51-.08-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2c0-.18-.04-.34-.08-.5l3.55-3.57c.34.1.72.1 1.06 0l2.55 2.55c-.04.17-.08.34-.08.52 0 1.1.9 2 2 2s2-.9 2-2c0-.18-.04-.35-.08-.52l3.56-3.56c.17.04.34.08.52.08 1.1 0 2-.9 2-2z",
    palette:
      "M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67a.528.528 0 0 1-.13-.35c0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    tune: "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z",
    animation:
      "M14.69 2.21C14.12 2.08 13.56 2 13 2a9.996 9.996 0 0 0-8.1 4.13c-.33.46-.22 1.11.24 1.44.46.33 1.11.22 1.44-.24A7.99 7.99 0 0 1 13 4c.44 0 .88.05 1.3.14.54.12 1.07-.22 1.19-.76.12-.53-.22-1.06-.8-1.17zM11 8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm9.3-5.2c-.34-.46-.99-.56-1.45-.22-.46.34-.56.99-.22 1.45A7.96 7.96 0 0 1 20 16.5c0 .44-.05.87-.14 1.29-.12.54.22 1.07.76 1.19.54.12 1.07-.22 1.19-.76.12-.56.19-1.13.19-1.72 0-2.08-.64-4.01-1.7-5.7z",
    download:
      "M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z",
    upload: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
    swap_horiz:
      "M6.14 11.86L3.36 14.64c-.2.2-.2.51 0 .71l2.78 2.78c.32.32.86.1.86-.35V16h6c.55 0 1-.45 1-1s-.45-1-1-1H7v-1.79c0-.45-.54-.67-.86-.35zm14.5-3.21-2.78-2.78c-.32-.32-.86-.1-.86.35V8h-6c-.55 0-1 .45-1 1s.45 1 1 1h6v1.79c0 .45.54.67.86.35l2.78-2.78a.51.51 0 0 0 0-.71z",
    check:
      "M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z",
    close:
      "M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z",
    delete:
      "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z",
    send: "M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z",
    stop: "M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z",
    rule: "M16.54 11L13 7.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L16.54 11zM11 7H2v2h9V7zm10 6.41L19.59 12 17 14.59 14.41 12 13 13.41 15.59 16 13 18.59 14.41 20 17 17.41 19.59 20 21 18.59 18.41 16 21 13.41zM11 15H2v2h9v-2z",
    chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
  };
  /* Marx-theme distinct Material Design 3 filled paths for navigation and flagship controls. */
  const paths = {
    home: "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z",
    battle:
      "M14.4 6l-.24-1.2c-.09-.46-.5-.8-.98-.8H6c-.55 0-1 .45-1 1v15c0 .55.45 1 1 1s1-.45 1-1v-6h5.6l.24 1.2c.09.47.5.8.98.8H19c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1h-4.6z",
    gift: classicPaths.gift,
    history: classicPaths.history,
    archive: classicPaths.trophy,
    spark: star,
    settings: classicPaths.settings,
    users: classicPaths.users,
    sound: classicPaths.sound,
    book: classicPaths.book,
    shield: classicPaths.shield,
    arrow: classicPaths.arrow,
  };
  const emblem = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="红星麦穗徽记"><rect width="64" height="64" rx="15" fill="#a91e2c"/><g fill="none" stroke="#ffe0a0" stroke-width="2"><path d="M24 53Q5 42 14 22m26 31q19-11 10-31M14 34l-6-4m7 11-6-2m10 9-7-1M50 34l6-4m-7 11 6-2m-10 9 7-1"/></g><path d="m32 10 4.6 10 11 1.2-8.2 7.7 2.2 11L32 34.4l-9.6 5.3 2.2-11-8.2-7.7 11-1.2Z" fill="#ffe0a0"/><path d="M24 49h16M27 54h10" stroke="#ffe0a0" stroke-width="2"/></svg>`;
  let theme = "classic",
    active = null,
    classicBrand = null,
    classicIcon = null;
  try {
    if (JSON.parse(localStorage.getItem(KEY))?.theme === "marx") theme = "marx";
  } catch (error) {
    /* Appearance storage may be unavailable; classroom storage is untouched. */
  }
  const classics = new Map();
  function icon(name, fallback) {
    const classicPath = classicPaths[name] || fallback || star;
    if (!classics.has(name)) classics.set(name, classicPath);
    const path =
      theme === "marx" ? paths[name] || classicPath || star : classicPath;
    return `<svg class="ui-icon" data-theme-icon="${name}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  }
  function name() {
    return names[theme];
  }
  function hydrate(root = document) {
    if (!root || typeof root.querySelectorAll !== "function") return;
    for (const host of root.querySelectorAll("[data-md3-icon]")) {
      const key = host.dataset.md3Icon || "";
      if (!key) continue;
      host.outerHTML = icon(key);
    }
  }
  function boot() {
    document.documentElement.dataset.theme = theme;
    document.body?.classList.toggle("theme-marx", theme === "marx");
    if (document.body) document.body.dataset.theme = theme;
  }
  function apply() {
    boot();
    document.title = name() + " V@@VERSION@@";
    const label = document.querySelector(".gp-brand-label");
    if (label?.firstChild?.nodeType === Node.TEXT_NODE)
      label.firstChild.textContent = name() + " ";
    const title = document.getElementById("gpIntroTitle");
    if (title) title.textContent = name();
    document
      .getElementById("gpIntro")
      ?.setAttribute("aria-label", "滑动解锁进入" + name());
    document
      .querySelector(".gp-home")
      ?.setAttribute("aria-label", name() + "首页");
    const foot = document.querySelector(".gp-footnote");
    if (foot) foot.textContent = name() + " · 让每一次参与都有力量";
    const svg = document.querySelector("#gpBrandMount svg,#gpIntroLogo svg");
    if (svg) {
      if (classicBrand === null) classicBrand = svg.innerHTML;
      svg.innerHTML =
        theme === "marx"
          ? emblem.slice(emblem.indexOf(">") + 1, emblem.lastIndexOf("</svg>"))
          : classicBrand;
      svg.setAttribute(
        "viewBox",
        theme === "marx" ? "0 0 64 64" : "0 0 512 512",
      );
    }
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      classicIcon ??= favicon.href;
      favicon.href =
        theme === "marx"
          ? "data:image/svg+xml," + encodeURIComponent(emblem)
          : classicIcon;
    }
    hydrate(document);
    for (const svg of document.querySelectorAll(".ui-icon[data-theme-icon]")) {
      const key = svg.dataset.themeIcon;
      const classicPath = classicPaths[key] || classics.get(key) || star;
      svg
        .querySelector("path")
        ?.setAttribute(
          "d",
          theme === "marx" ? paths[key] || classicPath : classicPath,
        );
    }
    for (const button of document.querySelectorAll("[data-appearance-theme]"))
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.appearanceTheme === theme),
      );
    if (typeof updateWelcomeClock === "function") updateWelcomeClock();
    // Dedicated event is consumed by presentation transports only.
    window.dispatchEvent(
      new CustomEvent("godpower:theme", { detail: { theme, name: name() } }),
    );
  }
  function cancel() {
    if (!active) return;
    const current = active;
    active = null;
    for (const animation of current.animations) animation.cancel();
    current.element.remove();
    current.resolve();
  }
  function set(next, { animate = true } = {}) {
    if (!Object.hasOwn(names, next)) return Promise.resolve({ ok: false });
    cancel();
    theme = next;
    let persisted = true;
    try {
      localStorage.setItem(KEY, JSON.stringify({ schemaVersion: 1, theme }));
    } catch (error) {
      persisted = false;
      window.showToast?.("主题仅在本次生效：界面偏好保存失败");
    }
    const prefs =
      typeof DesktopUI !== "undefined" ? DesktopUI.getPreferences() : {};
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      !animate ||
      reduce ||
      prefs.motion === "off" ||
      prefs.motion === "simple" ||
      !document.body.animate
    ) {
      apply();
      return Promise.resolve({ ok: true, persisted });
    }
    const overlay = document.createElement("div");
    overlay.id = "gpThemeTransition";
    overlay.className = "gp-theme-transition";
    overlay.dataset.target = theme;
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-label", "正在切换至" + name());
    overlay.innerHTML = `<div class="gp-theme-ribbon" aria-hidden="true"></div><div class="gp-theme-transition-content">${emblem}<h2>${name()}</h2><p>KNOWLEDGE IS POWER · 知识就是力量</p></div><button type="button" id="gpThemeSkip" class="ui-cinematic-skip">跳过动画</button>`;
    document.body.append(overlay);
    const result = new Promise((resolve) => {
      active = {
        element: overlay,
        animations: [],
        resolve: () => resolve({ ok: true, persisted }),
      };
    });
    const current = active;
    document.getElementById("gpThemeSkip").onclick = cancel;
    apply();
    // A rare theme change earns a short ceremonial reveal; normal use remains instant.
    const motion = overlay.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.24 },
        { opacity: 1, offset: 0.6 },
        { opacity: 0 },
      ],
      { duration: 960, easing: "cubic-bezier(0.23,1,0.32,1)" },
    );
    const content = overlay
      .querySelector(".gp-theme-transition-content")
      .animate(
        [
          { opacity: 0, transform: "translateY(24px) scale(.95)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 500, easing: "cubic-bezier(0.23,1,0.32,1)" },
      );
    const ribbon = overlay.querySelector(".gp-theme-ribbon").animate(
      [
        { transform: "translateX(-35%) rotate(-12deg)", opacity: 0 },
        { transform: "translateX(0) rotate(-12deg)", opacity: 1, offset: 0.45 },
        { transform: "translateX(35%) rotate(-12deg)", opacity: 0 },
      ],
      { duration: 960, easing: "cubic-bezier(0.77,0,0.175,1)" },
    );
    current.animations.push(motion, content, ribbon);
    motion.finished
      .then(() => {
        if (active === current) cancel();
      })
      .catch(() => {});
    return result;
  }
  function mount(panel) {
    if (document.getElementById("gpThemeOptions")) return;
    const section = document.createElement("section");
    section.className = "ui-settings-group";
    section.id = "gpThemeOptions";
    section.innerHTML = `<h3>应用主题</h3><p class="ui-muted">立即保存。仅改变外观、名称与图标，不改变比赛规则。</p><div class="gp-theme-options"><button id="gpTheme-classic" type="button" class="gp-theme-card" data-appearance-theme="classic"><span class="gp-theme-swatch">${icon("spark")}</span><span><strong>上帝的力量</strong><small>经典青绿 · 珊瑚橙</small></span></button><button id="gpTheme-marx" type="button" class="gp-theme-card" data-appearance-theme="marx"><span class="gp-theme-swatch marx">${emblem}</span><span><strong>马克思的力量</strong><small>朱红旗帜 · 暖白 · 金色麦穗</small></span></button></div>`;
    panel.querySelector(".ui-settings-title")?.after(section);
    section.querySelectorAll("[data-appearance-theme]").forEach((button) =>
      button.addEventListener("click", () => {
        void set(button.dataset.appearanceTheme);
      }),
    );
    apply();
  }
  document.documentElement.dataset.theme = theme;
  window.addEventListener("DOMContentLoaded", apply, { once: true });
  window.addEventListener("pagehide", cancel);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cancel();
  });
  if (typeof document !== "undefined" && document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => hydrate(document), {
      once: true,
    });
  }
  return {
    get: () => theme,
    name,
    icon,
    hydrate,
    boot,
    set,
    mount,
    cancel,
    isSwitching: () => !!active,
  };
})();
