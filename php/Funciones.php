<?php
/*
 * @Proyecto: iRMqrScanner v1.3
 *  iRM
       (Internal relationship management)
 *     [Gestion de relaciones internas]
 * @Autor: bypetterpotten
 * @Fecha: Julio 2022
 * 
 * @ig: @bypetterpotten
 */

    ini_set('display_startup_errors',1);
    ini_set('display_errors',1);
    error_reporting(-1);
    
    $Regresa = "";
     $Accion = $_POST['Accion'];
    //$Accion = isset($_POST['Accion']);
 
/////////////////////////////////////////////////////////////////////////////////////////
//Selector Multiple de la variable $Accion para las funciones .post de script.js
/////////////////////////////////////////////////////////////////////////////////////////
    switch($Accion)
    {
        //Login
        case "Login":$Regresa = Login();break;
        //QrScanner
        case "Consulta_Qr":$Regresa = Consulta_Qr();break; 
        case "Agregar_RegistroQr":$Regresa = Agregar_RegistroQr();break; 
        case "Listar_RegistroQr":$Regresa = Listar_RegistroQr();break; 
        //Bandejas
        case "Listar_Bandeja_Buscar":$Regresa = Listar_Bandeja_Buscar();break;
        //Administrador - Usuarios
        case "Listar_Usuarios":$Regresa = Listar_Usuarios();break; 
        case "Listar_cmb_Usarios_Sucursal":$Regresa = Listar_cmb_Usarios_Sucursal();break;
        case "Actualizar_Usuario":$Regresa = Actualizar_Usuario();break; 
        case "Agregar_Usuario":$Regresa = Agregar_Usuario();break;
        case "Eliminar_Usuario":$Regresa = Eliminar_Usuario();break;
        //Administrador - Empleados
        case "Listar_Empleados":$Regresa = Listar_Empleados();break;
        case "Listar_cmb_Empleados_Sucursal":$Regresa = Listar_cmb_Empleados_Sucursal();break;
        case "Listar_cmb_Empleados_Rol":$Regresa = Listar_cmb_Empleados_Rol();break; 
        case "Listar_cmb_Empleados_Empresa":$Regresa = Listar_cmb_Empleados_Empresa();break; 
        case "Actualizar_Empleado":$Regresa = Actualizar_Empleado();break;
        case "Agregar_Empleado":$Regresa = Agregar_Empleado();break;
        case "Eliminar_Empleado":$Regresa = Eliminar_Empleado();break;
        //Administradr Emergente
        case "Listar_RegistroQr_Emergente":$Regresa = Listar_RegistroQr_Emergente();break;
        case "Listar_cmb_Emergentes_Sucursal":$Regresa = Listar_cmb_Emergentes_Sucursal();break;
        case "Buscar_Empleado_RegistroQr_Emergente":$Regresa = Buscar_Empleado_RegistroQr_Emergente();break; 
        case "Agregar_Registro_Emergente":$Regresa = Agregar_Registro_Emergente();break; 
        //Administradr Emergente
        case "Listar_Sucursales":$Regresa = Listar_Sucursales();break;
        case "Buscar_Sucursal_Sucursales":$Regresa = Buscar_Sucursal_Sucursales();break;
        case "Actualizar_Sucursales":$Regresa = Actualizar_Sucursales();break;
        case "Agregar_Sucursales":$Regresa = Agregar_Sucursales();break;
        case "Eliminar_Sucursales":$Regresa = Eliminar_Sucursales();break;

    }
    echo $Regresa;
