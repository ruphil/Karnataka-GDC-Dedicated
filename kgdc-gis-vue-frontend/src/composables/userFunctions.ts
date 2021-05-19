const userFunctions = () => {
    const addUser = (user: string, pass: string) => {
        console.log(user, pass);
    }

    return { addUser };
}

export default userFunctions;