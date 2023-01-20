import { v4 as uuidv4 } from 'uuid';

const userList = [
    {
        id: uuidv4(),
        firstName: "Ahmed",
        lastName : "hassan",
        avatar: require('../images/avatars/Ellipse_3.png'),
        isActive : true,
        relationship: "Add"
    },
    {
        id: uuidv4(),
        firstName: "Sara",
        lastName : "Khaled",
        avatar: require('../images/avatars/Ellipse_4.png'),
        isActive : true,
        relationship: "Unfriend"
    },
    {
        id: uuidv4(),
        firstName: "Omr",
        lastName : "Mohamed",
        avatar: require('../images/avatars/Ellipse_5.png'),
        relationship: "Accept"
    },
    {
        id: uuidv4(),
        firstName: "Mostafa",
        lastName : "Mohamed",
        avatar: require('../images/avatars/Ellipse_6.png'),
        isActive : true,
        relationship: "Accept"
    },
    {
        id: uuidv4(),
        firstName: "Hatem",
        lastName : "Ibrahim",
        avatar: require('../images/avatars/Ellipse_7.png'),
        isActive : true,
        relationship: "Accept"
    },
    {
        id: uuidv4(),
        firstName: "Sara",
        lastName : "Khaled",
        avatar: require('../images/avatars/Ellipse_4.png'),
        isActive : true,
        relationship: "Accept"
    },
    
]

export default userList;