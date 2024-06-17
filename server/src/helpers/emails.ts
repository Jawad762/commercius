import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "commercius.app@gmail.com",
        pass: "ujtv blfd eatu smtp"
    }
});

export const sendEmail = async (email: string, code: string) => {
    await transporter.sendMail({
        from: 'commercius.app@gmail.com',
        to: email,
        subject: "Verification Code",
        html:
        `
            <p>Thanks for signing up! Please confirm your account using the following code:</p>
            <h1 STYLE='font-size: 28px, text-align: center'>${code}<h1>
        `
    });
}