/////////////////////////////////////////////////////////////////////////////////////////
//Conexion DB
/////////////////////////////////////////////////////////////////////////////////////////
    //Función que conecta base de datos, ejecuta el Query y cierra la conexión
    function Ejecuta_Query($Query)
    {
        include("ConnDB.php");
        $Conexion = new mysqli($ConnDB["Servidor"],$ConnDB["Usuario"],$ConnDB["Password"],$ConnDB["DB"]);
        
        if($Conexion->connect_errno > 0)
        {
            die('Unable to connect to database [' . $Conexion->connect_error . ']');
        }
        
        $result = $Conexion->query($Query);
        $Conexion->close();
        return $result;
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Login
/////////////////////////////////////////////////////////////////////////////////////////
    //Función de Login
    function Login()
    {
        
        $Regresa = array();
        $Usuario =$_POST['Usuario'];
        $Password = md5($_POST['Password']);
        
        $Query = "SELECT * FROM usuarios WHERE Usuario = '$Usuario' AND Password = '$Password' AND Estatus = 1";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//QrScanner
/////////////////////////////////////////////////////////////////////////////////////////
    //Función de Consulta_Qr
    function Consulta_Qr()
    {
        $Regresa = array();
        $RegistroQr = $_POST['RegistroQr'];
        
        $Query = "SELECT * FROM empleados WHERE EmpleadoQr = '$RegistroQr' AND Estatus = 1";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);

    }
/////////////////////////////////////////////////////////////////////////////////////////
//Función de Agregar_RegistroQr
/////////////////////////////////////////////////////////////////////////////////////////
    function Agregar_RegistroQr()
    {

        $TipoRegistro = $_POST['TipoRegistro'];
        $Motivo = $_POST['Motivo'];
        $RegistroQr = $_POST['RegistroQr'];
        $Sucursal = $_POST['Sucursal'];
        $iUsuario = $_POST['iUsuario'];    

        $Query = "INSERT INTO registrosqr (TipoRegistro,Motivo,iEmpleado,iSucursal,iUsuario)VALUES('$TipoRegistro','$Motivo','$RegistroQr','$Sucursal','$iUsuario')";
        $Lector = Ejecuta_Query($Query);
        
        return "OK";
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Listar_RegistroQr
/////////////////////////////////////////////////////////////////////////////////////////
    function Listar_RegistroQr()
    {
        $Regresa = array();
        $Sucursal = $_POST['Sucursal'];

        $Query = "SELECT iRegistro,Motivo,FechaRegistro,iEmpleado,iSucursal,(SELECT Nombre FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Nombre,(SELECT Apellidos FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Apellidos FROM registrosqr WHERE iSucursal = $Sucursal AND DATE_FORMAT(FechaRegistro, '%Y-%m-%d') = CURDATE() ORDER BY FechaRegistro DESC";
            
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Bandejas
///////////////////////////////////////////////////////////////////////////////////////// 
   function Listar_Bandeja_Buscar()  
    {
      
        $FechaInicio = $_POST['FechaInicio'];
        $FechaFin = $_POST['FechaFin'];
        
        $Regresa = array();
        
            $Query = "SELECT iRegistro,TipoRegistro,Motivo,FechaRegistro,iEmpleado,iSucursal,iUsuario,
            (SELECT Nombre FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Nombre,
            (SELECT Apellidos FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Apellidos, 
            (SELECT Usuario FROM usuarios WHERE iUsuario = registrosqr.iUsuario) As Usuario,
            (SELECT Sucursal FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As SucurdalP 
            FROM registrosqr 
            WHERE DATE_FORMAT(FechaRegistro, '%Y-%m-%d') BETWEEN '$FechaInicio' AND '$FechaFin' ORDER BY FechaRegistro DESC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
    
/////////////////////////////////////////////////////////////////////////////////////////
//Administrador - Usuarios
/////////////////////////////////////////////////////////////////////////////////////////
    function Listar_Usuarios()
    {
        $Filtro = $_POST['Filtro'];
        $Regresa = array();
        if($Filtro != "")
        {
            $Query = "SELECT iUsuario,Usuario,Password,Nombre,Apellidos,Rol,Estatus,Sucursal,DATE_FORMAT(Fecha,'%d-%m-%Y %I:%i:%s %p')AS Fecha FROM usuarios WHERE Usuario LIKE '%$Filtro%' OR Nombre LIKE '%$Filtro%' OR Apellidos LIKE '%$Filtro%' OR Rol LIKE '%$Filtro%' ORDER BY Rol ASC";
        }
        else
            $Query = "SELECT iUsuario,Usuario,Password,Nombre,Apellidos,Rol,Estatus,Sucursal,DATE_FORMAT(Fecha,'%d-%m-%Y %I:%i:%s %p')AS Fecha FROM usuarios ORDER BY Rol ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que enlista Sucursales en Usuarios
/////////////////////////////////////////////////////////////////////////////////////////
        function Listar_cmb_Usarios_Sucursal()
    {
        $Regresa = array();
            $Query = "SELECT iSucursal, Sucursal, SUBSTRING(Tipo, 1, 3) AS Tipo, SUBSTRING(Consultorio, 1, 5) AS Consultorio FROM sucursales ORDER BY Sucursal ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
///////////////////////////////////////////////////////////////////////////////////////// 
//Actualizar_Usuario
///////////////////////////////////////////////////////////////////////////////////////// 
    function Actualizar_Usuario()
    {
        $Regresa = "";
        $iUsuario = $_POST['iUsuario'];
        $Usuario = $_POST['Usuario'];
        $Password = md5($_POST['Password']);
        $Nombre = $_POST['Nombre'];
        $Apellidos = $_POST['Apellidos'];
        $Rol = $_POST['Rol'];
        $Estatus = $_POST['Estatus'];
        $Sucursal = $_POST['Sucursal'];

        $Query = "UPDATE usuarios SET Usuario = '$Usuario', Password = '$Password', Nombre = '$Nombre', Apellidos = '$Apellidos', Rol = '$Rol',Sucursal ='$Sucursal', Estatus = '$Estatus' WHERE iUsuario = $iUsuario";
        $Lector = Ejecuta_Query($Query);
        
        $Regresa="Registro actualizado con éxito";
        return $Regresa;
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Agregar_Usuario
/////////////////////////////////////////////////////////////////////////////////////////
    function Agregar_Usuario()
    {
        $Regresa = "";
        $Usuario = $_POST['Usuario'];
        $Password = md5($_POST['Password']);
        $Nombre = $_POST['Nombre'];
        $Apellidos = $_POST['Apellidos'];
        $Rol = $_POST['Rol'];
        $Sucursal = $_POST['Sucursal'];

        $UsuarioConsulta = "";
        $Query = "SELECT Usuario FROM usuarios WHERE Usuario='$Usuario'";
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $UsuarioConsulta = $Registro['Usuario'];
        }

        if($UsuarioConsulta != $Usuario)
        {
           $Query = "INSERT INTO usuarios (Usuario,Password,Nombre,Apellidos,Rol,Sucursal)VALUES('$Usuario','$Password','$Nombre','$Apellidos','$Rol','$Sucursal')";
            $Lector = Ejecuta_Query($Query);
        
            $Regresa = "Registro Existoso";
        }
        else
             $Regresa = "Entrada duplicada para la clave 'Usuario'";

        return $Regresa;

    }
/////////////////////////////////////////////////////////////////////////////////////////
//Eliminar_Usuario
/////////////////////////////////////////////////////////////////////////////////////////
    function Eliminar_Usuario()
    {
        $Regresa = "";
        $iUsuario = $_POST['iUsuario'];
        
        //Validar que no sea Administrador
            $Rol = "";
            $Query = "SELECT Rol FROM usuarios WHERE iUsuario = $iUsuario";
            $Lector = Ejecuta_Query($Query);
            while($Registro = $Lector->fetch_assoc())
            {
                $Rol = $Registro['Rol'];
            }
            
            if($Rol != "Administrador")
            {
                //Elimino Usuario
                //$Query = "DELETE FROM usuarios WHERE iUsuario = $iUsuario";
                $Query = "UPDATE usuarios SET Estatus = 0 WHERE iUsuario = $iUsuario";
                Ejecuta_Query($Query);
                $Regresa = "Usuario Inactivado";
            }
            else
                $Regresa = "Usuario Administrador no se Elimina";

        return $Regresa;
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Administrador - Empleados
/////////////////////////////////////////////////////////////////////////////////////////
   function Listar_Empleados()
    {
        $Filtro = $_POST['Filtro'];
        $Regresa = array();
        if($Filtro != "")
        {
            $Query = "SELECT iEmpleado,EmpleadoQr,Empresa,EmpleadoNum,Nombre,Apellidos,Rol,Estatus,Sucursal,DATE_FORMAT(Fecha,'%d-%m-%Y %I:%i:%s %p')AS Fecha FROM empleados WHERE EmpleadoQr LIKE '%$Filtro%' OR Nombre LIKE '%$Filtro%' OR Apellidos LIKE '%$Filtro%' OR Rol LIKE '%$Filtro%' ORDER BY EmpleadoQr ASC";
        }
        else
            $Query = "SELECT iEmpleado,EmpleadoQr,Empresa,EmpleadoNum,Nombre,Apellidos,Rol,Estatus,Sucursal,DATE_FORMAT(Fecha,'%d-%m-%Y %I:%i:%s %p')AS Fecha FROM empleados ORDER BY EmpleadoQr ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que enlista Sucursales en Empleados
/////////////////////////////////////////////////////////////////////////////////////////
    function Listar_cmb_Empleados_Sucursal()
    {
        $Regresa = array();
            $Query = "SELECT iSucursal, Sucursal, SUBSTRING(Tipo, 1, 3) AS Tipo, SUBSTRING(Consultorio, 1, 5) AS Consultorio FROM sucursales ORDER BY Sucursal ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
///////////////////////////////////////////////////////////////////////////////////////// 
//Funcion que enlist Rol en Empleados
///////////////////////////////////////////////////////////////////////////////////////// 
    function Listar_cmb_Empleados_Rol()
    {
        $Regresa = array();
            $Query = "SELECT iRol, Rol FROM roles ORDER BY Rol ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
///////////////////////////////////////////////////////////////////////////////////////// 
//Funcion que enlist Empresa en Empleados
///////////////////////////////////////////////////////////////////////////////////////// 
    function Listar_cmb_Empleados_Empresa()
    {
        $Regresa = array();
            $Query = "SELECT iEmpresa, Empresa, Nombre, Rfc FROM empresa ORDER BY Empresa ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
///////////////////////////////////////////////////////////////////////////////////////// 
//Funcion que actualiza empleado
///////////////////////////////////////////////////////////////////////////////////////// 
    function Actualizar_Empleado()
    {
        $iEmpleado = $_POST['iEmpleado'];
        $EmpleadoQr = $_POST['EmpleadoQr'];
        $Empresa = $_POST['Empresa'];
        $EmpleadoNum = $_POST['EmpleadoNum'];
        $Nombre = $_POST['Nombre'];
        $Apellidos = $_POST['Apellidos'];
        $Rol = $_POST['Rol'];
        $Estatus = $_POST['Estatus'];
        $Sucursal = $_POST['Sucursal'];

        $Query = "UPDATE empleados SET EmpleadoQr = '$EmpleadoQr', Empresa = '$Empresa', EmpleadoNum = '$EmpleadoNum', Nombre = '$Nombre', Apellidos = '$Apellidos', Rol = '$Rol',Sucursal ='$Sucursal', Estatus = '$Estatus' WHERE iEmpleado = $iEmpleado";
        $Lector = Ejecuta_Query($Query);
        
        return "OK";
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que agrega empleado
///////////////////////////////////////////////////////////////////////////////////////// 
   function Agregar_Empleado()
    {
        $EmpleadoQr = $_POST['EmpleadoQr'];
        $Empresa = $_POST['Empresa'];
        $EmpleadoNum = $_POST['EmpleadoNum'];
        $Nombre = $_POST['Nombre'];
        $Apellidos = $_POST['Apellidos'];
        $Rol = $_POST['Rol'];
        $Sucursal = $_POST['Sucursal'];

        $Query = "INSERT INTO empleados (EmpleadoQr,Empresa,EmpleadoNum,Nombre,Apellidos,Rol,Sucursal)VALUES('$EmpleadoQr','$Empresa', '$EmpleadoNum','$Nombre','$Apellidos','$Rol','$Sucursal')";
        $Lector = Ejecuta_Query($Query);
        
        return "OK";
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que elimina empleado
///////////////////////////////////////////////////////////////////////////////////////// 
    function Eliminar_Empleado()
    {
        $Regresa = "";
        $iEmpleado = $_POST['iEmpleado'];
    
        //Elimino Usuario
        //$Query = "DELETE FROM empleados WHERE iEmpleado = $iEmpleado";
        $Query = "UPDATE empleados SET Estatus = 0 WHERE iEmpleado = $iEmpleado";
        Ejecuta_Query($Query);
        $Regresa = "Empleado Inactivado";
  
        return $Regresa;
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Administrador - Emergente
/////////////////////////////////////////////////////////////////////////////////////////
    //Funcion que enlist Sucursales en Emergentes
    function Listar_cmb_Emergentes_Sucursal()
    {
        $Regresa = array();
            $Query = "SELECT iSucursal, Sucursal, SUBSTRING(Tipo, 1, 3) AS Tipo, SUBSTRING(Consultorio, 1, 5) AS Consultorio FROM sucursales ORDER BY Sucursal ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }

/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que enlist Los registrs emergentes en Emergentes por filtro
///////////////////////////////////////////////////////////////////////////////////////// 
    function Listar_RegistroQr_Emergente()
    {
        $Filtro = $_POST['Filtro'];
        $TipoRegistro = $_POST['TipoRegistro'];

        $Regresa = array();
        if($Filtro != "")
        {
            $Query = "SELECT iRegistro,TipoRegistro,Motivo,FechaRegistro,iEmpleado,iSucursal,iUsuario,(SELECT Nombre FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Nombre,(SELECT Apellidos FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Apellidos, (SELECT Usuario FROM usuarios WHERE iUsuario = registrosqr.iUsuario) As Usuario FROM registrosqr WHERE iEmpleado LIKE '%$Filtro%' OR Nombre LIKE '%$Filtro%' OR Apellidos LIKE '%$Filtro%' AND TipoRegistro = '$TipoRegistro'  ORDER BY FechaRegistro DESC";
        }
        else
            $Query = "SELECT iRegistro,TipoRegistro,Motivo,FechaRegistro,iEmpleado,iSucursal,iUsuario,(SELECT Nombre FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Nombre,(SELECT Apellidos FROM empleados WHERE EmpleadoQr = registrosqr.iEmpleado) As Apellidos,(SELECT Usuario FROM usuarios WHERE iUsuario = registrosqr.iUsuario) As Usuario FROM registrosqr WHERE TipoRegistro = '$TipoRegistro' ORDER BY FechaRegistro DESC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que busca todos empleados existentes para registros emergentes en Emergentes
///////////////////////////////////////////////////////////////////////////////////////// 
    function Buscar_Empleado_RegistroQr_Emergente()
    {
        $EmpleadoQr = $_POST['EmpleadoQr'];
        $Regresa = array();

            $Query = "SELECT EmpleadoQr,Rol,Nombre,Apellidos FROM empleados WHERE EmpleadoQr LIKE '%$EmpleadoQr%' OR Nombre LIKE '%$EmpleadoQr%'OR Apellidos LIKE '%$EmpleadoQr%' LIMIT 10";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Función de Agregar_Registro_Emergente
///////////////////////////////////////////////////////////////////////////////////////// 
    function Agregar_Registro_Emergente()
    {

        $TipoRegistro = $_POST['TipoRegistro'];
        $Motivo = $_POST['Motivo'];
        $EmpleadoQr = $_POST['EmpleadoQr'];
        $Sucursal = $_POST['Sucursal'];
        $iUsuario = $_POST['iUsuario'];    

        $Query = "INSERT INTO registrosqr (TipoRegistro,Motivo,iEmpleado,iSucursal,iUsuario)VALUES('$TipoRegistro','$Motivo','$EmpleadoQr','$Sucursal','$iUsuario')";
        $Lector = Ejecuta_Query($Query);
        
        return "OK";
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Administrador - Sucursales
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que enlista las sucursales en sucursales por filtro
///////////////////////////////////////////////////////////////////////////////////////// 
    function Listar_Sucursales()
    {
        $Filtro = $_POST['Filtro'];

        $Regresa = array();
        if($Filtro != "")
        {
            $Query = "SELECT * FROM sucursales WHERE Sucursal LIKE '%$Filtro%' OR Tipo LIKE '%$Filtro%' OR Zona LIKE '%$Filtro%' OR Localidad LIKE '%$Filtro%' ORDER BY Sucursal ASC";
        }
        else
            $Query = "SELECT * FROM sucursales ORDER BY Sucursal ASC";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Funcion que busca susucrsales existentes para registros emergentes en Emergentes
///////////////////////////////////////////////////////////////////////////////////////// 
    function Buscar_Sucursal_Sucursales()
    {
        $Sucursal = $_POST['Sucursal'];
        $Regresa = array();

            $Query = "SELECT Sucursal FROM sucursales WHERE Sucursal = '$Sucursal'  LIMIT 10";
        
        $Lector = Ejecuta_Query($Query);
        while($Registro = $Lector->fetch_assoc())
        {
            $Regresa[] = array_map('utf8_encode',$Registro);
        }
        return json_encode($Regresa);
    }
///////////////////////////////////////////////////////////////////////////////////////// 
//Actualizar_Sucursales
///////////////////////////////////////////////////////////////////////////////////////// 
    function Actualizar_Sucursales()
    {
        $Regresa = "";
        $iSucursal = $_POST['iSucursal'];
        $Sucursal = $_POST['Sucursal'];
        $Zona = $_POST['Zona'];
        $Colonia = $_POST['Colonia'];
        $CalleNum = $_POST['CalleNum'];
        $Referencia = $_POST['Referencia'];
        $Tipo = $_POST['Tipo'];
        $Consultorio = $_POST['Consultorio'];
        $Localidad = $_POST['Localidad'];
        $Estatus = $_POST['Estatus'];

        $Query = "UPDATE sucursales SET Sucursal = '$Sucursal', Zona = '$Zona', Colonia = '$Colonia', Calle = '$CalleNum', Referencia = '$Referencia',Tipo ='$Tipo', Consultorio ='$Consultorio', Localidad ='$Localidad', Estatus = '$Estatus' WHERE iSucursal = $iSucursal";
        $Lector = Ejecuta_Query($Query);
        
        $Regresa="Registro actualizado con éxito";
        return $Regresa;
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Agregar_Sucursales
/////////////////////////////////////////////////////////////////////////////////////////
    function Agregar_Sucursales()
    {
        $Regresa = "";
        $iSucursal = $_POST['iSucursal'];
        $Sucursal = $_POST['Sucursal'];
        $Zona = $_POST['Zona'];
        $Colonia = $_POST['Colonia'];
        $CalleNum = $_POST['CalleNum'];
        $Referencia = $_POST['Referencia'];
        $Tipo = $_POST['Tipo'];
        $Consultorio = $_POST['Consultorio'];
        $Localidad = $_POST['Localidad'];
        $Estatus = $_POST['Estatus'];

           $Query = "INSERT INTO sucursales (Sucursal,Zona,Colonia,Calle,Referencia,Tipo,Consultorio,Localidad,Estatus)VALUES('$Sucursal','$Zona','$Colonia','$CalleNum','$Referencia','$Tipo','$Consultorio','$Localidad','$Estatus')";
            $Lector = Ejecuta_Query($Query);
        
            $Regresa = "Registro Existoso";
        return $Regresa;
    }
/////////////////////////////////////////////////////////////////////////////////////////
//Eliminar_Sucursales
/////////////////////////////////////////////////////////////////////////////////////////
    function Eliminar_Sucursales()
    {
        $Regresa = "";
        $iSucursal = $_POST['iSucursal'];
        
                $Query = "UPDATE sucursales SET Estatus = 0 WHERE iSucursal = $iSucursal";
                Ejecuta_Query($Query);
                $Regresa = "Sucursal  Desactivada";

        return $Regresa;
    }
?>
	