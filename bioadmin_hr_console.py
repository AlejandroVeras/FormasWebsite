#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aplicación BioAdmin HR - Versión Consola
=======================================

Versión simplificada sin interfaz gráfica para mejor compatibilidad
en servidores y sistemas sin GUI.

Uso:
    python bioadmin_hr_console.py <archivo_bioadmin.csv>
    python bioadmin_hr_console.py --help
"""

import argparse
import sys
import os
from bioadmin_hr_app import BioadminHRProcessor
from datetime import datetime

def mostrar_banner():
    """Muestra el banner de la aplicación"""
    print("=" * 60)
    print("🏢 FORMAS - Sistema BioAdmin HR v2.0 (Consola)")
    print("=" * 60)
    print("📊 Procesamiento de Horas Trabajadas")
    print("🌍 Interfaz en Español - Manejo de Fechas Locales")
    print("=" * 60)

def mostrar_ayuda():
    """Muestra información de ayuda"""
    print("""
📖 GUÍA DE USO RÁPIDO

🚀 Ejecución Básica:
   python bioadmin_hr_console.py archivo_datos.csv

📁 Formatos Soportados:
   • CSV (.csv)
   • Excel (.xlsx, .xls)  
   • Texto (.txt)

📋 Estructura Esperada:
   Empleado,Fecha,Hora_Entrada,Hora_Salida
   Juan Pérez,15 de enero de 2024,08:00,17:00
   María García,16 de enero de 2024,08:30,17:30

📊 Salida:
   • Reporte Excel profesional
   • Análisis mensual por empleado
   • Estadísticas detalladas

💡 Ejemplos:
   python bioadmin_hr_console.py datos_enero.csv
   python bioadmin_hr_console.py datos_trimestre.xlsx -o reporte_q1.xlsx
   python bioadmin_hr_console.py --sample  # Generar archivo de ejemplo

📞 Soporte: Departamento IT - Grupo Formas
""")

def generar_archivo_ejemplo():
    """Genera un archivo de ejemplo para pruebas"""
    datos_ejemplo = """Empleado,Fecha,Hora_Entrada,Hora_Salida
