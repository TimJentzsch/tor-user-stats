function getQueryString(params: Record<string, string>) {
  const ret = [];

  for (const key of Object.keys(params)) {
    if (params[key]) {
      ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }

  return ret.join('&');
}

function getBaseUrl(): string {
  // Remove query parameters
  const url = window.location.href.split('?')[0];
  // Move up one
  const paths = url.split('/');
  const baseURL = paths.slice(0, paths.length - 1).join('/');

  return `${baseURL}/overlay.html`;
}

function updateOverlayLink(userName: string, sessionStart: string, hAlign: string, vAlign: string) {
  const baseURL = getBaseUrl();
  const overlayLinkInput = document.getElementById('overlay-link') as HTMLInputElement;

  const params = getQueryString({
    user: userName,
    sessionStart,
    hAlign,
    vAlign,
  });

  const url = params ? `${baseURL}?${params}` : baseURL;
  overlayLinkInput.value = url;
}

document.addEventListener('DOMContentLoaded', () => {
  const userNameInput = document.getElementById('overlay-user-name') as HTMLInputElement;
  const sessionStartInput = document.getElementById('overlay-session-start') as HTMLInputElement;
  const hAlignButtons = document.getElementsByName('halign') as NodeListOf<HTMLInputElement>;
  const vAlignButtons = document.getElementsByName('valign') as NodeListOf<HTMLInputElement>;

  const overlayLinkInput = document.getElementById('overlay-link') as HTMLInputElement;
  const copyButton = document.getElementById('overlay-link-copy-button') as HTMLButtonElement;

  let userName = userNameInput.value;
  let sessionStart = sessionStartInput.value;
  let hAlign = '';
  let vAlign = '';

  updateOverlayLink(userName, sessionStart, hAlign, vAlign);

  userNameInput.oninput = () => {
    userName = userNameInput.value;
    updateOverlayLink(userName, sessionStart, hAlign, vAlign);
  };

  sessionStartInput.oninput = () => {
    sessionStart = sessionStartInput.value;
    updateOverlayLink(userName, sessionStart, hAlign, vAlign);
  };

  hAlignButtons.forEach((button) => {
    button.oninput = () => {
      if (button.checked) {
        hAlign = button.value;
        updateOverlayLink(userName, sessionStart, hAlign, vAlign);
      }
    };
  });

  vAlignButtons.forEach((button) => {
    button.oninput = () => {
      if (button.checked) {
        vAlign = button.value;
        updateOverlayLink(userName, sessionStart, hAlign, vAlign);
      }
    };
  });

  copyButton.onclick = () => {
    navigator.clipboard.writeText(overlayLinkInput.value);
  };
});
