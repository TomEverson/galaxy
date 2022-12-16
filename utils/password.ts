//@ts-expect-error
import * as bcrypt from 'bcryptjs'

export async function passwordHash(password:string) {
    const salt = await bcrypt.genSaltSync(parseInt(import.meta.env.SALT_ROUND))
    const hashedpassword = await bcrypt.hashSync(password,salt)
    return hashedpassword
}

export async function passwordCheck(password:string, hashed:string) {
    const check = await bcrypt.hashSync(password,hashed)
    return check
}