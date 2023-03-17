const { Telegraf }= require('telegraf');

const bot = new Telegraf('6102990420:AAH9hKcIhf8Z4WXUJMMjQgCBzekltljdJHI');


// Manejador del comando /start
bot.start((ctx) => {
    ctx.reply(`Hola ${ctx.from.first_name}!\n\nBienvenido MedTrackBot.\n\nAca podras registrar tus medicamentos y obtener recordatorios personalizados segun tus necesidades:\n\nUsa uno de estos comandos para comenzar:\n\n/register - registrar información sobre la medicación\n/update - actualizar información sobre la medicación\n/delete - eliminar información sobre la medicación\n/list - listar información sobre la medicación`);
  });
  
  // Crear un objeto para almacenar información de usuarios registrados
  const registeredUsers = {};


 // Manejador de comando para registrar medicamentos
bot.command(['register', 'registrar', 'registre', 'registro'], (ctx) => {
  // Verificar si el usuario ya está registrado
  if (registeredUsers[ctx.from.id]) {
    ctx.reply('Ya has registrado medicamentos. Si necesitas actualizar tu información, usa el comando /update.');
    return;
  }

  // Pedir información sobre el primer medicamento al usuario
  ctx.reply('Proporciona información sobre tu primer medicamento en el siguiente formato:\n\n<b>medicamento:dosis:frecuencia</b> \n\nPor ejemplo:\n\n<b>acetominofen:4mg:8horas</b>', { parse_mode: 'HTML' });

  // Actualizar el estado del registro
  registeredUsers[ctx.from.id] = { state: 'waiting_for_first_medication_info' };
});


// Manejador de comando para registrar medicamentos
bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const userState = registeredUsers[userId];

  switch (userState?.state) {
    case 'waiting_for_medication_info':
      // Procesar la información del usuario
      const medicineData = ctx.message.text.split(':');
      if (medicineData.length !== 3) {
        ctx.reply('Lo siento, la información del medicamento no es válida. Por favor, inténtelo de nuevo.');
        return;
      }
      
      // Almacenar información del medicamento
      const medicine = {
        medicamento: medicineData[0],
        dosis: medicineData[1],
        frecuencia: medicineData[2],
      };
       
      if (!userState.medicines) {
        userState.medicines = [];
      }
      
      userState.medicines.push(medicine);
      
      // Confirmar registro del medicamento
      const medicineList = userState.medicines.map((medicine) => `${medicine.medicamento} de ${medicine.dosis} cada ${medicine.frecuencia}`).join('\n');
      ctx.reply(`El medicamento "${medicine.medicamento}" se ha registrado correctamente.\n\nRecibirás recordatorios para los siguientes medicamentos:\n\n<b>${medicineList}.</b>\n\n¿Deseas registrar otro medicamento?`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'Sí', callback_data: 'register_another_medicine' }], [{ text: 'No, finalizar registro', callback_data: 'finish_medicine_registration' }]] } });

      // Actualizar estado del registro
      registeredUsers[userId].state = 'waiting_for_register_another_medicine';
      break;

    case 'waiting_for_register_another_medicine':
      if (ctx.callbackQuery.data === 'register_another_medicine') {
        // Pedir información sobre otro medicamento
        ctx.reply('Proporciona información sobre otro medicamento en el siguiente formato:\n\n<b>medicamento:dosis:frecuencia</b>', { parse_mode: 'HTML' });
        // Actualizar estado del registro
        registeredUsers[userId].state = 'waiting_for_medication_info';
      } else if (ctx.callbackQuery.data === 'finish_medicine_registration') {
        // Finalizar el registro de medicamentos
        const medicineList = userState.medicines.map((medicine) => `${medicine.medicamento} de ${medicine.dosis} cada ${medicine.frecuencia}`).join('\n');
        ctx.reply(`Has finalizado el registro de medicamentos.\n\nRecibirás recordatorios para los siguientes medicamentos:\n\n<b>${medicineList}.</b>`, { parse_mode: 'HTML' });
        // Actualizar estado del registro
        registeredUsers[userId].state = null;
      }
      break;

    default:
      // Responder a cualquier otro mensaje de texto
      ctx.reply('No entendí lo que quisiste decir. Por favor, utiliza uno de los comandos disponibles.');
      break;
  }
});




bot.launch();