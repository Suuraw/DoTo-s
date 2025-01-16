export function getUserDetails() {
    let user = localStorage.getItem('toDoAppUser');
    return user ? JSON.parse(user) : null;
}
