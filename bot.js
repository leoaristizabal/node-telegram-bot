const { Telegraf } = require('telegraf');

const bot = new Telegraf('6102990420:AAH9hKcIhf8Z4WXUJMMjQgCBzekltljdJHI');


// Manejador del comando /start y mensaje de bienvenida
bot.start((ctx) => {
  ctx.reply(`Hola ${ctx.from.first_name}!\n\nBienvenido MedTrackBot.\n\nAca podras registrar tus medicamentos y obtener recordatorios personalizados segun tus necesidades:\n\nUsa uno de estos comandos para comenzar:\n\n/register - registrar información sobre la medicación\n/update - actualizar información sobre la medicación\n/delete - eliminar información sobre la medicación\n/list - listar información sobre la medicación`);
});

// Crear un objeto para almacenar información de usuarios registrados
const registeredUsers = {};


// Manejador de comando para registrar medicamentos


bot.help((ctx) => {
  ctx.reply('Usa uno de estos comandos para comenzar:\n\n/register - registrar información sobre la medicación\n/update - actualizar información sobre la medicación\n/delete - eliminar información sobre la medicación\n/list - listar información sobre la medicación');
})




bot.launch();