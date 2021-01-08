import { updateElement } from './display/display-util';

function setUserName(userName: string): void {
  updateElement('overlay-reddit-name', userName);
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('user');

  if (!userName) {
    return;
  }

  setUserName(userName);
});
