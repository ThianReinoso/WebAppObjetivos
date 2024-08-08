// Mostrar el formulario de login
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Login')
      .setTitle('Inicio de Sesión');
}

// Validar el login de usuarios y devolver una señal
function validarUsuario(usuario, password) {
  try {
    const sheet = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Usuarios');
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) { // Empezar en 1 para saltar el encabezado
      if (data[i][4] === usuario && data[i][5].toString() === password) { // Columnas E y F en la hoja de usuarios
        PropertiesService.getUserProperties().setProperty('usuarioActual', usuario); // Almacenar el usuario actual
        PropertiesService.getUserProperties().setProperty('cargoActual', data[i][2]); // Almacenar el cargo actual
        PropertiesService.getUserProperties().setProperty('areaActual', data[i][3]); // Almacenar el área actual
        PropertiesService.getUserProperties().setProperty('rolActual', data[i][6]); // Almacenar el rol actual
        Logger.log('Usuario validado con éxito: ' + usuario);
        return 'success';
      }
    }
    return 'fail';
  } catch (e) {
    Logger.log('Error en la validación: ' + e.toString());
    return 'error';
  }
}

// Función para cargar la página de registro de objetivos
function cargarRegistroObjetivos() {
  return HtmlService.createHtmlOutputFromFile('registroObjetivos')
      .setTitle('Registro de Objetivos')
      .getContent();
}

// Obtener el usuario actual
function obtenerUsuarioActual() {
  const usuarioActual = PropertiesService.getUserProperties().getProperty('usuarioActual');
  Logger.log('Obteniendo usuario actual: ' + usuarioActual);
  return usuarioActual;
}

// Obtener la fecha actual y el último día del mes actual
function obtenerFechas() {
  const hoy = new Date();
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  Logger.log('Fecha Actual (servidor): ' + Utilities.formatDate(hoy, 'GMT-5', 'yyyy-MM-dd'));
  Logger.log('Último día del mes (servidor): ' + Utilities.formatDate(ultimoDiaMes, 'GMT-5', 'yyyy-MM-dd'));
  return {
    fechaActual: Utilities.formatDate(hoy, 'GMT-5', 'yyyy-MM-dd'),
    ultimoDiaMes: Utilities.formatDate(ultimoDiaMes, 'GMT-5', 'yyyy-MM-dd')
  };
}

// Función para registrar el objetivo en la hoja Objetivos
function registrarObjetivo(tipo, actividades, fechaLimite, tareas) {
  try {
    const usuarioActual = PropertiesService.getUserProperties().getProperty('usuarioActual');
    const cargoActual = PropertiesService.getUserProperties().getProperty('cargoActual');
    const areaActual = PropertiesService.getUserProperties().getProperty('areaActual');
    const rolActual = PropertiesService.getUserProperties().getProperty('rolActual');
    const sheetObjetivos = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Objetivos');
    const sheetTareas = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Tareas');
    const fechas = obtenerFechas();
    const id = generateUniqueId(sheetObjetivos);

    sheetObjetivos.appendRow([id, usuarioActual, cargoActual, areaActual, rolActual, tipo, actividades, fechas.fechaActual, fechaLimite]);
    for (let i = 0; i < tareas.length; i++) {
      if (tareas[i]) {
        sheetTareas.appendRow([id, i + 1, tareas[i]]);
      }
    }

    Logger.log('Objetivo registrado con éxito: ' + [id, usuarioActual, cargoActual, areaActual, rolActual, tipo, actividades, fechas.fechaActual, fechaLimite]);
  } catch (e) {
    Logger.log('Error al registrar objetivo: ' + e.toString());
  }
}

// Generar un ID único para cada objetivo
function generateUniqueId(sheet) {
  const data = sheet.getDataRange().getValues();
  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const id = parseInt(data[i][0], 10);
    if (id > maxId) {
      maxId = id;
    }
  }
  return maxId + 1;
}

// Obtener los objetivos del usuario actual
function obtenerObjetivosUsuario() {
  try {
    const usuarioActual = PropertiesService.getUserProperties().getProperty('usuarioActual');
    const sheetObjetivos = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Objetivos');
    const sheetTareas = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Tareas');
    const dataObjetivos = sheetObjetivos.getDataRange().getValues();
    const dataTareas = sheetTareas.getDataRange().getValues();

    const objetivosUsuario = dataObjetivos.filter(row => row[1] === usuarioActual).map(row => {
      const id = row[0];
      const tareas = dataTareas.filter(tarea => tarea[0] == id).map(tarea => ({
        semana: tarea[1],
        tarea: tarea[2],
        evidencia: tarea[3]
      }));
      return [
        id,
        row[5], // Tipo
        row[6], // Actividades
        tareas,
        formatDate(row[7]), // Fecha Propuesta
        formatDate(row[8]), // Fecha Límite
        id // ID para las acciones
      ];
    });

    Logger.log('Objetivos obtenidos: ' + JSON.stringify(objetivosUsuario)); // Para depuración
    return objetivosUsuario;
  } catch (e) {
    Logger.log('Error al obtener objetivos: ' + e.toString());
    return [];
  }
}

