# SnapExpense

SnapExpense es una aplicacion construida con Nuxt que convierte fotos de recibos o tickets en registros de gastos estructurados. Subes una imagen, el servidor la envia a Gemini para extraer la informacion y luego el resultado puede revisarse, editarse, guardarse en MongoDB y administrarse desde la lista de gastos.

## Que Hace La App

- Permite subir imagenes de recibos o tickets desde la interfaz.
- Extrae campos estructurados con Gemini usando un esquema JSON estricto.
- Permite revisar y editar los datos extraidos antes de guardarlos.
- Guarda los gastos en MongoDB.
- Muestra los gastos guardados y permite verlos, editarlos, recargarlos y eliminarlos.

## Stack Tecnologico

- Nuxt 4
- Vue 3
- Nuxt UI
- Gemini API via `@google/generative-ai`
- MongoDB
- Zod para validacion de esquemas

## Configuracion

Instala las dependencias:

```bash
pnpm install
```

Crea un archivo `.env` en la raiz del proyecto:

```bash
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=SnapExpense
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NUXT_PUBLIC_SITE_NAME=SnapExpense
```

## Variables De Entorno

- `GEMINI_API_KEY`: API key de Gemini usada en el servidor para la extraccion de tickets.
- `GEMINI_MODEL`: Nombre del modelo de Gemini. Debe soportar entrada de imagen y salida JSON estructurada.
- `MONGODB_URI`: Cadena de conexion a MongoDB.
- `MONGODB_DB_NAME`: Nombre de la base de datos usada por la aplicacion.
- `NUXT_PUBLIC_SITE_URL`: URL publica base de la app Nuxt.
- `NUXT_PUBLIC_SITE_NAME`: Nombre publico de la aplicacion usado en la configuracion runtime.

El modelo predeterminado en este proyecto es `gemini-2.5-flash`.

## Desarrollo

Inicia el servidor de desarrollo en `http://localhost:3000`:

```bash
pnpm dev
```

## Flujo De Uso

1. Abre la aplicacion y sube una imagen del ticket.
2. Haz clic en `Extraer datos` para enviar la imagen a `/api/extract`.
3. El servidor reenvia la imagen a Gemini como `inlineData` y solicita una respuesta JSON estructurada.
4. La informacion extraida se valida contra el esquema compartido.
5. Revisa y edita el resultado en el formulario antes de guardarlo.
6. Los registros guardados se almacenan en la coleccion `expenses` de MongoDB y se muestran en la lista principal.

## Scripts Disponibles

```bash
pnpm dev
pnpm build
pnpm preview
pnpm generate
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:unit
pnpm test:nuxt
pnpm test:e2e
pnpm test:e2e:ui
```

## Notas

- Las solicitudes a Gemini se ejecutan en el servidor, por lo que la API key no se expone al navegador.
- Los registros extraidos incluyen comercio, fecha de compra, moneda, totales, metodo de pago, numero de factura, articulos y notas de OCR.
- Los gastos se almacenan en una sola coleccion de MongoDB llamada `expenses`.
- Si el modelo Gemini seleccionado no soporta salidas estructuradas o entrada de imagen, la extraccion fallara y la API devolvera ese error.

## Produccion

Compila la aplicacion:

```bash
pnpm build
```

Previsualiza localmente la compilacion de produccion:

```bash
pnpm preview
```
