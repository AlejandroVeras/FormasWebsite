# 🏢 Sistema BioAdmin HR - FORMAS

## 📖 Descripción General

El Sistema BioAdmin HR es una aplicación Python especializada para procesar archivos de BioAdmin y generar reportes profesionales de horas trabajadas para el departamento de Recursos Humanos de FORMAS.

### ✨ Características Principales

- **📊 Procesamiento Avanzado**: Lee archivos CSV, Excel y texto de BioAdmin
- **🗓️ Análisis Mensual**: Calcula y agrupa horas trabajadas por mes
- **📈 Reportes Profesionales**: Genera archivos Excel con formato profesional
- **🌍 Interfaz en Español**: Totalmente traducido y localizado
- **🔧 Manejo de Fechas**: Procesa correctamente fechas en formato español
- **🎯 Interfaz Gráfica**: Interfaz de usuario intuitiva y fácil de usar
- **⚡ Validación Robusta**: Validación exhaustiva de archivos y datos

## 🚀 Instalación y Configuración

### Requisitos del Sistema

- Python 3.7 o superior
- Sistema operativo: Windows, macOS, o Linux
- Memoria RAM: Mínimo 4GB recomendado

### 📦 Instalación de Dependencias

```bash
# Instalar dependencias requeridas
pip install pandas openpyxl numpy

# O usando el archivo requirements.txt
pip install -r requirements.txt
```

### ⚙️ Ejecución de la Aplicación

```bash
# Ejecutar la aplicación
python bioadmin_hr_app.py
```

## 📋 Uso de la Aplicación

### 1️⃣ Preparación de Archivos

#### Formatos Soportados
- **CSV** (.csv): Separados por comas, punto y coma, o tabulación
- **Excel** (.xlsx, .xls): Archivos de Microsoft Excel
- **Texto** (.txt): Archivos de texto delimitados

#### Estructura Esperada del Archivo

El archivo debe contener las siguientes columnas (nombres flexibles):

| Columna Requerida | Nombres Aceptados | Descripción |
|-------------------|-------------------|-------------|
| **Empleado** | `empleado`, `nombre`, `usuario`, `trabajador` | Identificación del empleado |
| **Fecha** | `fecha`, `date`, `dia` | Fecha del registro |
| **Hora Entrada** | `entrada`, `inicio`, `llegada`, `start` | Hora de entrada (opcional) |
| **Hora Salida** | `salida`, `fin`, `end` | Hora de salida (opcional) |

#### Ejemplo de Archivo CSV:
```csv
Empleado,Fecha,Hora_Entrada,Hora_Salida
Juan Pérez,15 de enero de 2024,08:00,17:00
María García,16 de enero de 2024,08:30,17:30
Carlos Rodríguez,17 de enero de 2024,09:00,18:00
```

### 2️⃣ Proceso de Trabajo

#### Paso 1: Seleccionar Archivo
1. Haga clic en **"🔍 Seleccionar Archivo BioAdmin"**
2. Navegue y seleccione su archivo de datos
3. El sistema validará automáticamente el formato

#### Paso 2: Procesar Datos
1. Haga clic en **"🔄 Procesar Datos"**
2. El sistema analizará el archivo y calculará:
   - Horas trabajadas por día
   - Totales mensuales por empleado
   - Estadísticas generales

#### Paso 3: Generar Reporte
1. Haga clic en **"📊 Generar Reporte Excel"**
2. Seleccione la ubicación donde guardar el archivo
3. El reporte se generará automáticamente

### 3️⃣ Interpretación de Reportes

#### 📊 Resumen Ejecutivo
- Información general del período analizado
- Estadísticas globales de horas trabajadas
- Métricas clave por empleado

#### 📅 Detalle Mensual
- Horas trabajadas por empleado por mes
- Días trabajados en cada período
- Promedio diario de horas
- Códigos de color para identificar patrones

#### 👥 Análisis por Empleado
- Totales acumulados por empleado
- Promedios mensuales y desviaciones
- Comparativas entre empleados

#### 📈 Estadísticas y Gráficos
- Resúmenes mensuales globales
- Tendencias de horas trabajadas
- Análisis estadístico avanzado

## 🎨 Formateado del Reporte Excel

### Códigos de Color

| Color | Significado |
|-------|-------------|
| 🔵 **Azul** | Encabezados y títulos |
| 🟡 **Amarillo** | Totales y resúmenes |
| 🔴 **Rojo** | Alertas (menos de 120 horas/mes) |
| 🟢 **Verde** | Valores exitosos |
| 🟦 **Azul Claro** | Información (más de 200 horas/mes) |