// Obtener un objetivo específico por ID
function obtenerObjetivoPorId(id) {
  try {
    const sheetObjetivos = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Objetivos');
    const sheetTareas = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Tareas');
    const dataObjetivos = sheetObjetivos.getDataRange().getValues();
    const dataTareas = sheetTareas.getDataRange().getValues();

    const objetivo = dataObjetivos.find(row => row[0] == id);
    if (objetivo) {
      const tareas = dataTareas.filter(tarea => tarea[0] == id).map(tarea => ({
        semana: tarea[1],
        tarea: tarea[2],
        evidencia: tarea[3]
      }));
      return {
        id: objetivo[0],
        tipo: objetivo[5],
        actividades: objetivo[6],
        fechaPropuesta: formatDate(objetivo[7]),
        fechaLimite: formatDate(objetivo[8]),
        tareas: tareas
      };
    }
    return null;
  } catch (e) {
    Logger.log('Error al obtener objetivo por ID: ' + e.toString());
    return null;
  }
}

// Formatear la fecha a YYYY-MM-DD en la zona horaria de Lima, Perú (UTC-5)
function formatDate(date) {
  const d = new Date(date);
  const formattedDate = Utilities.formatDate(d, 'GMT-5', 'yyyy-MM-dd');
  Logger.log('Fecha formateada (servidor): ' + formattedDate);
  return formattedDate;
}

// Registrar la fecha de aprobación del objetivo
function aprobarObjetivo(id) {
  const sheet = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Objetivos');
  const data = sheet.getDataRange().getValues();
  const today = new Date();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      sheet.getRange(i + 1, 10).setValue(Utilities.formatDate(today, 'GMT-5', 'yyyy-MM-dd')); // Columna de Fecha de Aprobación
      Logger.log('Fecha de aprobación registrada: ' + Utilities.formatDate(today, 'GMT-5', 'yyyy-MM-dd'));
      break;
    }
  }
}

// Eliminar un objetivo de la hoja
function eliminarObjetivo(id) {
  const sheetObjetivos = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Objetivos');
  const sheetTareas = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Tareas');
  const dataObjetivos = sheetObjetivos.getDataRange().getValues();
  const dataTareas = sheetTareas.getDataRange().getValues();

  for (let i = 1; i < dataObjetivos.length; i++) {
    if (dataObjetivos[i][0] == id) {
      sheetObjetivos.deleteRow(i + 1);
      break;
    }
  }

  for (let i = dataTareas.length - 1; i > 0; i--) {
    if (dataTareas[i][0] == id) {
      sheetTareas.deleteRow(i + 1);
    }
  }
}

// Editar un objetivo
function editarObjetivo(id, nuevoTipo, nuevasActividades, nuevoFechaLimite, nuevasTareas) {
  const sheetObjetivos = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Objetivos');
  const sheetTareas = SpreadsheetApp.openById('1CCABwpcfkioxML0SDGgf55hpgq6eCiztTT6MqT7ndzc').getSheetByName('Tareas');
  const dataObjetivos = sheetObjetivos.getDataRange().getValues();
  const dataTareas = sheetTareas.getDataRange().getValues();

  for (let i = 1; i < dataObjetivos.length; i++) {
    if (dataObjetivos[i][0] == id) {
      sheetObjetivos.getRange(i + 1, 6).setValue(nuevoTipo); // Columna Tipo
      sheetObjetivos.getRange(i + 1, 7).setValue(nuevasActividades); // Columna Actividades
      sheetObjetivos.getRange(i + 1, 9).setValue(Utilities.formatDate(new Date(nuevoFechaLimite), 'GMT-5', 'yyyy-MM-dd')); // Columna Fecha Límite
      break;
    }
  }

  const tareasExistentes = dataTareas.filter(tarea => tarea[0] == id);
  const numTareasExistentes = tareasExistentes.length;

  for (let i = 0; i < nuevasTareas.length; i++) {
    if (nuevasTareas[i]) {
      if (i < numTareasExistentes) {
        sheetTareas.getRange(tareasExistentes[i][0], 3).setValue(nuevasTareas[i]);
      } else {
        sheetTareas.appendRow([id, i + 1, nuevasTareas[i]]);
      }
    }
  }
}
