import type { IOrderDTO, IOrderPayload, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const ORDER_URL = "/orders";

const create = async (payload: IOrderPayload): Promise<IResponse> => {
    try {
        const data = await api.post(ORDER_URL, payload);
        return { status: 201, success: true, message: "Pedido realizado com sucesso!", data: data.data };
    } catch (error: any) {
        return {
            status: error?.response?.status ?? 500,
            success: false,
            message: error?.response?.data?.message ?? "Erro ao finalizar pedido.",
            data: error?.response?.data,
        };
    }
};

const findAll = async (): Promise<IResponse & { data: IOrderDTO[] }> => {
    try {
        const response = await api.get<IOrderDTO[]>(ORDER_URL);
        return { status: 200, success: true, message: "", data: response.data };
    } catch (error: any) {
        return {
            status: error?.response?.status ?? 500,
            success: false,
            message: error?.response?.data?.message ?? "Erro ao buscar pedidos.",
            data: [],
        };
    }
};

const OrderService = { create, findAll };
export default OrderService;
