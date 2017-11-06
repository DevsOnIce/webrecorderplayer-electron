import { ipcRenderer, remote } from 'electron';
import config from 'config';

export function iframeLoad() {
  ipcRenderer.sendToHost("did-frame-navigate");
}

export function capitalize(str) {
  if (!str) {
    return str;
  }

  return str.length ? str[0].toUpperCase() + str.slice(1) : '';
}

export function truncate(str, length) {
  if (!str) {
    return str;
  }

  return str.length > length ? `${str.substr(0, length).trim()}...` : str;
}

export function deleteStorage(key, device = window.localStorage) {
  try {
    return device.removeItem(`${config.storageKey}${key}`);
  } catch (e) {
    console.log(`Failed deleting ${key} in ${device}`);
  }
  return null;
}

export function getStorage(key, device = window.localStorage) {
  try {
    return device.getItem(`${config.storageKey}${key}`);
  } catch (e) {
    console.log(`Failed getting ${key} in ${device}`);
  }
  return null;
}

export function setStorage(key, value, device = window.localStorage) {
  try {
    device.setItem(`${config.storageKey}${key}`, value);
  } catch (e) {
    console.log(`Failed setting ${key}=${value} in ${device}`);
  }
}

export function inStorage(key, device = window.localStorage) {
  try {
    return Object.prototype.hasOwnProperty.call(device, `${config.storageKey}${key}`);
  } catch (e) {
    console.log(`Failed checking ${device} for key ${key}`);
    return false;
  }
}

export function remoteBrowserMod(rb, ts, sep) {
  // no remote browsers on player
  if (__PLAYER__) {
    return ts;
  }

  let base = ts || '';
  if (rb) {
    base += `$br:${rb}`;
  }
  if (base && sep) {
    base += sep;
  }
  return base;
}

/**
 * Remove trailing slash
 * @param  {string} val url to modify
 * @return {string}     url without trailing slash
 */
export function rts(val) {
  if (!val) return val;
  return val.replace(/\/$/, '');
}

/*
button #open
display a file selector and call ipc "open-warc" on main
*/
export function openFile() {
  remote.dialog.showOpenDialog(
    {
      properties: ['openFile'],
      filters: [{ name: 'Warc', extensions: ['gz', 'warc', 'arc', 'warcgz', 'har'] }]
    },
    (filename) => {
      if (filename && filename.toString().match(/\.w?arc(\.gz)?|\.har$/)) {
        ipcRenderer.send('open-warc', filename.toString());
      } else if (filename) {
        window.alert('Sorry, only WARC or ARC files (.warc, .warc.gz, .arc, .arc.gz) or HAR (.har) can be opened');
      }
    }
  );
}
