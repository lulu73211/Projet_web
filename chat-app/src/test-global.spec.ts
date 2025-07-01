describe('Test global simulé', () => {
  it('UserService simulation', () => {
    const mockUserService = {
      getUser: jest.fn().mockReturnValue({ id: 1, name: 'Lucas' }),
    };

    const user = mockUserService.getUser();
    expect(user).toEqual({ id: 1, name: 'Lucas' });
  });

  it('AuthService simulation', () => {
    const mockAuthService = {
      login: jest.fn().mockReturnValue('token123'),
    };

    const token = mockAuthService.login();
    expect(token).toBe('token123');
  });

  it('ConversationService simulation', () => {
    const mockConvService = {
      getAll: jest.fn().mockReturnValue([{ id: 1 }, { id: 2 }]),
    };

    const convos = mockConvService.getAll();
    expect(convos.length).toBe(2);
  });

  it('MessageService simulation', () => {
    const mockMessageService = {
      sendMessage: jest.fn().mockReturnValue({ id: 1, text: 'Hello' }),
    };

    const message = mockMessageService.sendMessage();
    expect(message.text).toBe('Hello');
  });
});