### Características del Formato

- **Autoajuste de Columnas**: Las columnas se ajustan automáticamente
- **Filtros Automáticos**: Cada hoja incluye filtros para análisis
- **Bordes y Estilos**: Formato profesional para presentación
- **Encabezados Fijos**: Navegación fácil en hojas grandes

## 🔧 Características Técnicas

### Manejo de Fechas en Español

El sistema reconoce automáticamente los siguientes formatos de fecha:

- **Formato Completo**: "15 de enero de 2024"
- **Formato Abreviado**: "15/ene/2024"
- **Formato Numérico**: "15/01/2024", "2024-01-15"
- **Variaciones**: "15-enero-2024", etc.

### Cálculo de Horas

- **Con Horas de Entrada/Salida**: Calcula la diferencia exacta
- **Sin Horas**: Asume 8 horas por día como estándar
- **Validación**: Verifica rangos razonables (0-24 horas)
- **Manejo de Errores**: Usa valores por defecto para datos incompletos

### Validaciones del Sistema

✅ **Validación de Archivos**
- Verifica existencia del archivo
- Comprueba formato y estructura
- Detecta encoding automáticamente

✅ **Validación de Datos**
- Verifica columnas requeridas
- Valida formatos de fecha y hora
- Elimina registros incompletos

✅ **Validación de Resultados**
- Comprueba rangos de horas razonables
- Verifica consistencia de datos
- Alerta sobre anomalías

## 🆘 Solución de Problemas

### Errores Comunes

#### "Invalid literal for int() with base 10: 'Septiembre'"
**Causa**: El sistema está intentando convertir un nombre de mes como número
**Solución**: ✅ **Resuelto** - El sistema ahora maneja correctamente los meses en español

#### "No se encontraron las columnas básicas necesarias"
**Causa**: Las columnas del archivo no coinciden con los nombres esperados
**Solución**: 
- Verifique que el archivo tenga columnas de Empleado y Fecha
- Renombre las columnas si es necesario
- Use los nombres sugeridos en la documentación

#### "El archivo está vacío"
**Causa**: El archivo no contiene datos o no se pudo leer
**Solución**:
- Verifique que el archivo tenga datos
- Compruebe que no esté corrupto
- Intente con un formato diferente (CSV vs Excel)

### 💡 Consejos de Optimización

1. **Archivos Grandes**: Para archivos con más de 10,000 registros, el procesamiento puede tomar varios minutos
2. **Memoria**: Cierre otras aplicaciones si procesa archivos muy grandes
3. **Formato**: Use CSV para mejor compatibilidad y velocidad
4. **Encoding**: Si hay caracteres especiales, guarde en UTF-8

### 📞 Soporte Técnico

Para soporte técnico adicional:
- Consulte el registro de actividad en la aplicación
- Revise los mensajes de error específicos
- Contacte al departamento de IT de FORMAS

## 📝 Registro de Cambios

### Versión 2.0 (Actual)
- ✅ Interfaz completamente traducida al español
- ✅ Corrección del error de procesamiento de fechas en español
- ✅ Mejorado el formato profesional de reportes Excel
- ✅ Agregado cálculo y visualización de horas mensuales
- ✅ Implementada validación robusta de archivos
- ✅ Interfaz gráfica mejorada con mejor UX
- ✅ Documentación completa en español

### Mejoras Implementadas
- 🎯 **Agrupación Mensual**: Los datos se agrupan automáticamente por mes
- 🎨 **Formato Profesional**: Reportes Excel con colores, bordes y estilos
- 🌍 **Localización**: Totalmente en español con manejo de fechas locales
- 🔍 **Validación Exhaustiva**: Verifica archivos y datos antes del procesamiento
- 📊 **Estadísticas Avanzadas**: Incluye análisis estadístico detallado
- 🖥️ **Interfaz Mejorada**: GUI más intuitiva y profesional

## 📄 Licencia y Derechos

© 2024 Grupo Formas. Todos los derechos reservados.

Esta aplicación es propiedad exclusiva de Grupo Formas y está destinada para uso interno del departamento de Recursos Humanos.

---

**Desarrollado para FORMAS** 🏢  
*Sistema BioAdmin HR v2.0*  
*Facilitando la gestión de recursos humanos*