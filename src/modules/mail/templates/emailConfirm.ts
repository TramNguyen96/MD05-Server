import * as Mailgen from 'mailgen';

interface MailBody{
    productName:  string;
    productWebUrl: string;
    receiverName: string;
    confirmLink: string;
    language: string;
}

function genEmailString( mailBody: MailBody) {
    var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: mailBody.productName,
        link: mailBody.productWebUrl
    }
});

var email = {
    body: {
        greeting: "Dear",
        signature: "Yours truly",
        name: mailBody.receiverName,
        intro: `Thank you for joining the community ${mailBody.productName}! We are very happy about that!`,
        action: {
            instructions: `To verify the email for the account ${mailBody.productName}! please click on the link below:`,
            button: {
                color: '#22BC66', // Optional action button color
                text: "Confirm email",
                link:  mailBody.confirmLink
            }
        },
        outro: "Need help or have questions? Just reply to this email, we'll be happy to help",
        copyright: `Copyright © 2023 ${mailBody.productName}. All rights reserved.`

    }
};

    return mailGenerator.generate(email);
}

export default genEmailString;