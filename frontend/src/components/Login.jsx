import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"


const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const {login} = useContext(AuthContext)
    const navigate = useNavigate

    return (
        <div>Login</div>
    )
}

export default Login