function searchUser() {
  const input = document.getElementById('user-input') as HTMLInputElement;
  const userName = input.value;

  window.location.href = `/user.html?user=${userName}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  searchForm?.addEventListener('submit', () => {
    console.debug('Search submit');
    searchUser();
    return false;
  });
});
