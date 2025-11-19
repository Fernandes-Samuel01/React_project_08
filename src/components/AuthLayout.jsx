import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        //TODO: make it more easy to understand

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }

        //let authValue = authStatus === true ? true : false

        //If authstatus is false and authentication is true => no redirect
        //true && false !== true  => true && true 
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        }
        // If authstatus is true and authentication is true => no redirect
        //  false && true !== true => false && false
        else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}

// This component is a guard for protected routes/pages. It prevents unauthorized users from accessing certain parts of the app by redirecting them as needed.