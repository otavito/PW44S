import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import type {IUserRegister} from "@/commons/types";
import AuthService from "@/services/auth-service";
import { Toast } from "primereact/toast";

export const RegisterPage = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IUserRegister>({
        defaultValues: { username: "", password: "", displayName: "", email: "" },
    }); // Formulário controlado com React Hook Form
    const { signup } = AuthService; // Método no authService que realiza uma requisição HTTP POST para /users na API
    const [loading, setLoading] = useState(false); // Objeto que controla o estado da requisição HTTP
    const navigate = useNavigate(); // Hook do React Touter para redirecionar o usuário para uma nova rota
    const toast = useRef<Toast>(null); // Hook para possibilitar o uso do componente Toast para exibir as mensagens de sucesso ou erro.

    const onSubmit = async (data: IUserRegister) => { // Função assíncrona para realizar o envio dos dados para API
        setLoading(true);
        try {
            const response = await signup(data);
            if (response.status === 200 && response.data) {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Usuário cadastrado com sucesso.",
                    life: 3000,
                });
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error: any) {
            const validationErrors = error.response?.data?.validationErrors;
            const detail =
                validationErrors?.username ||
                validationErrors?.email ||
                error.response?.data?.message ||
                "Falha ao cadastrar usuário.";
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail,
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex justify-center items-start pt-30 px-4 bg-gray-100 dark:bg-gray-900">
            <Toast ref={toast} />
            <Card title="Registrar Conta" className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">
                    <div>
                        <label className="block mb-2">Nome de Exibição</label>
                        <Controller
                            name="displayName"
                            control={control}
                            rules={{ required: "Campo obrigatório", minLength: { value: 4, message: "Mínimo 4 caracteres" }, maxLength: { value: 50, message: "Máximo 50 caracteres" } }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    className={classNames({ "p-invalid": errors.displayName })}
                                    placeholder="Ex: João das Neves"
                                />
                            )}
                        />
                        {errors.displayName && (
                            <small className="p-error">{errors.displayName.message}</small>
                        )}
                    </div>
                        <div>
                            <label className="block mb-2">Email</label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: "Campo obrigatório", pattern: { value: /.+@.+\..+/, message: "Email inválido" } }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        className={classNames({ "p-invalid": errors.email })}
                                        placeholder="seu@email.com"
                                    />
                                )}
                            />
                            {errors.email && (
                                <small className="p-error">{errors.email.message}</small>
                            )}
                        </div>
                    <div>
                        <label className="block mb-2">Usuário</label>
                        <Controller
                            name="username"
                            control={control}
                            rules={{ required: "Campo obrigatório", minLength: { value: 4, message: "Mínimo 4 caracteres" }, maxLength: { value: 50, message: "Máximo 50 caracteres" } }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    className={classNames({ "p-invalid": errors.username })}
                                    placeholder="Ex: jsnow"
                                />
                            )}
                        />
                        {errors.username && (
                            <small className="p-error">{errors.username.message}</small>
                        )}
                    </div>
                    <div>
                        <label className="block mb-2">Senha</label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Campo obrigatório",
                                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, message: "Senha deve conter maiúscula, minúscula e dígito" },
                            }}
                            render={({ field }) => (
                                <Password
                                    {...field}
                                    toggleMask
                                    feedback={false}
                                    className={classNames({ "p-invalid": errors.password })}
                                />
                            )}
                        />
                        {errors.password && (
                            <small className="p-error">{errors.password.message}</small>
                        )}
                    </div>
                    <Button
                        type="submit"
                        label="Registrar"
                        loading={loading || isSubmitting}
                        disabled={loading || isSubmitting}
                        className="w-full mt-3"
                    />
                    <div className="text-center mt-3">
                        <small>
                            Já tem uma conta?{" "}
                            <Link to="/login" className="text-primary">
                                Fazer login
                            </Link>
                        </small>
                    </div>
                </form>
            </Card>
        </div>
    );
};