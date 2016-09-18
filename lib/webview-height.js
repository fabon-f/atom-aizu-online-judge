'use strict';

const { ipcRenderer } = require('electron');

ipcRenderer.on('content-height', () => {
  ipcRenderer.sendToHost('content-height', document.documentElement.scrollHeight);
});
