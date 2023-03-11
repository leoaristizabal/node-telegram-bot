const { Telegraf }= require('telegraf');

const bot = new Telegraf('6102990420:AAH9hKcIhf8Z4WXUJMMjQgCBzekltljdJHI');

bot.start((ctx) => { //comando start
    console.log(ctx)
    console.log(ctx.chat)
    console.log(ctx.message)
    console.log(ctx.updateSubTypes)
    ctx.reply(`Hola ${ctx.from.first_name}, como te puedo ayudar hoy?`); //respuesta
})
bot.help((ctx) => {
    ctx.reply('Ayuda');
})
bot.settings((ctx) => {
    ctx.reply('Configuraciones');
})

bot.command(['mycommand', 'Mycommando', 'MYCOMMAND', 'test'], (ctx)=> { //diferentes entradas de texto
    ctx.reply('my custom command')
})

bot.hears('Hola', ctx => {  //Cuando se escribe y manda la palabra computer
    ctx.reply('Hola! Recuerda que debes escribir con los comandos del tipo: /Start') 
})

bot.hears('computer', ctx => {  //Cuando se escribe y manda la palabra computer
    ctx.reply('Hey, escuche que dijiste computador(?)') 
})

bot.on('text', ctx => {
 ctx.reply('Recuerda que debes escribir con los comandos del tipo: /Start'
 )}) //cuando el escuche un evento, cualquier cosa (sickers, audio, iconos...)



bot.launch();
