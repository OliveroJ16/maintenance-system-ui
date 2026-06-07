{/*Opcional: Modificar despues*/}
interface Props {
    message: string;
}

export const LoginAlert: React.FC<Props> = ({ message }) => (
    <div className="login-alert error">
        {message}
    </div>
);
