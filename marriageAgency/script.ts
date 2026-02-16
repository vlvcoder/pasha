const mock = require('./ma-mock-db.json');

console.log('======== Hello ==========');
const users = mock.users;
const res = [];

users
    .forEach((item) => {
        delete item.spouse;
        delete item.spouseId;
        item.married = false;
        // const spouse = users.find((child) => child.id === item.spouseId);
        // if (spouse) {
        //     const { id, name, surname, age, gender, married } = spouse;
        //     item.spouse = { id, name, surname, age, gender, married };
        //     delete item.spouseId;
        // }
    });

console.log(JSON.stringify(users, null, 2));
