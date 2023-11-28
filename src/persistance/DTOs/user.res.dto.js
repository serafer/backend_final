export default function currentUserResDTO(user) {
    return {
        nombre: user.first_name,
        apellido: user.last_name,
        correo_electronico: user.email,
        rol: user.role
    };
}

export function userResDTOArray(users) {
    return users.map(user => ({
        nombre: user.first_name,
        apellido: user.last_name,
        correo_electronico: user.email,
        rol: user.role
    }));
}
