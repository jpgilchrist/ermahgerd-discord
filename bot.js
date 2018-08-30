const Discord = require('discord.js')
const winston = require('winston')
const auth = require('./auth.json')
const translate = require('node-ermahgerd').translate;
const lunchspots = require('./lunch-store');

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            colorize: true
        })
    ]
})

const client = new Discord.Client()

client.on('ready', (evt) => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(client.user.username + ' - (' + client.user.id + ')')
})

client.on('message', (message) => {
    const {content} = message
    console.log('Received Message: ' + content)
    if (content.substring(0,1) === '!') {
        let args = content.substring(1).split(' ')
        const cmd = args[0]
        console.log('Received Command: ' + cmd)
        args = args.splice(1);
        args = args.join(' ');
        switch(cmd.toLowerCase()) {
            case 'translate':
                const translation = translate(args);
                message.channel.send(`[${message.author.username}] ${translation}`)
                    .then(sent => console.log(`Sent Message: ${sent.content}`))
                    .then(() => message.delete())
                    .catch(console.error);
                break;
            case 'lunch':
                const randomLunchSpot = lunchspots[Math.floor(Math.random()*lunchspots.length)];
                let _message = `Random Lunch Spot: ${randomLunchSpot.Name}`;
                if (randomLunchSpot["Web Page"]) {
                    _message += ` (${randomLunchSpot["Web Page"]})`
                }
                if (randomLunchSpot.Location) {
                    _message += ` @ ${randomLunchSpot.Location}`
                }
                message.channel.send(_message)
        }
    }
})

client.login(auth.token)

