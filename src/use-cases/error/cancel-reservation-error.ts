export class CancelReservationError extends Error {
    constructor() {
        super('Reservations can only be canceled 48 hours in advance')
    }
}