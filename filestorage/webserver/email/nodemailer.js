let mailOptions = {
    from: 'msnodearch@zohomail.eu',
    to: 'sgmakgg@gmail.com',
    subject: 'File storage (nodearch) verification',
    text: 'That was easy!'
};

function sendEmail(transporter, mailOptions){
    return new Promise((resolve, reject) =>{
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports={
    mailOptions,
    sendEmail
}
