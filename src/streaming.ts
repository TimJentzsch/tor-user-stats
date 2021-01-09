function getQueryString(params: Record<string, string>) {
  const ret = [];

  for (const key of Object.keys(params)) {
    if (params[key]) {
      ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }

  return ret.join('&');
}

function updateOverlayLink(userName: string, sessionStart: string) {
  const baseURL = 'http://localhost:1234/overlay.html';
  const overlayLinkInput = document.getElementById('overlay-link') as HTMLInputElement;

  const params = getQueryString({
    user: userName,
    sessionStart,
  });

  const url = params ? `${baseURL}?${params}` : baseURL;
  overlayLinkInput.value = url;
}

document.addEventListener('DOMContentLoaded', async () => {
  const userNameInput = document.getElementById('overlay-user-name') as HTMLInputElement;
  const sessionStartInput = document.getElementById('overlay-session-start') as HTMLInputElement;

  let userName = '';
  let sessionStart = '';

  userNameInput.oninput = () => {
    userName = userNameInput.value;
    updateOverlayLink(userName, sessionStart);
  };

  sessionStartInput.oninput = () => {
    sessionStart = sessionStartInput.value;
    updateOverlayLink(userName, sessionStart);
  };
});
