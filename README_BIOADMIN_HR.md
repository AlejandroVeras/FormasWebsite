# 🏢 Sistema BioAdmin HR - FORMAS

## 🚀 Inicio Rápido

### Instalación
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar versión consola (recomendado)
python bioadmin_hr_console.py archivo_datos.csv

# Ejecutar versión GUI (requiere tkinter)
python bioadmin_hr_app.py
```

### Uso Básico
```bash
# Generar archivo de ejemplo
python bioadmin_hr_console.py --sample

# Procesar archivo de datos
python bioadmin_hr_console.py sample_bioadmin_data.csv

# Ver ayuda completa
python bioadmin_hr_console.py --help-full
```

## 📁 Archivos del Sistema

| Archivo | Descripción |
|---------|-------------|
| `bioadmin_hr_app.py` | Aplicación principal con interfaz gráfica |
| `bioadmin_hr_console.py` | Versión de consola (recomendada) |
| `requirements.txt` | Dependencias de Python |
| `BIOADMIN_HR_DOCUMENTATION.md` | Documentación completa |
| `sample_bioadmin_data.csv` | Archivo de datos de ejemplo |

## ✨ Características Principales

### ✅ **Problemas Resueltos**

1. **✅ Cálculo y visualización de horas mensuales**
   - Agrupación automática por empleado y mes
   - Totales, promedios y estadísticas detalladas

2. **✅ Formato profesional de reportes Excel**
   - Múltiples hojas con análisis completo
   - Colores, bordes, y formato empresarial
   - Ajuste automático de columnas

3. **✅ Traducción completa al español**
   - Interfaz 100% en español
   - Mensajes de error y ayuda en español
   - Formatos de fecha localizados

4. **✅ Corrección de error "Invalid literal for int() with base 10: 'Septiembre'"**
   - Procesamiento correcto de fechas en español
   - Soporte para múltiples formatos de fecha
   - Manejo robusto de errores de conversión

5. **✅ Lectura de archivos BioAdmin y reportes de permisos**
   - Soporte para CSV, Excel, y archivos de texto
   - Detección automática de encoding
   - Validación de estructura de archivos

6. **✅ Interfaz fácil de usar para RRHH**
   - Interfaz gráfica intuitiva
   - Versión de consola para servidores
   - Documentación completa incluida

### 🎯 **Funcionalidades Avanzadas**

- **📊 Reportes Multi-hoja**: Resumen ejecutivo, análisis mensual, estadísticas por empleado
- **🎨 Formato Condicional**: Colores automáticos para alertas y patrones inusuales
- **🔍 Validación Robusta**: Verifica archivos, datos y genera reportes de errores
- **🌐 Compatibilidad**: Funciona en Windows, Mac, y Linux
- **📈 Análisis Estadístico**: Promedios, desviaciones, tendencias y comparativas

## 📊 Formato de Reportes Excel

### Hojas Incluidas:
1. **📊 Resumen Ejecutivo** - Estadísticas generales y métricas clave
2. **📅 Detalle Mensual** - Horas por empleado por mes con filtros
3. **👥 Análisis por Empleado** - Comparativas y estadísticas individuales  
4. **📈 Estadísticas y Gráficos** - Análisis de tendencias mensuales

### Códigos de Color:
- 🔵 **Azul**: Encabezados y títulos
- 🟡 **Amarillo**: Totales y resúmenes
- 🔴 **Rojo**: Alertas (menos de 120 horas/mes)
- 🟢 **Verde**: Valores normales
- 🔷 **Azul Claro**: Información especial (más de 200 horas/mes)

## 🛠️ Solución de Problemas

### Errores Comunes Resueltos:

#### ❌ "Invalid literal for int() with base 10: 'Septiembre'"
**✅ SOLUCIONADO** - El sistema ahora procesa correctamente todos los meses en español

#### ❌ "No se encontraron las columnas básicas necesarias"  
**Solución**: El sistema busca automáticamente columnas con nombres similares (empleado, nombre, usuario, etc.)

#### ❌ "El archivo está vacío"
**Solución**: Verificación automática de archivos antes del procesamiento

## 📞 Soporte

Para soporte técnico, consulte:
1. `BIOADMIN_HR_DOCUMENTATION.md` - Documentación completa
2. `python bioadmin_hr_console.py --help-full` - Ayuda integrada
3. Departamento IT - Grupo Formas

---

## 📝 Ejemplo de Uso Completo

```bash
# 1. Generar datos de ejemplo
python bioadmin_hr_console.py --sample

# 2. Procesar los datos generados
python bioadmin_hr_console.py ejemplo_bioadmin_*.csv

# 3. El reporte Excel se genera automáticamente
# Ubicación: Reporte_HR_ejemplo_bioadmin_*_*.xlsx
```

**Desarrollado para Grupo Formas** 🏢  
*Sistema BioAdmin HR v2.0 - Facilitando la gestión de recursos humanos*