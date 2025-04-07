export interface Room {
    _id: string;
    roomId: string;
    roomType: string;
    price: number;
    capacity: number;
    information: string;
    image: string;
    description: string;
    status: string;
    bookingDetails: any[];
    roomQuantity: number;
}

export interface RoomResponse {
    message: string;
    data: Room[];
}