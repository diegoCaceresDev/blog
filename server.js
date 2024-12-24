const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 4200;

// Sirve los archivos estáticos desde el directorio dist
app.use(express.static(path.join(__dirname, "dist/blog-frontend/browser")));

// Maneja todas las rutas no definidas y redirige a la aplicación Angular
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "dist/blog-frontend/browser", "index.html")
  );
  console.log(
    "Ruta del directorio estático: ",
    path.join(__dirname, "dist/blog-frontend/browser")
  );
  console.log(
    "Ruta del archivo index.html: ",
    path.join(__dirname, "dist/blog-frontend/browser", "index.html")
  );
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
