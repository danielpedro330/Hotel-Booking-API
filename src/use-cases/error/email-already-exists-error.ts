export class EmailAlreadyExistsError extends Error {
    constructor() {
        super("❌The email already exists.")
    }
}