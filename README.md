# InterviewBank

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

## Servidor de desarrollo

Primero instala todas las dependencias del proyecto, ejecuta:

```bash
npm i
```

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a http://localhost:4200/.

## IMPORTANTE

El código backend proporcionado arrojaba una validación de CORS por lo que fue modificado para permitir peticiones desde esa ruta local.

Para evitar errores de CORS y ver la aplicación en correcto funcionamiento, es necesario reemplazar:

```
const app = createExpressServer({
	cors: false,
	routePrefix: '/bp',

	controllers: [__dirname + '/controllers/*{.js,.ts}']
})
```

por

```
const app = createExpressServer({
	cors: {
		origin: 'http://localhost:4200',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization']
	},
	routePrefix: '/bp',

	controllers: [__dirname + '/controllers/*{.js,.ts}']
})
```

## Compilación

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los archivos de compilación en el directorio dist/. Por defecto, la compilación de producción optimiza la aplicación para rendimiento y velocidad.

## Ejecución de pruebas unitarias

Para ejecutar pruebas unitarias con el Karma test runner, utiliza el siguiente comando:

```bash
ng test
```
