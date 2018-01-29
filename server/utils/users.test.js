const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [
            {
                id: '1',
                name: 'Mike',
                room: 'Node Course'
            },
            {
                id: '2',
                name: 'Jen',
                room: 'React Course'
            },
            {
                id: '3',
                name: 'Julie',
                room: 'Node Course'
            },
        ];
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Jack',
            room: 'The Office Fans'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return names for Node Course', () => {
       let userList = users.getUserList('Node Course');

       expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for React Course', () => {
        let userList = users.getUserList('React Course');

        expect(userList).toEqual(['Jen']);
    });

    it('should remove a user', () => {
        let userId = '3';
        let removedUser = users.removeUser(userId);

        expect(removedUser.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        let userId = '555';
        let removedUser = users.removeUser(userId);

        expect(removedUser).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        let userId = '1';
        let foundUser = users.getUser(userId);

        expect(foundUser).toBeTruthy();
        expect(foundUser.id).toBe(userId);
    });

    it('should not find user', () => {
        let userId = '555';
        let foundUser = users.getUser(userId);

        expect(foundUser).toBeFalsy();
    });
});