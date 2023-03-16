const { Telegraf }= require('telegraf');

const bot = new Telegraf('6102990420:AAH9hKcIhf8Z4WXUJMMjQgCBzekltljdJHI');

// Manejador del comando /start
bot.start((ctx) => {
    ctx.reply(`Hola ${ctx.from.first_name}!\n\nBienvenido MedTrackBot.\n\nAca podras registrar tus medicamentos y obtener recordatorios personalizados segun tus necesidades:\n\nUsa uno de estos comandos para comenzar:\n\n/register - registrar información sobre la medicación\n/update - actualizar información sobre la medicación\n/delete - eliminar información sobre la medicación\n/list - listar información sobre la medicación`);
});


// Crear un objeto para almacenar información de usuarios registrados
const registeredUsers = {};

// Manejador del comando /register
bot.command(['register', 'registrar', 'registre', 'registro'], (ctx) => {
    // Verificar si el usuario ya está registrado
    if (registeredUsers[ctx.from.id]) {
        ctx.reply('Ya estás registrado. Si necesitas actualizar tu información, usa el comando /update.');
        return;
    }

    // Pedir información al usuario
    ctx.reply('Proporciona información sobre tu medicación en el siguiente formato:\n\n<b>medicamento:dosis:frecuencia.</b> \n\nPor ejemplo:\n\n<b>acetominofen:4mg:8horas</b>', {parse_mode: 'HTML'});

    // Actualizar el estado del registro
    registeredUsers[ctx.from.id] = { state: 'waiting_for_medication_info' };
});

// Manejador de texto
bot.on('text', (ctx) => {
    const userId = ctx.from.id;
    const userState = registeredUsers[userId];

    switch (userState?.state) {
        case 'waiting_for_medication_info':
            // Procesar la información del usuario
            const userData = ctx.message.text.split(':');

            // Verificar que la información es válida
            if (userData.length !== 3) {
                ctx.reply('Lo siento, el formato de información no es válido. Por favor, inténtelo de nuevo.');
                return;
            }

            // Almacenar información del usuario
            registeredUsers[userId] = {
                medicamento: userData[0],
                dosis: userData[1],
                frecuencia: userData[2],
            };

            // Confirmar registro
            ctx.reply(`Tu medicamento se ha registrado correctamente.\n\nRecibirás recordatorios para:\n\n<b>${userData[0]} de ${userData[1]} cada ${userData[2]}.</b>`, {parse_mode: 'HTML'});

            break;

        default:
            // Responder a cualquier otro mensaje de texto
            ctx.reply('No entendí lo que quisiste decir. Por favor, utiliza uno de los comandos disponibles.');
            break;
    }
});



bot.launch();