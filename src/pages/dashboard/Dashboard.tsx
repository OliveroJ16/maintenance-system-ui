import React from 'react';

export const Dashboard: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            fontFamily: 'Arial'
        }}>
            <h1>Login exitoso</h1>
            <p>Bienvenido al Dashboard</p>
        </div>
    );
};