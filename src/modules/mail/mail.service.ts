import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface MailOption{
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

import emailConfirm from './templates/emailConfirm'
import emailChangePass from './templates/emailChangePass'
import emailResetPass from'./templates/emailResetPass'

export const templates = {
    emailConfirm,
    emailChangePass,
    emailResetPass
}

@Injectable()
export class EmailService {
    async sendMail(mailOption: MailOption){
        try{
            const transporter = nodemailer.createTransport(
                {
                    service: 'gmail',
                    auth: {
                        user: process.env.MS_USER,
                        pass: process.env.MS_PW
                    }
                }
            )
            await transporter.sendMail(
                {
                    from: process.env.MS_USER,
                    ...mailOption
                }
            )
            return true;

        }catch(err){
            return false;
        }
    }
}

