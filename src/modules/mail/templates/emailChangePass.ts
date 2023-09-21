import Mailgen from 'mailgen';

interface MailBody{
    productName:  string;
    productWebUrl: string;
    receiverName: string;
    confirmLink: string;
}

function genEmailString( mailBody: MailBody) {
    var mailGenerator = new Mailgen({
    theme: 'cerberus',
    product: {
        name: mailBody.productName,
        link: mailBody.productWebUrl
    }
});

var email = {
    body: {
        greeting: 'Dear',
        signature: 'Yours truly',
        name: mailBody.receiverName,
        intro: `Welcome to ${mailBody.productName}! We\'re very excited to have you on board.`,
        action: {
            instructions: `To get started with ${mailBody.productName}, please click here:`,
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your email',
                link:  mailBody.confirmLink
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
        copyright: `Copyright © 2023 ${mailBody.productName}. All rights reserved.`

    }
};

    return mailGenerator.generate(email);
}

export default genEmailString;