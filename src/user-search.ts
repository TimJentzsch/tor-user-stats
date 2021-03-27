// eslint-disable-next-line import/prefer-default-export
export function searchUserMain(): void {
  const input = document.getElementById('main-user-input') as HTMLInputElement;
  const userName = input.value;

  window.location.href = `user.html?user=${userName}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('main-search-form');
  searchForm?.addEventListener('submit', () => {
    searchUserMain();
    return false;
  });
});
