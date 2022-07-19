class Validate {
    getValidateUsername(username) {
        const userCheck = /^[a-zA-Z0-9._-]{3,15}$/;
        if (username.match(" ") || "") {
            return false;
        } else if (username.match(userCheck)) {
            return true;
        } else {
            return false;
        }
    }
}
export default new Validate();