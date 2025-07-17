# Agente Secreto - Juego de Mesa Digital

Una versión web del popular juego de mesa Codenames (Agente Secreto), optimizada para dispositivos móviles y tablets.

## Características

- 🎮 Juego completo de Agente Secreto con reglas auténticas
- 📱 Diseño móvil-first optimizado para teléfonos y tablets
- 🎨 Animaciones fluidas para revelar cartas
- 🔄 Rotación de pantalla para mejor visualización
- 🏆 Sistema de puntuación automático
- 🌐 +400 palabras en español
- 👥 Vista especial para líderes de equipo

## Cómo Jugar

1. Haz clic en "¡EMPEZAR JUEGO!"
2. Los líderes de equipo hacen clic en "OK - VER COLORES" para ver la distribución
3. Toma una foto o captura de pantalla de los colores
4. Haz clic en "EMPEZAR JUEGO" para comenzar
5. Los equipos se turnan para adivinar sus palabras
6. Gana el equipo que encuentre todas sus palabras primero
7. ¡Cuidado con el asesino (carta negra)!

## Despliegue en Vercel

### Opción 1: Despliegue con un clic
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/agente-secreto)

### Opción 2: Despliegue manual

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. En la carpeta del proyecto:
```bash
vercel
```

3. Sigue las instrucciones en pantalla

### Opción 3: Desde GitHub

1. Sube el código a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. ¡Listo! Tu juego estará disponible en línea

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar producción local
npm start
```

## Tecnologías Utilizadas

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vercel para hosting

## Controles del Juego

- **COLORES**: Vista de emergencia para líderes (5 segundos)
- **ROTAR**: Cambia entre orientación vertical y horizontal
- **NUEVO**: Comienza un nuevo juego

## Notas para Móviles

- La aplicación está optimizada para uso táctil
- Previene el zoom accidental
- Funciona en modo offline una vez cargada
- Orientación automática según preferencia del usuario