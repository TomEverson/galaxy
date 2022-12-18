import * as sgMail from "@sendgrid/mail"

sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY)

export default sgMail