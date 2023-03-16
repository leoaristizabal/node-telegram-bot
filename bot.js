const { Telegraf }= require('telegraf');

const bot = new Telegraf('6102990420:AAH9hKcIhf8Z4WXUJMMjQgCBzekltljdJHI');


// Crear un objeto para almacenar información de usuarios registrados
const registeredUsers = {};

bot.start((ctx) => { 
    ctx.reply(`Hola ${ctx.from.first_name}, como te puedo ayudar hoy?`); 
})


bot.command('register', (ctx) => {
    // Verificar si el usuario ya está registrado
    if (registeredUsers[ctx.from.id]) {
        ctx.reply('Ya estás registrado. Si necesitas actualizar tu información, usa el comando /update.');
        return;
    }

    // Solicitar información al usuario
    ctx.reply('Por favor, proporcione información sobre su medicación en el siguiente formato: medicamento:dosis:frecuencia.');

    // Escuchar la respuesta del usuario
    bot.on('text', (ctx) => {
        const userData = ctx.message.text.split(':');

        // Verificar que la información es válida
        if (userData.length !== 3) {
            ctx.reply('Lo siento, el formato de información no es válido. Por favor, inténtelo de nuevo.');
            return;
        }

        // Almacenar información del usuario
        registeredUsers[ctx.from.id] = {
            medicamento: userData[0],
            dosis: userData[1],
            frecuencia: userData[2],
        };

        // Confirmar registro
        ctx.reply(`Gracias por registrarte. Recibirás recordatorios para tu medicación ${userData[0]} dosis ${userData[1]} cada ${userData[2]}.`);
    });
});

bot.help((ctx) => {
    ctx.reply('Ayuda');
})
bot.settings((ctx) => {
    ctx.reply('Configuraciones');
})

bot.command(['mycommand', 'Mycommando', 'MYCOMMAND', 'test'], (ctx)=> {
    ctx.reply('my custom command')
})

bot.hears('Hola', ctx => {  //Cuando se escribe y manda la palabra computer
    ctx.reply('Hola! Recuerda que debes escribir con los comandos del tipo: /start') 
})

//bot.on('text', ctx => {
// ctx.reply('Recuerda que debes escribir con los comandos del tipo: /start'
// )}) //cuando el escuche un evento, cualquier cosa (sickers, audio, iconos...)



bot.launch();
