import LockIcon from '../assets/icons/lock.svg?react';
import UserIcon from '../assets/icons/user.svg?react';

interface Props {
    username: string;
    password: string;
    isLoading: boolean;
    onUsernameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<Props> = ({
    username, password, isLoading,
    onUsernameChange, onPasswordChange, onSubmit
}) => (
    <form onSubmit={onSubmit}>
        <div className="form-group">
            <label>Usuario</label>
            <div className="input-wrapper">
                <div className="input-icon">
                    <UserIcon aria-label="Usuario" />
                </div>
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>
        </div>

        <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
                <div className="input-icon">       
                    <LockIcon aria-label="Contraseña" />
                </div>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>
        </div>

        <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
    </form>
);