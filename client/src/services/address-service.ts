import type { IAddressDTO, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const ADDRESS_URL = "/addresses";

const findAll = async (): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.get(ADDRESS_URL);
        response = { status: 200, success: true, message: "Endereços carregados", data: data.data };
    } catch (err: any) {
        response = { status: err?.response?.status ?? 400, success: false, message: "Falha ao carregar endereços", data: err?.response?.data };
    }
    return response;
};

const save = async (address: IAddressDTO): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.post(ADDRESS_URL, address);
        response = { status: 200, success: true, message: "Endereço salvo com sucesso", data: data.data };
    } catch (err: any) {
        response = { status: err?.response?.status ?? 400, success: false, message: "Falha ao salvar endereço", data: err?.response?.data };
    }
    return response;
};

const update = async (id: number, address: IAddressDTO): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.put(`${ADDRESS_URL}/${id}`, address);
        response = { status: 200, success: true, message: "Endereço atualizado com sucesso", data: data.data };
    } catch (err: any) {
        response = { status: err?.response?.status ?? 400, success: false, message: "Falha ao atualizar endereço", data: err?.response?.data };
    }
    return response;
};

const remove = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        await api.delete(`${ADDRESS_URL}/${id}`);
        response = { status: 200, success: true, message: "Endereço removido com sucesso" };
    } catch (err: any) {
        response = { status: err?.response?.status ?? 400, success: false, message: "Falha ao remover endereço", data: err?.response?.data };
    }
    return response;
};

const AddressService = { findAll, save, update, remove };

export default AddressService;
