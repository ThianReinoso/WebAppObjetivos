# WebAppObjetivos
# Registro de Objetivos con Tareas Semanales

![Logo del Proyecto](https://via.placeholder.com/800x200.png?text=Registro+de+Objetivos+con+Tareas+Semanales)

Este proyecto es una aplicación web desarrollada con Google Apps Script y HTML para gestionar objetivos y sus tareas semanales. Permite a los usuarios iniciar sesión, registrar objetivos con tareas semanales, adjuntar evidencias y visualizar los objetivos en un formato de tabla interactiva.

## Características

- Registro de objetivos con tareas semanales.
- Edición y eliminación de objetivos.
- Adjuntar evidencias en formato PDF, Word o imágenes.
- Visualización de objetivos en una tabla interactiva.
- Almacenamiento de datos en Google Sheets.
- Subida de archivos a Google Drive.

## Capturas de Pantalla

### Pantalla de Inicio de Sesión
![Inicio de Sesión](https://via.placeholder.com/800x400.png?text=Inicio+de+Sesion)

### Registro de Objetivos
![Registro de Objetivos](https://via.placeholder.com/800x400.png?text=Registro+de+Objetivos)

### Tabla de Objetivos
![Tabla de Objetivos](https://via.placeholder.com/800x400.png?text=Tabla+de+Objetivos)

## Instalación

Sigue estos pasos para instalar y configurar el proyecto en tu Google Drive:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/registro-de-objetivos.git

## Instalación

### Accede a Google Apps Script:

1. Ve a [Google Apps Script](https://script.google.com/).
2. Crea un nuevo proyecto y copia el contenido de los archivos `.gs` y `.html` en los respectivos archivos del proyecto en Google Apps Script.

### Configura Google Sheets:

1. Crea una nueva hoja de cálculo en Google Sheets.
2. Añade las hojas `Usuarios`, `Objetivos` y `Tareas` con las estructuras especificadas en la documentación del código.

### Autoriza el script:

1. Ejecuta cualquier función en el editor de Google Apps Script para que te pida autorización.
2. Acepta los permisos necesarios.

### Implementa la aplicación web:

1. Ve a `Deploy > Test deployments` y configura la URL de despliegue para que puedas acceder a la aplicación.

## Uso

### Iniciar Sesión

1. Abre la URL de la aplicación web implementada.
2. Introduce tus credenciales para iniciar sesión.

### Registrar Objetivos

1. Haz clic en el botón "Registrar Nuevo Objetivo".
2. Llena el formulario con los detalles del objetivo y las tareas semanales.
3. Adjunta evidencias si es necesario y haz clic en "Registrar Objetivo".

### Visualizar y Gestionar Objetivos

1. La tabla mostrará los objetivos registrados.
2. Usa los botones de acción para editar, eliminar o aprobar objetivos.

## Contribución

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature-nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para obtener más información.
