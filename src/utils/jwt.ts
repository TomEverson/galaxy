//@ts-nocheck
import * as jwt from "jsonwebtoken"
import * as cookie from 'cookie'

export async function jwtSign(user){
    const key = import.meta.env.JWT_SECRET
    const token = jwt.sign(user, key, { expiresIn: "30d" });
    const Cookie = cookie.serialize('token', token, {
        secure: true,
        httpOnly: true,
        path: '/',
        maxAge: 3600 * 24 * 7,
      })
    return Cookie
}

export async function jwtDecode(user){
    const key = import.meta.env.JWT_SECRET
    const token = jwt.verify(user, key);
    return token
}