# 🔐 LA NUBE BOT - OAuth Callback

## GitHub Pages OAuth Solution

Este repositorio contiene el callback de OAuth para LA NUBE BOT, desplegado en GitHub Pages como alternativa confiable a Short.io.

### 🚀 URL de OAuth para Zoom:
```
https://[tu-usuario].github.io/oauth-callback/
```

### 📋 Configuración:

1. **Crear repositorio en GitHub:**
   - Nombre: `oauth-callback`
   - Público
   - Subir archivos de esta carpeta

2. **Activar GitHub Pages:**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Configurar Zoom OAuth:**
   - Redirect URL: `https://[tu-usuario].github.io/oauth-callback/`

4. **Probar:**
   - Acceder a la URL
   - Verificar que carga correctamente

### 🔧 Funcionalidades:

- ✅ Extrae código OAuth de URL
- ✅ Muestra código al usuario
- ✅ Intenta enviar al bot automáticamente
- ✅ Fallback manual si falla automático
- ✅ Diseño responsive y profesional
- ✅ Compatible con GitHub Pages (HTML/JS only)

### 🌐 Alternativas de Deploy:

- **Netlify:** `https://app.netlify.com/drop`
- **Vercel:** `https://vercel.com/new`
- **Firebase:** `https://firebase.google.com/docs/hosting`

### 🔄 Para actualizar:

1. Modificar archivos
2. Hacer commit y push
3. GitHub Pages se actualiza automáticamente
