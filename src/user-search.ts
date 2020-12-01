function searchUser() {
  const input = document.getElementById('user-input') as HTMLInputElement;
  const userName = input.value;

  window.location.href = `/user.html?user=${userName}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search-button');
  search?.addEventListener('click', searchUser);
});
