export interface IResponse {
    status: number;
    success: boolean;
    message: string;
    data?: any;
}

export interface IUserRegister {
    displayName: string;
    username: string;
    password: string;
    email: string;
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface AuthenticatedUser {
    id?: number;
    displayName: string;
    username: string;
    email?: string;
}

export interface AuthenticationResponse {
    token: string;
    user: AuthenticatedUser;
}

export interface IAddressDTO {
    id?: number;
    userId?: number;
    address: string;
    complement?: string;
    cep: string;
}

export interface ICategory {
    id?: number;
    name: string;
}

export interface IProduct {
    id?: number;
    name: string;
    description: string;
    price: number;
    image: string;
    mini1?: string;
    mini2?: string;
    mini3?: string;
    category?: ICategory;
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface IOrderPayload {
    addressId: number;
    paymentMethod: string;
    items: { productId: number; quantity: number }[];
}

export interface IOrderItemDTO {
    id: number;
    productId: number;
    productName?: string;
    quantity: number;
    price: number;
}

export interface IOrderDTO {
    id: number;
    date: string;
    userId: number;
    total: number;
    addressId?: number;
    paymentMethod?: string;
    items?: IOrderItemDTO[];
}