Juan Pérez,15 de enero de 2024,08:00,17:00
María García,15 de enero de 2024,08:30,17:30
Carlos Rodríguez,15 de enero de 2024,09:00,18:00
Ana López,15 de enero de 2024,08:15,17:15
Juan Pérez,16 de enero de 2024,08:05,17:05
María García,16 de enero de 2024,08:25,17:25
Carlos Rodríguez,16 de enero de 2024,09:10,18:10
Ana López,16 de enero de 2024,08:20,17:20
Juan Pérez,17 de enero de 2024,08:00,16:30
María García,17 de enero de 2024,08:30,17:00
Carlos Rodríguez,17 de enero de 2024,09:00,17:45
Ana López,17 de enero de 2024,08:15,17:00
Juan Pérez,15 de febrero de 2024,08:10,17:10
María García,15 de febrero de 2024,08:35,17:35
Carlos Rodríguez,15 de febrero de 2024,09:05,18:05
Ana López,15 de febrero de 2024,08:25,17:25"""
    
    nombre_archivo = f"ejemplo_bioadmin_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
    
    try:
        with open(nombre_archivo, 'w', encoding='utf-8') as f:
            f.write(datos_ejemplo)
        
        print(f"✅ Archivo de ejemplo generado: {nombre_archivo}")
        print("💡 Puede usar este archivo para probar la aplicación")
        return True
    except Exception as e:
        print(f"❌ Error al generar archivo de ejemplo: {e}")
        return False

def procesar_archivo(archivo_entrada, archivo_salida=None):
    """Procesa un archivo BioAdmin y genera el reporte"""
    
    # Verificar que el archivo existe
    if not os.path.exists(archivo_entrada):
        print(f"❌ Error: El archivo '{archivo_entrada}' no existe")
        return False
    
    # Generar nombre de archivo de salida si no se especifica
    if not archivo_salida:
        nombre_base = os.path.splitext(os.path.basename(archivo_entrada))[0]
        archivo_salida = f"Reporte_HR_{nombre_base}_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    
    print(f"📁 Archivo entrada: {archivo_entrada}")
    print(f"📊 Archivo salida: {archivo_salida}")
    print()
    
    # Inicializar procesador
    print("⚙️ Inicializando procesador BioAdmin HR...")
    procesador = BioadminHRProcessor()
    
    try:
        # Paso 1: Leer archivo
        print("📖 Paso 1: Leyendo archivo BioAdmin...")
        if not procesador.leer_archivo_bioadmin(archivo_entrada):
            print("❌ Error al leer el archivo")
            if procesador.errores:
                for error in procesador.errores:
                    print(f"   {error}")
            return False
        
        print("✅ Archivo leído correctamente")
        
        # Paso 2: Procesar datos
        print("⚙️ Paso 2: Procesando horas trabajadas...")
        if not procesador.procesar_horas_trabajadas():
            print("❌ Error al procesar datos")
            if procesador.errores:
                for error in procesador.errores:
                    print(f"   {error}")
            return False
        
        # Mostrar estadísticas básicas
        if procesador.resumen_mensual is not None:
            total_empleados = len(procesador.resumen_mensual[
                procesador.resumen_mensual.columns[0]].unique())
            total_registros = len(procesador.resumen_mensual)
            
            print("✅ Datos procesados correctamente")
            print(f"👥 Empleados procesados: {total_empleados}")
            print(f"📊 Registros mensuales: {total_registros}")
            
            # Mostrar resumen por empleado
            print("\n📋 Resumen por empleado:")
            for empleado in procesador.resumen_mensual[procesador.resumen_mensual.columns[0]].unique():
                datos_emp = procesador.resumen_mensual[
                    procesador.resumen_mensual[procesador.resumen_mensual.columns[0]] == empleado
                ]
                total_horas = datos_emp['total_horas'].sum()
                meses_trabajados = len(datos_emp)
                print(f"   • {empleado}: {total_horas:.1f} horas en {meses_trabajados} mes(es)")
        
        # Paso 3: Generar reporte Excel
        print(f"\n📊 Paso 3: Generando reporte Excel...")
        if not procesador.generar_reporte_excel(archivo_salida):
            print("❌ Error al generar reporte Excel")
            if procesador.errores:
                for error in procesador.errores:
                    print(f"   {error}")
            return False
        
        print("✅ Reporte Excel generado exitosamente")
        print(f"📄 Ubicación: {os.path.abspath(archivo_salida)}")
        print(f"💾 Tamaño: {os.path.getsize(archivo_salida):,} bytes")
        
        return True
        
    except Exception as e:
        print(f"❌ Error durante el procesamiento: {str(e)}")
        return False

def main():
    """Función principal de la aplicación consola"""
    parser = argparse.ArgumentParser(
        description='Sistema BioAdmin HR - Procesamiento de Horas Trabajadas',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  python bioadmin_hr_console.py datos.csv
  python bioadmin_hr_console.py datos.xlsx -o reporte_enero.xlsx
  python bioadmin_hr_console.py --sample
  python bioadmin_hr_console.py --help-full

© 2024 Grupo Formas - Sistema BioAdmin HR v2.0
        """
    )
    
    parser.add_argument('archivo', nargs='?', 
                       help='Archivo BioAdmin a procesar (.csv, .xlsx, .txt)')
    parser.add_argument('-o', '--output', 
                       help='Archivo de salida para el reporte Excel')
    parser.add_argument('--sample', action='store_true',
                       help='Generar archivo de ejemplo para pruebas')
    parser.add_argument('--help-full', action='store_true',
                       help='Mostrar ayuda completa con ejemplos')
    parser.add_argument('--version', action='version', version='BioAdmin HR v2.0')
    
    args = parser.parse_args()
    
    # Mostrar banner
    mostrar_banner()
    
    # Verificar dependencias
    try:
        import pandas
        import openpyxl
        import numpy
    except ImportError as e:
        print(f"❌ Error: Dependencia faltante - {e}")
        print("💡 Instale con: pip install pandas openpyxl numpy")
        return 1
    
    # Procesar argumentos
    if args.help_full:
        mostrar_ayuda()
        return 0
    
    if args.sample:
        if generar_archivo_ejemplo():
            return 0
        else:
            return 1
    
    if not args.archivo:
        print("❌ Error: Debe especificar un archivo para procesar")
        print("💡 Use --help para ver opciones disponibles")
        return 1
    
    # Procesar archivo principal
    print(f"🚀 Iniciando procesamiento...")
    print()
    
    if procesar_archivo(args.archivo, args.output):
        print()
        print("🎉 ¡Procesamiento completado exitosamente!")
        print("📊 Revise el reporte Excel generado para ver los resultados")
        return 0
    else:
        print()
        print("💥 El procesamiento falló")
        print("💡 Verifique el formato del archivo y vuelva a intentar")
        return 1

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n⚠️ Procesamiento cancelado por el usuario")
        print("👋 Hasta luego!")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error crítico: {e}")
        sys.exit(1)