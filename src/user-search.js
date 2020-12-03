"use strict";
function searchUserMain() {
    var input = document.getElementById('main-user-input');
    var userName = input.value;
    window.location.href = "/user.html?user=" + userName;
}
document.addEventListener('DOMContentLoaded', function () {
    var searchForm = document.getElementById('main-search-form');
    searchForm === null || searchForm === void 0 ? void 0 : searchForm.addEventListener('submit', function () {
        searchUserMain();
        return false;
    });
});
