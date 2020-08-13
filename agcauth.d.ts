declare namespace huawei {
    namespace AGC {
        namespace auth {
            enum AuthProvier {
                /**
                 * Anonymous sign-in.
                 */
                Anonymous = 0,
                /**
                 * Sign-in through a HUAWEI ID.
                 */
                HMS_Provider = 1,
                /**
                 * Sign-in through a Facebook account.
                 */
                Facebook_Provider = 2,
                /**
                 * Sign-in through a Twitter account.
                 */
                Twitter_Provider = 3,
                /**
                 * Sign-in through a WeChat account.
                 */
                WeiXin_Provider = 4,
                /**
                 * Sign-in through a HUAWEI Game Service account.
                 */
                HWGame_Provider = 5,
                /**
                 * Sign-in through a Tencent QQ account.
                 */
                QQ_Provider = 6,
                /**
                 * Sign-in through a Weibo account.
                 */
                WeiBo_Provider = 7,
                /**
                 * Sign-in through a Google account.
                 */
                Google_Provider = 8,
                /**
                 * Sign-in through a Google Play account.
                 */
                GoogleGame_Provider = 9,
                /**
                 * Sign-in through a self-created account.
                 */
                SelfBuild_Provider = 10,
                /**
                 * Sign-in through a hosted mobile phone account.
                 */
                Phone_Provider = 11,
                /**
                 * Sign-in through a hosted email account.
                 */
                Email_Provider = 12
            }
            /**
             * @links https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/agcauthexception
             */
            enum AuthRetCode {
                /**
                 * The access token is empty. Please sign in again.
                 */
                NULL_TOKEN = 1,
                /**
                 * Obtain the access token information before sign-in.
                 */
                NOT_SIGN_IN = 2,
                /**
                 * The user has been associated with the authentication mode.
                 */
                USER_LINKED = 3,
                /**
                 * The user has not been associated with the authentication mode.
                 */
                USER_UNLINKED = 4,
                /**
                 * A user has signed in using an authentication mode. Use the corresponding account or another account to sign in without signing out.
                 */
                ALREADY_SIGN_IN_USER = 5,
                /**
                 * The email verification code is empty.
                 */
                EMAIL_VERIFICATION_IS_EMPTY = 6,
                /**
                 * The SMS verification code is empty.
                 */
                PHONE_VERIFICATION_IS_EMPTY = 7,
                /**
                 * Login success.
                 */
                LOGIN_SUCCESS = 1001,
                /**
                 * Link success.
                 */
                LINK_SUCCESS = 1002,
                /**
                 * Register success.
                 */
                REGISTER_SUCCESS = 1003,
                /**
                 * Get verfiy code success.
                 */
                GET_VERIFY_SUCCESS = 1004,
                /**
                 * Get verfiy code failed.
                 */
                GET_TOKEN_SUCCESS = 1007,
                /**
                 * Get token failed.
                 */
                GET_TOKEN_FAIL = 1107,
                /**
                 * Update profile success.
                 */
                UPDATE_PROFILE_SUCCESS = 1008,
                /**
                 * Update profile failed.
                 */
                UPDATE_PROFILE_FAIL = 1108,
                /**
                 * Update email success.
                 */
                UPDATE_EMAIL_SUCCESS = 1009,
                /**
                 * Update email failed.
                 */
                UPDATE_EMAIL_FAIL = 1109,
                /**
                 * Update password success.
                 */
                UPDATE_PASSWORD_SUCCESS = 1010,
                /**
                 * Update password failed.
                 */
                UPDATE_PASSWORD_FAIL = 1110,
                /**
                 * Update phone success.
                 */
                UPDATE_PHONE_SUCCESS = 1011,
                /**
                 * Update phone failed.
                 */
                UPDATE_PHONE_FAIL = 1111,
                /**
                 * Get user extra info success.
                 */
                GET_USER_EXTRA_SUCCESS = 1012,
                /**
                 * Get user extra info failed.
                 */
                GET_USER_EXTRA_FAIL = 1112,
                /**
                 * Login failed.
                 */
                LOGIN_FAIL = 1101,
                /**
                 * Link failed.
                 */
                LINK_FAIL = 1102,
                /**
                 * Register failed.
                 */
                REGISTER_FAIL = 1103,
                /**
                 * Sign in failed.
                 */
                SIGN_IN_FAIL = 1104,
                /**
                 * Get verfiy code failed.
                 */
                GET_VERIFY_FAIL = 1105,
                /**
                 * Get player info failed.
                 */
                GET_PLAYER_INFO_FAIL = 1106,
                /**
                 * User not login.
                 */
                USER_NOT_LOGIN = 1113,
                /**
                 * User signed in.
                 */
                SIGNED_IN = 1201,
                /**
                 * User token updated.
                 */
                TOKEN_UPDATED = 1202,
                /**
                 * User invalid.
                 */
                TOKEN_INVALID = 1203,
                /**
                 * User singed out.
                 */
                SIGNED_OUT = 1204,
                /**
                 * Invalid email address.
                 */
                INVALID_EMAIL = 203817223,
                /**
                 * Invalid mobile number.
                 */
                INVALID_PHONE = 203817224,
                /**
                 * Failed to obtain the user ID.
                 */
                GET_UID_ERROR = 203817728,
                /**
                 * The user ID does not match the product ID.
                 */
                UID_PRODUCTID_NOT_MATCH = 203817729,
                /**
                 * Failed to obtain user information.
                 */
                GET_USER_INFO_ERROR = 203817730,
                /**
                 * Currently, Auth Service is deployed at four sites whose authentication modes are different.
                 */
                AUTH_METHOD_NOT_SUPPORT = 203817732,
                /**
                 * Auth Service is not enabled for the product.
                 */
                PRODUCT_STATUS_ERROR = 203817744,
                /**
                 * The number of verification code inputs for password-based sign-in exceeds the upper limit.
                 */
                PASSWORD_VERIFICATION_CODE_OVER_LIMIT = 203817811,
                /**
                 * The client token is unavailable.
                 */
                INVALID_TOKEN = 203817984,
                /**
                 * The access token is unavailable.
                 */
                INVALID_ACCESS_TOKEN = 203817985,
                /**
                 * The refresh token is unavailable. The user's refresh token has expired. Sign in the user again to obtain a new refresh token.
                 */
                INVALID_REFRESH_TOKEN = 203817986,
                /**
                 * The token does not match the product ID. It is recommended that a consistency check between agconnect-services.json and information from AppGallery Connect be conducted.
                 */
                TOKEN_AND_PRODUCTID_NOT_MATCH = 203817987,
                /**
                 * The authentication mode is not supported.
                 */
                AUTH_METHOD_IS_DISABLED = 203817988,
                /**
                 * Failed to obtain the third-party user information.
                 */
                FAIL_TO_GET_THIRD_USER_INFO = 203817989,
                /**
                 * Failed to obtain the third-party union ID.
                 */
                FAIL_TO_GET_THIRD_USER_UNION_ID = 203817990,
                /**
                 * The number of access tokens exceeds the upper limit.
                 */
                ACCESS_TOKEN_OVER_LIMIT = 203817991,
                /**
                 * Failed to associate the user.
                 */
                FAIL_TO_USER_LINK = 203817992,
                /**
                 * Failed to disassociate the user.
                 */
                FAIL_TO_USER_UNLINK = 203817993,
                /**
                 * The number of signed-in anonymous users exceeds the upper limit.
                 */
                ANONYMOUS_SIGNIN_OVER_LIMIT = 203818019,
                /**
                 * The app ID is unavailable.
                 */
                INVALID_APPID = 203818020,
                /**
                 * The app secret is unavailable.
                 */
                INVALID_APPSECRET = 203818021,
                /**
                 * Failed to obtain the third-party QQ user information.
                 */
                GET_QQ_USERINFO_ERROR = 203818023,
                /**
                 * No QQ Info information is returned.
                 */
                QQINFO_RESPONSE_IS_NULL = 203818024,
                /**
                 * No QQ UID is returned.
                 */
                GET_QQ_UID_ERROR = 203818025,
                /**
                 * Incorrect password or verification code.
                 */
                PASSWORD_VERIFY_CODE_ERROR = 203818032,
                /**
                 * The information returned by Google does not match the app ID.
                 */
                GOOGLE_RESPONSE_NOT_EQUAL_APPID = 203818033,
                /**
                 * The user is suspended.
                 */
                SIGNIN_USER_STATUS_ERROR = 203818036,
                /**
                 * Incorrect password.
                 */
                SIGNIN_USER_PASSWORD_ERROR = 203818037,
                /**
                 * The authentication mode has been associated with another user.
                 */
                PROVIDER_USER_HAVE_BEEN_LINKED = 203818038,
                /**
                 * The authentication mode has already been associated with the user.
                 */
                PROVIDER_HAVE_LINKED_ONE_USER = 203818039,
                /**
                 * Failed to obtain user information from an authentication platform.
                 */
                FAIL_GET_PROVIDER_USER = 203818040,
                /**
                 * Cannot disassociate a single authentication mode.
                 */
                CANNOT_UNLINK_ONE_PROVIDER_USER = 203818041,
                /**
                 * Sending verification codes too frequently.
                 */
                VERIFY_CODE_INTERVAL_LIMIT = 203818048,
                /**
                 * The verification code is empty.
                 */
                VERIFY_CODE_EMPTY = 203818049,
                /**
                 * The language for sending a verification code is empty.
                 */
                VERIFY_CODE_LANGUAGE_EMPTY = 203818050,
                /**
                 * The verification code receiver is empty.
                 */
                VERIFY_CODE_RECEIVER_EMPTY = 203818051,
                /**
                 * The verification code type is empty.
                 */
                VERIFY_CODE_ACTION_ERROR = 203818052,
                /**
                 * The number of times for sending verification codes exceeds the upper limit.
                 */
                VERIFY_CODE_TIME_LIMIT = 203818053,
                /**
                 * The password cannot be the same as the user name.
                 */
                ACCOUNT_PASSWORD_SAME = 203818064,
                /**
                 * The password strength is too low.
                 */
                PASSWORD_STRENGTH_LOW = 203818065,
                /**
                 * Failed to update the password.
                 */
                UPDATE_PASSWORD_ERROR = 203818066,
                /**
                 * The new password cannot be the same as the old one.
                 */
                PASSWORD_SAME_AS_BEFORE = 203818067,
                /**
                 * The password is empty.
                 */
                PASSWORD_IS_EMPTY = 203818068,
                /**
                 * The password is too long.
                 */
                PASSWORD_TOO_LONG = 203818071,
                /**
                 * The latest sign-in time of the sensitive operation times out.
                 */
                SENSITIVE_OPERATION_TIMEOUT = 203818081,
                /**
                 * The account already exists.
                 */
                ACCOUNT_HAVE_BEEN_REGISTERED = 203818082,
                /**
                 * Failed to update the account.
                 */
                UPDATE_ACCOUNT_ERROR = 203818084,
                /**
                 * The user has not been registered.
                 */
                USER_NOT_REGISTERED = 203818087,
                /**
                 * Incorrect verification code.
                 */
                VERIFY_CODE_ERROR = 203818129,
                /**
                 * The user already exists.
                 */
                USER_HAVE_BEEN_REGISTERED = 203818130,
                /**
                 * The account is empty.
                 */
                REGISTER_ACCOUNT_IS_EMPTY = 203818132,
                /**
                 * Incorrect verification code format.
                 */
                VERIFY_CODE_FORMAT_ERROR = 203818134,
                /**
                 * The verification code or password cannot be empty.
                 */
                VERIFY_CODE_AND_PASSWORD_BOTH_NULL = 203818135,
                /**
                 * Failed to send the email.
                 */
                SEND_EMAIL_FAIL = 203818240,
                /**
                 * Failed to send the SMS message.
                 */
                SEND_MESSAGE_FAIL = 203818241,
                /**
                 * Failed to lock an account because the maximum number of password or verification code retry times is not set.
                 */
                CONFIG_LOCK_TIME_ERROR = 203818261
            }
            interface AuthListener {
                (retCode: number, msg: string): void;
            }
            /**
             * set the listener for auth
             * @param {AuthListener} listener auth listener
             */
            function setAuthListener(listener: AuthListener): void;
            /**
             * switch current used provider
             * @param { AuthProvier } authType auth provider tag
             */
            function switchAuthType(authType: AuthProvier): void;
            /**
             * Get support providers, link "[0, 1, 2]"
             */
            function getSupportAuthType(): String;
            /**
             * User login
             */
            function login(): void;
            /**
             * user logout
             */
            function logout(): void;
            /**
             * Current user link other provider
             * @param { AuthProvier } authType other provider tage
             */
            function link(authType: AuthProvier): void;
            /**
             * Get verify code (only user the Email or Phone provider)
             */
            function getVerifyCode(): void;
            /**
             * User regiser (only user the Email or Phone provider)
             */
            function register(): void;
            /**
             * Set user regiser or login info (only user the Email or Phone provider)
             * this function invoked must before the other functions
             * @param loginInfo
             * @example
             * ```
             * let loginInfo = {
             *    email: '953459485#qq.com',  // email provider need
             *    phoneNumber: "18166036531", // phone provider need
             *    countryCode: "86",          // phone provider need
             *    verifyCode: code,           // after get user info nend reset login info with verify code
             *    action: "register",         // regiser, reset
             * }
             * ```
             */
            function setLoginInfo(loginInfo: any): void;
            /**
             * Get Current User
             * ```
             * let userInfo = {
             *    isAnonymous: false,
             *    uid: "123",
             *    displayName: "123" ,
             *    photoUrl: "123",
             *    email: "123",
             *    phone: "123",
             *    providerId: "1",
             *    providerInfo: "123",
             *    emailVerified: 1,
             *    passwordSetted : 1,
             * }
             * ```
             */
            function getUserInfo(): any;
            /**
             * Get User token
             * @param forceRefresh is force
             */
            function getToken(forceRefresh: boolean): void;
            /**
             * update user profile
             * @param displayName display name
             * @param photoUrl    photo url
             */
            function updateProfile(displayName: String, photoUrl: String): void;
            /**
             * update user password
             * @param newPassword new password
             * @param verifyCode  verify code
             * @param provider    userd provider
             */
            function updatePassword(newPassword: String, verifyCode: String, provider: AuthProvier): void;
            /**
             * update user email
             * @param newEmail new email
             * @param newVerifyCode verify code
             */
            function updateEmail(newEmail: String, newVerifyCode: String): void;
            /**
             * update user phone
             * @param countryCode country code
             * @param phoneNumber phone number
             * @param newVerifyCode  verify code
             */
            function updatePhone(countryCode: String, phoneNumber: String, newVerifyCode: String): void;
            /**
             * get user extra info
             */
            function getUserExtra(): void;
            /**
             * delete user
             */
            function deleteUser(): void;
            /**
             * reset user password
             * @param emailOrPhone email ro phone
             * @param newPassword  new passowrd
             * @param verifyCode   verify code
             * @param countryCode  country code (if use email ,the donot fill this paramter)
             */
            function resetPassword(emailOrPhone: String, newPassword: String, verifyCode: String, countryCode?: string): void;
        }
    }
}
