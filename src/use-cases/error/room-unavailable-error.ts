export class RoomUnavailableError extends Error {
    constructor() {
        super('Room is not available for the selected dates')
    }
}