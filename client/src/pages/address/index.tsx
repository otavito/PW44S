import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/hooks/use-auth";
import AddressService from "@/services/address-service";
import type { IAddressDTO } from "@/commons/types";

const emptyAddress: IAddressDTO = { address: "", complement: "", cep: "" };

export const AddressPage = () => {
    const { authenticatedUser } = useAuth();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const [addresses, setAddresses] = useState<IAddressDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingAddress, setEditingAddress] = useState<IAddressDTO | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<IAddressDTO>({ defaultValues: emptyAddress });

    const [fetchingCep, setFetchingCep] = useState(false);

    const buscarEndereco = async () => {
        const cep = getValues("cep").replace(/\D/g, "");
        if (cep.length !== 8) {
            toast.current?.show({ severity: "warn", summary: "Atenção", detail: "Digite um CEP válido antes de buscar.", life: 3000 });
            return;
        }
        setFetchingCep(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                toast.current?.show({ severity: "error", summary: "CEP não encontrado", detail: "Nenhum endereço encontrado para este CEP.", life: 3000 });
            } else if (!data.logradouro) {
                toast.current?.show({ severity: "warn", summary: "Atenção", detail: "Este CEP não possui logradouro. Preencha o endereço manualmente.", life: 4000 });
            } else {
                setValue("address", data.logradouro, { shouldValidate: true });
            }
        } catch {
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Não foi possível buscar o endereço.", life: 3000 });
        } finally {
            setFetchingCep(false);
        }
    };

    useEffect(() => {
        if (authenticatedUser) fetchAddresses();
    }, [authenticatedUser]);

    const fetchAddresses = async () => {
        setLoading(true);
        const response = await AddressService.findAll();
        if (response.success) {
            setAddresses(Array.isArray(response.data) ? response.data : []);
        } else {
            toast.current?.show({ severity: "error", summary: "Erro", detail: response.message, life: 4000 });
        }
        setLoading(false);
    };

    const openNew = () => {
        setEditingId(null);
        reset(emptyAddress);
        setDialogVisible(true);
    };

    const openEdit = (addr: IAddressDTO) => {
        setEditingId(addr.id ?? null);
        setEditingAddress(addr);
        reset({ address: addr.address, complement: addr.complement ?? "", cep: addr.cep });
        setDialogVisible(true);
    };

    const onSave = async (data: IAddressDTO) => {
        if (!authenticatedUser) return;
        setSaving(true);
        const response = editingId
            ? await AddressService.update(editingId, { ...editingAddress, ...data, id: editingId })
            : await AddressService.save(data);
        setSaving(false);
        if (response.success) {
            toast.current?.show({ severity: "success", summary: "Sucesso", detail: response.message, life: 3000 });
            setDialogVisible(false);
            fetchAddresses();
        } else {
            toast.current?.show({ severity: "error", summary: "Erro", detail: response.message, life: 3000 });
        }
    };

    const confirmDelete = (id: number) => {
        confirmDialog({
            message: "Deseja remover este endereço?",
            header: "Confirmar exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Remover",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-danger",
            accept: () => handleDelete(id),
        });
    };

    const handleDelete = async (id: number) => {
        const response = await AddressService.remove(id);
        if (response.success) {
            toast.current?.show({ severity: "success", summary: "Removido", detail: response.message, life: 3000 });
            setAddresses((prev) => prev.filter((a) => a.id !== id));
        } else {
            toast.current?.show({ severity: "error", summary: "Erro", detail: response.message, life: 3000 });
        }
    };

    if (!authenticatedUser) {
        return (
            <div className="container pt-5 text-center">
                <p style={{ color: "var(--text-color-secondary)" }}>Você precisa estar autenticado.</p>
                <Button label="Fazer login" className="p-button-sm mt-3" onClick={() => navigate("/login")} />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--surface-ground)", minHeight: "100vh" }}>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="container py-4" style={{ maxWidth: "720px" }}>
                {/* Cabeçalho */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            icon="pi pi-arrow-left"
                            className="p-button-text p-button-sm"
                            onClick={() => navigate("/profile")}
                        />
                        <h1 className="h5 fw-bold mb-0" style={{ color: "var(--text-color)" }}>
                            Meus endereços
                        </h1>
                    </div>
                    <Button label="Novo endereço" icon="pi pi-plus" className="p-button-sm" onClick={openNew} />
                </div>

                {/* Lista */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border" role="status" style={{ color: "var(--primary-color)" }}>
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                ) : addresses.length === 0 ? (
                    <Card>
                        <div className="text-center py-4" style={{ color: "var(--text-color-secondary)" }}>
                            <i className="pi pi-map-marker mb-3" style={{ fontSize: "2rem" }} />
                            <p className="mb-0">Nenhum endereço cadastrado.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-column gap-3">
                        {addresses.map((addr) => (
                            <Card key={addr.id}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div style={{ color: "var(--text-color)" }}>
                                        <div className="fw-semibold">{addr.address}</div>
                                        {addr.complement && (
                                            <div className="text-sm" style={{ color: "var(--text-color-secondary)" }}>
                                                {addr.complement}
                                            </div>
                                        )}
                                        <div className="text-sm mt-1" style={{ color: "var(--text-color-secondary)" }}>
                                            CEP: {addr.cep}
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-text p-button-sm"
                                            onClick={() => openEdit(addr)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-text p-button-danger p-button-sm"
                                            onClick={() => addr.id && confirmDelete(addr.id)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de cadastro/edição */}
            <Dialog
                header={editingId ? "Editar endereço" : "Novo endereço"}
                visible={dialogVisible}
                onHide={() => setDialogVisible(false)}
                style={{ width: "min(480px, 95vw)" }}
                modal
            >
                <form onSubmit={handleSubmit(onSave)} className="flex flex-column gap-3 pt-2">
                    <div>
                        <label className="block mb-1 text-sm" style={{ color: "var(--text-color-secondary)" }}>
                            Endereço <span className="p-error">*</span>
                        </label>
                        <Controller
                            name="address"
                            control={control}
                            rules={{ required: "Informe o endereço" }}
                            render={({ field }) => (
                                <InputText {...field} className="w-full" invalid={!!errors.address} placeholder="Rua, número, bairro" />
                            )}
                        />
                        {errors.address && <small className="p-error">{errors.address.message}</small>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm" style={{ color: "var(--text-color-secondary)" }}>Complemento</label>
                        <Controller
                            name="complement"
                            control={control}
                            render={({ field }) => (
                                <InputText {...field} className="w-full" placeholder="Apto, bloco, referência..." />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm" style={{ color: "var(--text-color-secondary)" }}>
                            CEP <span className="p-error">*</span>
                        </label>
                        <Controller
                            name="cep"
                            control={control}
                            rules={{
                                required: "Informe o CEP",
                                pattern: { value: /^\d{5}-?\d{3}$/, message: "CEP inválido (ex: 12345-678)" },
                            }}
                            render={({ field }) => (
                                <InputText {...field} className="w-full" invalid={!!errors.cep} placeholder="00000-000" maxLength={9} />
                            )}
                        />
                        <div className="mt-1">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); buscarEndereco(); }}
                                style={{ fontSize: "0.85rem", color: fetchingCep ? "var(--text-color-secondary)" : "var(--primary-color)", pointerEvents: fetchingCep ? "none" : "auto" }}
                            >
                                {fetchingCep ? "Buscando..." : "Buscar endereço"}
                            </a>
                        </div>
                        {errors.cep && <small className="p-error">{errors.cep.message}</small>}
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button
                            label="Cancelar"
                            type="button"
                            className="p-button-text p-button-sm"
                            onClick={() => setDialogVisible(false)}
                        />
                        <Button
                            label={editingId ? "Salvar alterações" : "Cadastrar"}
                            icon="pi pi-check"
                            type="submit"
                            className="p-button-sm"
                            loading={saving}
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
};
