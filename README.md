# Pre-entrega NodeJS Backend Developer

Proyecto en el que se simula flujo de peticiones HTTP utilizando una API pública y metodos del módulo nativo `fs` de `NodeJS`. Es un proyecto necesario para la cursada del programa Talento Tech dictado por el Ministerio de Educación del GCBA.

## Instalación

Este proyecto esta desarrollado sobre la version de Node `24.1.0` y con `type: module`

No es necesario instalar dependencias.

Solo es necesario clonarlo y luego correr los comandos por consola.

## Scripts

Para correr el script sin errores es necesario que se envíen los argumentos
tal cual como se indican a continuación

#### Métodos

Listar todos los productos

```bash
npm run start GET products
```

Mostrar un producto específico

```bash
npm run start GET products/<id>
```

Crear un nuevo producto

```bash
npm run start POST products <title> <price> <category>
```

Eliminar un producto

```bash
npm run start DELETE products/<id>
```

## Ejemplos

```javascript
npm run start GET products
Devuelve por consola el listado completo de los productos.

npm run start GET products/1
Devuelve por consola el producto buscado.

npm run start DELETE products/1
Devuelve por consola el producto eliminado.

npm run start POST products "Saco de pana" 2300.00 abrigos
Devuelve por consola el producto creado.

Para poder enviar un `title` con espacios es necesario encerrarlo entre comillas dobles, como se ve en el ejemplo de arriba.
```

## Extra

Para simular una base de datos se debe tener en cuenta lo siguiente:

- Renombrar archivo `indexToFileVersion.js` a `index.js` (reescribir el existente o renombrarlo)

- Crear un archivo `db.json` en la raíz del proyecto

Con esto configurado solo resta usar los comandos como se explica en la sección "scripts"
