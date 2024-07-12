let users = []

const userJoin = (id, username, room) => {
    const user = {id, username, room };
    users.push(user)
    console.log("users in the room",users);
    return user;
};

const getCurrentUser = (id) => {
    return users.find((user) => {
        user.id === id;
    });
};

const userLeave = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });
    if (index !== -1){
        return users.splice(index, 1)[0];
    }
};

function getRoomUsers(room) {
    return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers}
