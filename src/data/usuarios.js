// Usuarios de demostración (seed) para poder iniciar sesión sin backend.
// En un proyecto real las contraseñas jamás se guardan así (texto plano) ni
// viajan por localStorage: aquí se hace así únicamente porque esta app no
// tiene servidor. AuthProvider agrega a esta lista cualquier cuenta nueva
// creada desde "Registrarse", persistiéndola en localStorage.
export const USUARIOS_SEED = [
  {
    id: 'u1',
    nombre: 'Diana Wiling',
    email: 'diana@rosamark.com',
    password: 'rosamark123',
  },
  {
    id: 'u2',
    nombre: 'Eduardo Ortiz',
    email: 'eduardo@rosamark.com',
    password: 'rosamark123',
  },
  {
    id: 'u3',
    nombre: 'Usuaria Demo',
    email: 'demo@rosamark.com',
    password: 'demo1234',
  },
]
