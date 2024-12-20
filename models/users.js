
const bcrypt = require('bcryptjs');

let users = [
    {
        id: 1,
        fullName: "1",
        username: "1",
        phone: "+1-555-123-4567",
        email: "1@1",
        password: "$2a$10$dUfjwSSQboNolEH7dio.s.Wl6dlXHIRb6qlqv0g/J7jpZKIIHMVcO" // "password123" hashed
    }
];

const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

const findUserById = (id) => {
    return users.find(user => user.id === id);
};

const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log(hashedPassword)
    const newUser = {
        id: users.length + 1,
        ...userData,
        password: hashedPassword
    };
    users.push(newUser);
    return newUser;
};

module.exports = {
    users,
    findUserByEmail,
    findUserById,
    createUser
};