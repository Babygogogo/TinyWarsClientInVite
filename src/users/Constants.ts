 
export const enum Common {
    AdminUserId             = 1000001,

    NicknameMinLength       = 4,
    NicknameMaxLength       = 20,
    AccountMaxLength        = 20,
    RawPasswordMaxLength    = 20,

    MinDummyUserId          = 100,
    DummyUsersCount         = 100,
}

 
export const enum LogoutTypeId {
    SelfRequest,
    LoginCollision,
    NetworkFailure,
}
