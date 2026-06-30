import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useAuth } from "@/context/hooks/use-auth";

export const ProfilePage = () => {
    const { authenticatedUser } = useAuth();
    const navigate = useNavigate();

    if (!authenticatedUser) {
        return (
            <div className="container pt-5 text-center">
                <p style={{ color: "var(--text-color-secondary)" }}>Você precisa estar autenticado para acessar esta página.</p>
                <Button label="Fazer login" className="p-button-sm mt-3" onClick={() => navigate("/login")} />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "var(--surface-ground)", minHeight: "100vh" }}>
            <div className="container py-4" style={{ maxWidth: "720px" }}>
                <h1 className="h4 fw-bold mb-4" style={{ color: "var(--text-color)" }}>
                    <i className="pi pi-user me-2" />
                    Meu Perfil
                </h1>

                {/* ── Dados do usuário ── */}
                <Card className="mb-4">
                    <h2 className="h6 fw-semibold mb-3" style={{ color: "var(--text-color)" }}>Dados da conta</h2>
                    <div className="flex flex-column gap-3">
                        <div>
                            <label className="block mb-1 text-sm" style={{ color: "var(--text-color-secondary)" }}>Nome</label>
                            <InputText value={authenticatedUser.displayName} disabled className="w-full" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm" style={{ color: "var(--text-color-secondary)" }}>Usuário</label>
                            <InputText value={authenticatedUser.username} disabled className="w-full" />
                        </div>
                    </div>
                </Card>

                {/* ── Atalhos ── */}
                <Card>
                    <h2 className="h6 fw-semibold mb-3" style={{ color: "var(--text-color)" }}>Acesso rápido</h2>
                    <div className="flex flex-column gap-2">
                        <Button
                            label="Meus endereços"
                            icon="pi pi-map-marker"
                            className="p-button-outlined p-button-sm w-full"
                            onClick={() => navigate("/profile/addresses")}
                        />
                        <Divider />
                        <Button
                            label="Histórico de pedidos"
                            icon="pi pi-list"
                            className="p-button-outlined p-button-sm w-full"
                            onClick={() => navigate("/orders")}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};


