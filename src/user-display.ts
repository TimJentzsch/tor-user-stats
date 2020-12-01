function displayUser() {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get('user');

  if (!userName) {
    return;
  }

  const userNameElement = document.getElementById('username') as HTMLElement;
  userNameElement.innerText = `/u/${userName}`;
}

document.addEventListener('DOMContentLoaded', () => {
  displayUser();
});
