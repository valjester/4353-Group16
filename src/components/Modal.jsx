import React from 'react'

function Modal({onClose}) {
    return (
        <div>
            <button onClick={onClose}>X</button>
            <div>
                <h1>Register</h1>
                <form>
                    <p>
                        Email: <input type="email"
                    placeholder="Enter your email"
                    required></input>
                    </p>
                    <p>Password:
                        <input type="password"
                    placeholder="Enter your password"
                    required></input>
                    </p>
                    <p>Re-enter password:
                        <input type="password"
                    placeholder="Enter your password"
                    required></input>
                    </p>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Modal