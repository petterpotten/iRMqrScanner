
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

// Inicio de $(document).ready(function(){//
$(document).ready(function(){ 

    //Inicializo Validador de Div's
    Div_Display_Modal('Modal');
    //Inicializo datepicker
    $('#dtp_FechaInicio').datepicker({restrictDateSelection: false});
    $('#dtp_FechaFin').datepicker({restrictDateSelection: false});

   
    
    //Inicializo reloj
    setInterval(Reloj,1000);
//--------------------------------------------------------------------------------------------------------------------------//
    //Valído si $.cookie('logged','True'); para Iniciar session y mostrar los Div correctos
    var session = $.cookie();
    if(session['logged']=='True')
    {   
        $('#Div_Login').addClass('display-none');
        Mostrar_Div('Div_Menu');
        Mostrar_Div('Div_QR_Scanner');
        Listar_RegistroQr();
        
        //Valido si es Admin *Solo el Admin puede ver y editar usuarios
        if(session['Usuario']=='Admin')
        {
           $('#li_Administrador').removeClass('display-none');
              
                  $('#li_Usuarios').removeClass('display-none');
                  $('#Div_Admin_Usuarios').removeClass('display-none');
        }
        else
        {
            //Valído Rol y despliego solo lo que se ocupa segun el rol de usuario.
            if(session['Rol']=='Administrador')
            {
              $('#li_Administrador').removeClass('display-none'); 
                 $('#li_Usuarios').addClass('display-none'); 
                 $('#Div_Admin_Usuarios').addClass('display-none');
                 
                 $('#li_Empleados').removeClass('display-none'); 
                 $('#Div_Admin_Empleados').removeClass('display-none');
            }
            
            if(session['Rol']=='Nominas')
            {
                $('#li_QR_Scanner').addClass('display-none');
                $('#Div_QR_Scanner').addClass('display-none');

                Mostrar_Div('Div_Bandejas');

                $('#li_Administrador').removeClass('display-none');
                   
                    $('#li_Usuarios').addClass('display-none'); 
                    $('#Div_Admin_Usuarios').addClass('display-none');
                     
                    $('#li_QrEmergente').addClass('display-none');
                    $('#Div_Admin_QrEmergente').addClass('display-none');
                     
                    $('#li_Sucursales').addClass('display-none');
                    $('#Div_Admin_Sucursales').addClass('display-none');

                    $('#li_Empresas').addClass('display-none');
                    $('#Div_Admin_Empresas').addClass('display-none');                   
            }

            if(session['Rol']=='Recursos-Humanos')
            {
                $('#li_QR_Scanner').addClass('display-none');
                $('#Div_QR_Scanner').addClass('display-none');

                $('#li_Consulta').addClass('display-none');
                $('#Div_Bandejas').addClass('display-none');

                $('#li_Administrador').removeClass('display-none');
                   
                    $('#li_Usuarios').addClass('display-none'); 
                    $('#Div_Admin_Usuarios').addClass('display-none');
                     
                    $('#li_QrEmergente').addClass('display-none');
                    $('#Div_Admin_QrEmergente').addClass('display-none');
                     
                    $('#li_Sucursales').addClass('display-none');
                    $('#Div_Admin_Sucursales').addClass('display-none');

                    $('#li_Empresas').addClass('display-none');
                    $('#Div_Admin_Empresas').addClass('display-none');                  
            }

            if(session['Rol']=='Mesa-Control')
            {
                $('#li_Administrador').removeClass('display-none');

                $('#li_Usuarios').addClass('display-none'); 
                $('#Div_Admin_Usuarios').addClass('display-none');
            }

            if(session['Rol']=='Sucursal')
            {
                $('#li_Consulta').addClass('display-none');
                $('#li_Administrador').addClass('display-none');
            }
        }//Fin de else session['Usuario']=='Admin'  
        
        //Asignamos datos de Usario a etiqueta "Bienvenido".
        var _Usuario = session['Nombre'] + ' ' + session['Apellidos'];
        $('#lnk_Bienvenido').html('Bienvenido - '+_Usuario+' - S '+ session['Sucursal']);
        $('#lnk_Bienvenido').attr("iUsuario",session['iUsuario']);
        
    } //Fin de if session['logged']=='True'
//--------------------------------------------------------------------------------------------------------------------------//
    //Click en Botón Login
    $('#btn_Login').click(function(){
        Login();
    });
//--------------------------------------------------------------------------------------------------------------------------//
    //Función para realizar Login
    function Login()
    {
        var _Usuario = $('#txt_Usuario').val();
        var _Password = $('#txt_Password').val();
        
        $.post("php/Funciones.php",{Accion:"Login",Usuario:_Usuario,Password:_Password},function(data){
            
            if(data.length > 0)
            {
                $.cookie('logged','True');
                
                $.cookie('iUsuario',data[0].iUsuario);
                $.cookie('Usuario',data[0].Usuario);
                $.cookie('Nombre',data[0].Nombre);
                $.cookie('Apellidos',data[0].Apellidos);
                $.cookie('Rol',data[0].Rol);
                $.cookie('Sucursal',data[0].Sucursal);
    
                location.reload(true);
            }
            else
            {
                $.cookie('logged','False');
                Div_Display_Modal('Modal_Mensajes')
                $('#Modal_Mensaje').html('Usuario / Password Invalidos');
                $('#Modal_Mensajes').modal('show');
            }

        },'json');
    }  
//----------------------------------------------------------------------//
                            ///// Menú \\\\\
//----------------------------------------------------------------------//
  //Click en Link QR Scanner
    $('#lnk_QR_Scanner').click(function(e){
        e.preventDefault();
        
        Mostrar_Div('Div_QR_Scanner');
        //QR_Scanner();
        Listar_RegistroQr();
    });
//----------------------------------------------------------------------//
  //Click en Link Consulta
    $('#lnk_Consulta').click(function(e){
        e.preventDefault();
        
        Mostrar_Div('Div_Bandejas'); 
    });
//----------------------------------------------------------------------//
    //Click en Link Administrador
    $('#lnk_Administrador').click(function(e){
        e.preventDefault();
        Mostrar_Div('Div_Administrador');
    });
//----------------------------------------------------------------------//
    //Click en Link Cerrar Sesion
    $('#lnk_Logout').click(function(){
        $.cookie('logged','False');
        location.reload(true);
    });
//----------------------------------------------------------------------//
                ///// Contenido QR Scanner \\\\\
//----------------------------------------------------------------------//
    //Función del reloj 
    function Reloj(){
        var _Tiempo = new Date();
        var _Minutos = _Tiempo.getMinutes();
        var _Segundos = _Tiempo.getSeconds();
        var _Hora = _Tiempo.getHours();

        var _ExtencionHora;
        var _HoraCompleta;

            if(_Minutos < 10)
            {
                _Minutos = "0" + _Minutos;
            }
            else
            {
                _Minutos = "" + _Minutos;
            }

                if(_Segundos < 10)
                {
                    _Segundos = "0" + _Segundos;
                }
                else
                {
                    _Segundos = "" + _Segundos;
                }

                    if (_Hora > 12)
                    {
                        _ExtencionHora = "p.m.";
                    }
                    else
                    {
                        _ExtencionHora = "a.m.";
                    }

                        if (_Hora > 12) 
                        {

                            _Hora -= 12;
                        }
                        else
                        {
                            _Hora = _Hora;
                        }
            
                            if (_Hora > 12) 
                            {
                                
                                _Hora -= 12;
                            }
                            else{
                                _Hora = _Hora;
                            }
                                if (_Hora == 12) 
                                {
                                    
                                    _Hora = 12;
                                }
                                else
                                {
                                    _Hora = _Hora;
                                }

        _HoraCompleta = _Hora + ":" + _Minutos + ":" + _Segundos + " " + _ExtencionHora;
        $("#reloj").html(_HoraCompleta);
    }
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------//
  //Click en Boton Iniciar Scaner
    $('#btn_iniciarScanner').click(function(e){
        e.preventDefault();
        
        QR_Scanner();
    });

  //Click en Boton Detener Scaner
    $('#btn_detenerScanner').click(function(e){
        e.preventDefault();
        
        scanner.stop();
        //window.location.href='https://farmaceuticatj.store/irmqrscanner';
        location.reload(true);
    });
//----------------------------------------------------------------------//
    //Aqui creo el objeto de instascanner para escanear y determin parametros de escaneo.
       var scanner = new Instascan.Scanner({ 
            video:  $("#preview")[0], 
            scanPeriod: 1, 
            mirror: false,
            //captureImage: false,
            refractoryPeriod: 3000
        });
    //Función para scanear codigos QR - InstaScanner en Jquery.
    function QR_Scanner(){
        ObtenerCamaras();
        scanner.addListener('scan',function(_RegistroQr){
            //alert(_RegistroQr);
             //window.location.href=content;
            var _iUsuario = $('#lnk_Bienvenido').attr("iUsuario");
            var _Sucursal = session['Sucursal'];
            
            //Funcion que detiene el scaneo
            scanner.stop();
            $.post("php/Funciones.php",{Accion:"Consulta_Qr",RegistroQr:_RegistroQr,Sucursal:_Sucursal,iUsuario:_iUsuario},function(data){
                if(data.length > 0)
                {
                    if (_Sucursal != data[0].Sucursal) 
                    { 
                        //Funcion que detiene el scaneo
                        //scanner.stop();
                        $('#txt_Modal_Motivo_Registro').val('');

                        $('#btn_Modal_Motivo_Registro').attr('iQr',_RegistroQr);
                        Div_Display_Modal('Modal_Motivo_Registro');
                        $('#Modal_Motivo_Registro').modal('show');
                        
                    } 
                    else
                    {
                        //Funcion que detiene el scaneo
                         //scanner.stop();
                        Agregar_RegistroQr(_RegistroQr);
                    }
                }
                 else 
                {
                    //Funcion que detiene el scaneo
                         //scanner.stop();
                    var _Mensaje = "";
                    _Mensaje+="El empleado no existe o esta dado de baja";

                    Div_Display_Modal('Modal_Mensajes')
                    $('#Modal_Mensaje').html(_Mensaje);
                    $('#Modal_Mensajes').modal('show');
                    
                    //Funcion que hace desaparecer el Modal Mensajes en 3 segundos
                    setTimeout(function()
                    { 
                        $('#Modal_Mensajes').modal('hide'); 

                    }, 3000);
                }
            },"json"); 
            
            scanner.start();
        });
    }
    //Aqui creo el objeto de instascanner para las camaras y determinar si es frontal o trsera.
    function ObtenerCamaras(){ 
         Instascan.Camera.getCameras().then(function (cameras)
            {
                if(cameras.length>0)
                {
                    scanner.start(cameras[0]);
                    $('[name="options"]').on('change',function()
                    {
                        if($(this).val()==1)
                        {
                            if(cameras[0]!="")
                            {
                                
                                scanner.start(cameras[0]);
                            }
                            else
                            {
                                alert('No se encontró cámara frontal.');
                            }
                        }
                        else if($(this).val()==2)
                        {
                            if(cameras[1]!="")
                            {
                                scanner.start(cameras[1]);
                            }
                            else
                            {
                                alert('No se encontró cámara trasera.');
                            }
                        }
                    });
                }
                else
                {
                    console.error('No se encontró cámara o dispositivo.');
                    alert('No se encontró cámara o dispositivo.');
                }
            }).catch(function(e)
            {
                console.error(e);
                alert(e);
            });
    }
//----------------------------------------------------------------------------------//
   //Click en el botón Aceptar del Modal_Motivo_Registro
   $('#btn_Modal_Motivo_Registro').click(function(){
        Agregar_RegistroQr($('#btn_Modal_Motivo_Registro').attr('iQr'));
    });
//----------------------------------------------------------------------------------//
    //Función que agrega los regitros QR a la base de datos 
    function Agregar_RegistroQr(_RegistroQr){

        var _iUsuario = $('#lnk_Bienvenido').attr("iUsuario");
        var _Sucursal = session['Sucursal'];
        var _Motivo= $('#txt_Modal_Motivo_Registro').val();

        var _TipoRegistro ="Qr";

            $.post("php/Funciones.php",{Accion:"Agregar_RegistroQr",RegistroQr:_RegistroQr,Sucursal:_Sucursal,iUsuario:_iUsuario,Motivo:_Motivo,TipoRegistro:_TipoRegistro},function(data){});
            $('#Modal_Motivo_Registro').modal('hide');
            if ($('.modal-backdrop').is(':visible')) 
            {
               $('body').removeClass('modal-open'); 
               $('.modal-backdrop').remove(); 
            };
            Listar_RegistroQr();
            
            var _Hora = $("#reloj").html();
            var _Mensaje = "";
                    _Mensaje+="Registro QR exitoso: | "+_RegistroQr+" | "+_Hora;
                
                    Div_Display_Modal('Modal_Mensajes')
                    $('#Modal_Mensaje').html(_Mensaje);
                    $('#Modal_Mensajes').modal('show');
            //Funcion que hace desaparecer el Modal Mensajes en 3 segundos
            setTimeout(function()
            { 
                $('#Modal_Mensajes').modal('hide'); 

            }, 3000); 
        scanner.start();
    }
//----------------------------------------------------------------------------------//
    //Función que enlista los registros de hoy de la sucursal logeada. 
    function Listar_RegistroQr(){
        var _Sucursal = session['Sucursal'];
        $.post("php/Funciones.php",{Accion:"Listar_RegistroQr",Sucursal:_Sucursal},function(data){
                if(data.length > 0)
                {
                    var _Registros = "";
                    var _ContadorRegistrosQrHoy = 0; 
                    for(var i=0;i<data.length;i++)
                    {
                        _Registros+= "<tr iRegistro= '"+data[i].iRegistro+"'>";
                        _Registros+= "<td>"+data[i].iEmpleado+"</td>";
                        _Registros+= "<td>"+data[i].Nombre+" "+data[i].Apellidos+"</td>";
                        _Registros+= "<td>"+data[i].FechaRegistro+"</td>";
                        _Registros+= "<td>"+data[i].iSucursal+"</td>";
                        _Registros+= "<td>"+data[i].Motivo+"</td>";

                    _ContadorRegistrosQrHoy++;
                }
                $('#tbody_QR_Scanner_Listar_RegistrosQr').html(_Registros);
                $('#RegistrosQrHoy').html(_ContadorRegistrosQrHoy);
            }   
        },"json");
    }
//----------------------------------------------------------------------------------//
    //Keyup en tabla para los registros de día ya cargados en un API sin tener que cargar un nuevo api.
    $("#txt_buscarRegistrosQrHoy").keyup(function(){
        if( $(this).val() != ""){
            $("#tabla_QR_Scanner_Listar_RegistrosQr tbody>tr").hide();
            $("#tabla_QR_Scanner_Listar_RegistrosQr td:filtra-RegistrosQrHoy('" + $(this).val() + "')").parent("tr").show();
        }
        else{
            $("#tabla_QR_Scanner_Listar_RegistrosQr tbody>tr").show();
        }
    });
    $.extend($.expr[":"], 
    {
        "filtra-RegistrosQrHoy": function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
//----------------------------------------------------------------------------------//
                        ///// Bandeja-Consulta \\\\\
//----------------------------------------------------------------------------------//
    //Click en btn_Filtrar
    $('#btn_Filtrar').click(function(){
        Listar_Bandeja_Buscar();
    });
//-----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
    //Función para listar los registros de la bandeja de consulta
   function Listar_Bandeja_Buscar()
    {
        var _FechaInicio = $('#dtp_FechaInicio input').val();
        var _FechaFin = $('#dtp_FechaFin input').val();

        $.post("php/Funciones.php",{Accion:'Listar_Bandeja_Buscar',FechaInicio:_FechaInicio,FechaFin:_FechaFin},function(data){
            var _Registro = "";
            if(data.length > 0)
            {
                for(var i=0;i<data.length;i++)
                {
                    _Registro+= "<tr iRegistro= '"+data[i].iRegistro+"'>";
                        _Registro+= "<td>"+data[i].iEmpleado+"</td>";
                        _Registro+= "<td>"+data[i].Nombre+" "+data[i].Apellidos+"</td>";
                        _Registro+= "<td>"+data[i].FechaRegistro+"</td>";
                        _Registro+= "<td>"+data[i].iSucursal+"</td>";
                        _Registro+= "<td>"+data[i].Motivo+"</td>";
                        _Registro+= "<td>"+data[i].SucurdalP+"</td>";
                        _Registro+= "<td>"+data[i].TipoRegistro+"</td>";
                        _Registro+= "<td>"+data[i].Usuario+"</td>";
                    _Registro+= "</tr>";
                }
                
                $('#tbody_Bandeja1').html(_Registro);
            }
            else
            {
                var _Mensaje = "";
                    _Mensaje+="No se encontraron registros: | "+_FechaInicio+" - "+_FechaFin+" | ";
                
                    Div_Display_Modal('Modal_Mensajes')
                    $('#Modal_Mensaje').html(_Mensaje);
                    $('#Modal_Mensajes').modal('show');
                //Funcion que hace desaparecer el Modal Mensajes en 3 segundos
                setTimeout(function()
                { 
                    $('#Modal_Mensajes').modal('hide'); 
    
                }, 3000); 
            }
            
        },"json");
    }
//----------------------------------------------------------------------------------//
 //Keyup en tabla para  los registros de la bandeja de consulta ya cargados en un API sin tener que cargar un nuevo api.
    $("#txt_Filtrar").keyup(function(){
        if( $(this).val() != ""){
            $("#tbl_Bandeja1 tbody>tr").hide();
            $("#tbl_Bandeja1 td:filtra-RegistrosBandeja('" + $(this).val() + "')").parent("tr").show();
        }
        else{
            $("#tbl_Bandeja1 tbody>tr").show();
        }
    });
    $.extend($.expr[":"], 
    {
        "filtra-RegistrosBandeja": function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || $(elem).text() || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
//----------------------------------------------------------------------------------//
                        ///// Administrador \\\\\ 
//----------------------------------------------------------------------------------//
                      ///// *Administrador*Nav \\\\\ 
//----------------------------------------------------------------------------------//
    //Click en Submenú Usuarios
    $('#li_Usuarios').click(function(){
    
        $('#li_Empleados').removeClass('active');
        $('#li_QrEmergente').removeClass('active');
        $('#li_Sucursales').removeClass('active');
        $('#li_Empresas').removeClass('active');
        $(this).addClass('active');
        
        $('#Div_Admin_Empleados').addClass('display-none');
        $('#Div_Admin_QrEmergente').addClass('display-none');
        $('#Div_Admin_Sucursales').addClass('display-none');
        $('#Div_Admin_Empresas').addClass('display-none');

        $('#Div_Admin_Usuarios').removeClass('display-none');

        $('#txt_Admin_Buscar_Usuario').val('');
        Listar_Usuarios();
    });
//----------------------------------------------------------------------------------//
    //Click en Submenú Empleados
    $('#li_Empleados').click(function(){

        $('#li_Usuarios').removeClass('active');
        $('#li_QrEmergente').removeClass('active');
        $('#li_Sucursales').removeClass('active');
        $('#li_Empresas').removeClass('active');
        $(this).addClass('active');
        
        $('#Div_Admin_Usuarios').addClass('display-none');
        $('#Div_Admin_QrEmergente').addClass('display-none');
        $('#Div_Admin_Sucursales').addClass('display-none');
        $('#Div_Admin_Empresas').addClass('display-none');

        $('#Div_Admin_Empleados').removeClass('display-none');
        Listar_Empleados();
    });
//----------------------------------------------------------------------------------//
    //Click en Submenú Emergente
    $('#li_QrEmergente').click(function(){
        
        $('#li_Usuarios').removeClass('active');
        $('#li_Empleados').removeClass('active');
        $('#li_Sucursales').removeClass('active');
        $('#li_Empresas').removeClass('active');
        $(this).addClass('active');
        
        $('#Div_Admin_Usuarios').addClass('display-none');
        $('#Div_Admin_Empleados').addClass('display-none');
        $('#Div_Admin_Sucursales').addClass('display-none');
        $('#Div_Admin_Empresas').addClass('display-none');

        $('#Div_Admin_QrEmergente').removeClass('display-none');
        Listar_RegistroQr_Emergente();
    });
//----------------------------------------------------------------------------------//
    //Click en Submenú Sucursales
    $('#li_Sucursales').click(function(){
    
        $('#li_Usuarios').removeClass('active');
        $('#li_Empleados').removeClass('active');
        $('#li_QrEmergente').removeClass('active');
        $('#li_Empresas').removeClass('active');
        $(this).addClass('active');
        
        $('#Div_Admin_Usuarios').addClass('display-none');
        $('#Div_Admin_Empleados').addClass('display-none');
        $('#Div_Admin_QrEmergente').addClass('display-none');
        $('#Div_Admin_Empresas').addClass('display-none');

        $('#Div_Admin_Sucursales').removeClass('display-none');
        Listar_Sucursales();

    });
//----------------------------------------------------------------------------------//
    //Click en Submenú Empresas
    $('#li_Empresas').click(function(){
    
        $('#li_Usuarios').removeClass('active');
        $('#li_Empleados').removeClass('active');
        $('#li_QrEmergente').removeClass('active');
        $('#li_Sucursales').removeClass('active');
        $(this).addClass('active');
        
        $('#Div_Admin_Usuarios').addClass('display-none');
        $('#Div_Admin_Empleados').addClass('display-none');
        $('#Div_Admin_QrEmergente').addClass('display-none');
        $('#Div_Admin_Sucursales').addClass('display-none');

        $('#Div_Admin_Empresas').removeClass('display-none');
    });
//----------------------------------------------------------------------------------//
                ///// *Administrador*Usuario \\\\\ 
//----------------------------------------------------------------------------------//
     //Click en Buscar Usuario
    $('#btn_Admin_Buscar_Usuario').click(function(){
        if($('#txt_Admin_Buscar_Usuario').val().length>0)
            Listar_Usuarios($('#txt_Admin_Buscar_Usuario').val());
        else
            Listar_Usuarios();
    });
//----------------------------------------------------------------------------------//
    //Click en btn_Admin_Agregar_Usuario
    $('#btn_Admin_Agregar_Usuario').click(function(){ btn_Admin_Agregar_Empleados
        $('#btn_Usuarios_Aceptar').attr('iUsuario','0');
        
        $('#txt_Usuarios_Usuario').val('');
        $('#txt_Usuarios_Password').val('');
        $('#txt_Usuarios_Nombre').val('');
        $('#txt_Usuarios_Apellidos').val('');

        $('#cmb_Usarios_Sucursal').select('selectByText','');
        $('#cmb_Usarios_Sucursal ul').empty();

        Listar_cmb_Usarios_Sucursal();
        
        Div_Display_Modal('Modal_Usuarios');
        $('#Modal_Usuarios').modal('show');
    });

//----------------------------------------------------------------------------------//
//Función que enlista los sucursales existentes en dropdown Admin_Usuarios,
    function Listar_cmb_Usarios_Sucursal()
    {
        $.post('php/Funciones.php',{Accion:'Listar_cmb_Usarios_Sucursal'},function(data){
            if(data.length > 0)
            {
               var length = $('#cmb_Usarios_Sucursal ul').children('li').length;
                 if (length >0) 
                 {
                     $('#cmb_Usarios_Sucursal ul').empty();             
                 }
                    for(var i=0;i<data.length;i++)
                    {                       
                        $('#cmb_Usarios_Sucursal ul').append($('<li><a href="#">'+data[i].Sucursal+'</a></li>')); 
                    }       
            }
        },'json'); 
    }
//----------------------------------------------------------------------------------//
//Función que enlista los usuarios existentes
    function Listar_Usuarios(_Filtro)
    {
        if(typeof(_Filtro)==='undefined') _Filtro = "";
        $.post("php/Funciones.php",{Accion:"Listar_Usuarios",Filtro:_Filtro},function(data){
            if(data.length > 0)
            {
                var _Usuarios = "";
                for(var i=0;i<data.length;i++)
                {
                    _Usuarios+= "<tr iUsuario = '"+data[i].iUsuario+"'>";
                        _Usuarios+= "<td>"+data[i].Usuario+"</td>";
                        _Usuarios+= "<td>"+data[i].Password+"</td>";
                        _Usuarios+= "<td>"+data[i].Nombre+"</td>";
                        _Usuarios+= "<td>"+data[i].Apellidos+"</td>";
                        _Usuarios+= "<td>"+data[i].Rol+"</td>";
                        _Usuarios+= "<td>"+data[i].Sucursal+"</td>";
                    
                        if(data[i].Estatus == '1')
                            _Usuarios+= "<td class='badge badge-success'>Activo</td>";
                        else
                            _Usuarios+= "<td class='badge badge-danger'>Inactivo</td>";

                        _Usuarios+= "<td>"+data[i].Fecha+"</td>";
                        _Usuarios+= "<td><a href='#'><i class='icon-pencil editar_usuario'></i></a></td>";
                        _Usuarios+= "<td><a href='#'><i class='icon-trash eliminar_usuario'></i></a></td>";
                        _Usuarios+= "</tr>";
                }
                $('#tbody_Admin_Usuarios').html(_Usuarios);

                //Click en Editar/ Actualizar Usuario
                $('.editar_usuario').click(function(){
                    var _iUsuario = $(this).closest("tr").attr("iUsuario");
                    var _Usuario = $(this).closest("tr").find("td:eq(0)").html();
                    var _Password = $(this).closest("tr").find("td:eq(1)").html();
                    var _Nombre = $(this).closest("tr").find("td:eq(2)").html();
                    var _Apellidos = $(this).closest("tr").find("td:eq(3)").html();
                    var _Rol = $(this).closest("tr").find("td:eq(4)").html();
                    var _Sucursal = $(this).closest("tr").find("td:eq(5)").html();
                    var _Estatus = $(this).closest("tr").find("td:eq(6)").html();

                    
                    $('#btn_Usuarios_Aceptar').attr('iUsuario',_iUsuario);
                    $('#txt_Usuarios_Usuario').val(_Usuario);
                    $('#txt_Usuarios_Password').val(_Password);
                    $('#txt_Usuarios_Nombre').val(_Nombre);
                    $('#txt_Usuarios_Apellidos').val(_Apellidos);
                    $('#cmb_Usuarios_Rol').select('selectByText',_Rol);
                    $('#cmb_Usarios_Sucursal').select('selectByText',_Sucursal);                    
                    $('#cmb_Usuarios_Estatus').select('selectByText',_Estatus);
                    
                    Div_Display_Modal('Modal_Usuarios');
                    $('#Modal_Usuarios').modal('show');
                    Listar_cmb_Usarios_Sucursal();
                });

                //Click en Eliminar Usuario
                $('.eliminar_usuario').click(function(){
                    var _iUsuario = $(this).closest("tr").attr("iUsuario");
                    $.post('php/Funciones.php',{Accion:'Eliminar_Usuario',iUsuario:_iUsuario},function(data){
                        Listar_Usuarios();
                        
                        Div_Display_Modal('Modal_Mensajes')
                        $('#Modal_Mensaje').html(data);
                        $('#Modal_Mensajes').modal('show');
                    });
                });
                
            }
        },"json");
    }
//----------------------------------------------------------------------------------//
//Click en btn_Usuarios_Aceptar 
    $('#btn_Usuarios_Aceptar').click(function(){
        Actualizar_Usuario();
    });
//----------------------------------------------------------------------------------//
//Función que Actualiza Usuarios
    function Actualizar_Usuario()
    {
        var _iUsuario = $('#btn_Usuarios_Aceptar').attr('iUsuario');
        var _Usuario = $('#txt_Usuarios_Usuario').val();
        var _Password = $('#txt_Usuarios_Password').val();
        var _Nombre = $('#txt_Usuarios_Nombre').val();
        var _Apellidos = $('#txt_Usuarios_Apellidos').val(); 
        
        var _Rol = $('#cmb_Usuarios_Rol').select('selectedItem').text;
        var _Sucursal = $('#cmb_Usarios_Sucursal').select('selectedItem').text;
        var _Estatus = $('#cmb_Usuarios_Estatus').select('selectedItem').text;

            if(_Estatus == 'Activo')
                _Estatus = '1';
            else
                _Estatus = '0';
            
            
            if(_iUsuario != "0")
            {
                $.post("php/Funciones.php",{Accion:"Actualizar_Usuario",iUsuario:_iUsuario,Usuario:_Usuario,Password:_Password,Nombre:_Nombre,Apellidos:_Apellidos,Rol:_Rol,Sucursal:_Sucursal,Estatus:_Estatus},function(data){
                    if($('#txt_Admin_Buscar_Usuario').val().length>0)
                        Listar_Usuarios($('#txt_Admin_Buscar_Usuario').val());
                    else
                        Listar_Usuarios();
                    $('#Modal_Usuarios').modal('hide');

                });
            }
            else
            {
                $.post("php/Funciones.php",{Accion:"Agregar_Usuario",Usuario:_Usuario,Password:_Password,Nombre:_Nombre,Apellidos:_Apellidos,Rol:_Rol,Sucursal:_Sucursal,Estatus:_Estatus},function(data){
                    
                    Div_Display_Modal('Modal_Mensajes')
                    $('#Modal_Mensaje').html(data);
                    $('#Modal_Mensajes').modal('show');

                    if($('#txt_Admin_Buscar_Usuario').val().length>0)
                        Listar_Usuarios($('#txt_Admin_Buscar_Usuario').val());
                    else
                        Listar_Usuarios();
                    $('#Modal_Usuarios').modal('hide');
                });
            }
    }
//----------------------------------------------------------------------------------//
                ///// *Administrador*Empleado \\\\\ 
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
     //Click en Buscar Empleado
    $('#btn_Admin_Buscar_Empleados').click(function(){
        if($('#txt_Admin_Buscar_Empleados').val().length>0)
            Listar_Empleados($('#txt_Admin_Buscar_Empleados').val());
        else
            Listar_Empleados();
    });
//----------------------------------------------------------------------------------//
    //Click en btn_Admin_Agregar_Empleados
    $('#btn_Admin_Agregar_Empleados').click(function(){ 
        $('#btn_Empleados_Aceptar').attr('iEmpleado','0');
        
        $('#txt_Empleados_Nombre').val('');
        $('#txt_Empleados_Apellidos').val('');
        $('#txt_Empleados_NumEmpleado').val('');

        $('#cmb_Empleados_Empresa').select('selectByText','');
        $('#cmb_Empleados_Empresa ul').empty(); 
        Listar_cmb_Empleados_Empresa(); 

        $('#txt_Empleados_QrCode').val('');


        $('#cmb_Empleados_Sucursal').select('selectByText','');
        $('#cmb_Empleados_Sucursal ul').empty();
        Listar_cmb_Empleados_Sucursal();
        
        $('#cmb_Empleados_Rol').select('selectByText','');
        $('#cmb_Empleados_Rol ul').empty();
        Listar_cmb_Empleados_Rol();

        Div_Display_Modal('Modal_Empleados');
        $('#Modal_Empleados').modal('show');
    });
//----------------------------------------------------------------------------------//
//Función que enlista las sucursales existentes en dropdown ,Admin_Empleados,
    function Listar_cmb_Empleados_Sucursal()
    {
        $.post('php/Funciones.php',{Accion:'Listar_cmb_Empleados_Sucursal'},function(data){
            if(data.length > 0)
            {
               var length = $('#cmb_Empleados_Sucursal ul').children('li').length;
                 if (length >0) 
                 {
                     $('#cmb_Empleados_Sucursal ul').empty();             
                 }
                    for(var i=0;i<data.length;i++)
                    {                       
                         $('#cmb_Empleados_Sucursal ul').append($('<li><a href="#">'+data[i].Sucursal+'</a></li>')); 
                    }       
            }
        },'json'); 
    }

//----------------------------------------------------------------------------------//
//Función que enlista los roles existentes en dropdown ,Admin_Empleados,
    function Listar_cmb_Empleados_Rol()
    {
        $.post('php/Funciones.php',{Accion:'Listar_cmb_Empleados_Rol'},function(data){
            if(data.length > 0)
            {
               var length = $('#cmb_Empleados_Rol ul').children('li').length;
                 if (length >0) 
                 {
                     $('#cmb_Empleados_Rol ul').empty();             
                 }
                    for(var i=0;i<data.length;i++)
                    {                       
                         $('#cmb_Empleados_Rol ul').append($('<li><a href="#">'+data[i].Rol+'</a></li>')); 
                    }       
            }
        },'json'); 
    }
//----------------------------------------------------------------------------------//
//Función que enlista las empresas existentes en dropdown ,Admin_Empleados,
    function Listar_cmb_Empleados_Empresa()
    {
        $.post('php/Funciones.php',{Accion:'Listar_cmb_Empleados_Empresa'},function(data){
            if(data.length > 0)
            {
               var length = $('#cmb_Empleados_Empresa ul').children('li').length;
                 if (length >0) 
                 {
                     $('#cmb_Empleados_Empresa ul').empty();             
                 }
                    for(var i=0;i<data.length;i++)
                    {                       
                         $('#cmb_Empleados_Empresa ul').append($('<li><a href="#">'+data[i].Empresa+'</a></li>')); 
                    }       
            }
        },'json'); 
    }
//----------------------------------------------------------------------------------//
    //Al seleccionar o cambiar el valor de  Empresa en modificar valor de QR
    $('#cmb_Empleados_Empresa').on('changed', function (evt, data) {
        $('#txt_Empleados_QrCode').val('');
        var _EmpleadoQr = $('#cmb_Empleados_Empresa').select('selectedItem').text +"-"+ $('#txt_Empleados_NumEmpleado').val();
        $('#txt_Empleados_QrCode').val(_EmpleadoQr);
        makeCode();
    });
//----------------------------------------------------------------------------------//
    //Keyup en txt_Empleados_NumEmpleado cambiar el valor de  empleado  modificar valor de QR
    $('#txt_Empleados_NumEmpleado').keyup(function(e){

        if($('#txt_Empleados_NumEmpleado').val().length > 0 )
        {
            $('#txt_Empleados_QrCode').val('');
            var _EmpleadoQr = $('#cmb_Empleados_Empresa').select('selectedItem').text +"-"+ $('#txt_Empleados_NumEmpleado').val();
            $('#txt_Empleados_QrCode').val(_EmpleadoQr);
            makeCode();

        }
            else if (e.which == 8) 
            {
                $('#txt_Empleados_QrCode').val('');
                var _EmpleadoQr = $('#cmb_Empleados_Empresa').select('selectedItem').text +"-"+ $('#txt_Empleados_NumEmpleado').val();
                $('#txt_Empleados_QrCode').val(_EmpleadoQr);
                makeCode();
            }
                else if (e.which == 46) 
                {
                    $('#txt_Empleados_QrCode').val('');
                    var _EmpleadoQr = $('#cmb_Empleados_Empresa').select('selectedItem').text +"-"+ $('#txt_Empleados_NumEmpleado').val();
                    $('#txt_Empleados_QrCode').val(_EmpleadoQr);
                     makeCode();
                }
    });
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
    // Aqui se crea el objeto QRCode
    var qrcode = new QRCode(document.getElementById("div_Empleados_QrCode"), {
        width: 256,
        height: 256,
        colorDark: "#206972",
        colorLight: "#FFFFFF",
        correctLevel : QRCode.CorrectLevel.H
    });
   //Funcion que genera el QR segun el txt y con makeCode() para que no se empilen los qr.
    function makeCode () 
    {
        var txtQr = document.getElementById('txt_Empleados_QrCode');
        if (!txtQr.value) {
            alert("No se puede generar QR vacios");
            txtQr.focus();
            return;
        }
        qrcode.makeCode(txtQr.value);
    }
//----------------------------------------------------------------------------------//
//Función que enlista los empleados existentes
    function Listar_Empleados(_Filtro)
    {
        if(typeof(_Filtro)==='undefined') _Filtro = "";
        $.post("php/Funciones.php",{Accion:"Listar_Empleados",Filtro:_Filtro},function(data){
            if(data.length > 0)
            {
                var _Empleados = "";
                for(var i=0;i<data.length;i++)
                {
                    _Empleados+= "<tr iEmpleado = '"+data[i].iEmpleado+"'>";
                        _Empleados+= "<td>"+data[i].EmpleadoQr+"</td>";
                        _Empleados+= "<td>"+data[i].Empresa+"</td>";
                        _Empleados+= "<td>"+data[i].EmpleadoNum+"</td>";
                        _Empleados+= "<td>"+data[i].Nombre+"</td>";
                        _Empleados+= "<td>"+data[i].Apellidos+"</td>";
                        _Empleados+= "<td>"+data[i].Rol+"</td>";
                        _Empleados+= "<td>"+data[i].Sucursal+"</td>";

                        if(data[i].Estatus == '1')
                            _Empleados+= "<td class='badge badge-success'>Activo</td>";
                        else
                            _Empleados+= "<td class='badge badge-danger'>Inactivo</td>";

                        _Empleados+= "<td>"+data[i].Fecha+"</td>";
                        _Empleados+= "<td><a href='#'><i class='icon-pencil editar_empleado'></i></a></td>";
                        _Empleados+= "<td><a href='#'><i class='icon-print imprimir_empleado'></i></a></td>";
                        _Empleados+= "<td><a href='#'><i class='icon-trash eliminar_empleado'></i></a></td>";
                        _Empleados+= "</tr>";
                }
                $('#tbody_Admin_Empleados').html(_Empleados);

                //Click en Editar/ Actualizar Empleado
                $('.editar_empleado').click(function(){
                    var _iEmpleado = $(this).closest("tr").attr("iEmpleado");
                    var _EmpleadoQr = $(this).closest("tr").find("td:eq(0)").html();
                    var _Empresa = $(this).closest("tr").find("td:eq(1)").html();
                    var _EmpleadoNum = $(this).closest("tr").find("td:eq(2)").html();
                    var _Nombre = $(this).closest("tr").find("td:eq(3)").html();
                    var _Apellidos = $(this).closest("tr").find("td:eq(4)").html();
                    var _Rol = $(this).closest("tr").find("td:eq(5)").html();
                    var _Sucursal = $(this).closest("tr").find("td:eq(6)").html();
                    var _Estatus = $(this).closest("tr").find("td:eq(7)").html();

    
                    $('#btn_Empleados_Aceptar').attr('iEmpleado',_iEmpleado);
                    $('#txt_Empleados_Nombre').val(_Nombre);
                    $('#txt_Empleados_Apellidos').val(_Apellidos);
                    $('#txt_Empleados_NumEmpleado').val(_EmpleadoNum);
                    $('#txt_Empleados_QrCode').val(_EmpleadoQr);

                    makeCode();
                //Obtener imagen QR que debe estar guardada en  img/_EmpleadosQr
                
                
                    $('#cmb_Empleados_Empresa').select('selectByText',_Empresa); 
                    $('#cmb_Empleados_Rol').select('selectByText',_Rol);
                    $('#cmb_Empleados_Sucursal').select('selectByText',_Sucursal);                    
                    $('#cmb_Empleados_Estatus').select('selectByText',_Estatus);
                    
                    Div_Display_Modal('Modal_Empleados');
                    $('#Modal_Empleados').modal('show');
                    Listar_cmb_Empleados_Sucursal();
                    Listar_cmb_Empleados_Rol();
                    Listar_cmb_Empleados_Empresa();
                });

                //Click en Imprimir Empleado  EN PROCESO

                //Click en Eliminar Empleado
                $('.eliminar_empleado').click(function(){
                    var _iEmpleado = $(this).closest("tr").attr("iEmpleado");
                    $.post('php/Funciones.php',{Accion:'Eliminar_Empleado',iEmpleado:_iEmpleado},function(data){
                        Listar_Empleados();
                        
                        Div_Display_Modal('Modal_Mensajes')
                        $('#Modal_Mensaje').html(data);
                        $('#Modal_Mensajes').modal('show');
                    });
                });
                
            }
        },"json");
    }
//----------------------------------------------------------------------------------//
//Click en btn_Empleados_Aceptar 
    $('#btn_Empleados_Aceptar').click(function(){
        //createQrCode();
        Actualizar_Empleado();
    });
//----------------------------------------------------------------------------------//
//Función que Actualiza Empleados
    function Actualizar_Empleado()
    {
        var _iEmpleado = $('#btn_Empleados_Aceptar').attr('iEmpleado');
        var _Nombre = $('#txt_Empleados_Nombre').val();
        var _Apellidos = $('#txt_Empleados_Apellidos').val();
        var _EmpleadoNum = $('#txt_Empleados_NumEmpleado').val();
        var _EmpleadoQr = $('#txt_Empleados_QrCode').val(); 
        
        var _Empresa = $('#cmb_Empleados_Empresa').select('selectedItem').text;
        var _Rol = $('#cmb_Empleados_Rol').select('selectedItem').text;
        var _Sucursal = $('#cmb_Empleados_Sucursal').select('selectedItem').text;
        var _Estatus = $('#cmb_Empleados_Estatus').select('selectedItem').text;

        //Guardar qr en  img/_EmpleadosQr

            if(_Estatus == 'Activo')
                _Estatus = '1';
            else
                _Estatus = '0';
            
            
            if(_iEmpleado != "0")
            {
                $.post("php/Funciones.php",{Accion:"Actualizar_Empleado",iEmpleado:_iEmpleado,Nombre:_Nombre,Apellidos:_Apellidos,EmpleadoNum:_EmpleadoNum,Empresa:_Empresa,EmpleadoQr:_EmpleadoQr,Rol:_Rol,Sucursal:_Sucursal,Estatus:_Estatus},function(data){
                    if($('#txt_Admin_Buscar_Empleados').val().length>0)
                        Listar_Empleados($('#txt_Admin_Buscar_Empleados').val());
                    else
                        Listar_Empleados();
                    $('#Modal_Empleados').modal('hide');
                });
            }
            else
            {
                $.post("php/Funciones.php",{Accion:"Agregar_Empleado",iEmpleado:_iEmpleado,Nombre:_Nombre,Apellidos:_Apellidos,EmpleadoNum:_EmpleadoNum,Empresa:_Empresa,EmpleadoQr:_EmpleadoQr,Rol:_Rol,Sucursal:_Sucursal,Estatus:_Estatus},function(data){
                    if($('#txt_Admin_Buscar_Empleados').val().length>0)
                        Listar_Empleados($('#txt_Admin_Buscar_Empleados').val());
                    else
                        Listar_Empleados();
                    $('#Modal_Empleados').modal('hide');
                });
            }
    }
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
                ///// *Administrador*Emergente \\\\\ 
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
     //Click en Buscar Emergentes
    $('#btn_Admin_Buscar_QrEmergente').click(function(){
        if($('#txt_Admin_Buscar_QrEmergente').val().length>0)
            Listar_RegistroQr_Emergente($('#txt_Admin_Buscar_QrEmergente').val());
        else
            Listar_RegistroQr_Emergente();
    });
//----------------------------------------------------------------------------------//
    //Click en btn_Admin_Agregar_Emergentes
    $('#btn_Admin_Agregar_QrEmergente').click(function(){
        $('#btn_Modal_Emergente').attr('iUsuario','0');
        
        $('#txt_Emergente_NumEmpleado').val('');
        $('#txt_Emergente_Nombre').val('');
        $('#txt_Emergente_Rol').val('');
       
        $('#txt_Modal_Motivo_Emergente').val('');

        $('#cmb_Emergente_Sucursal').select('selectByText','');
        $('#cmb_Emergente_Sucursal ul').empty();

        Listar_cmb_Emergentes_Sucursal();
        
        Div_Display_Modal('Modal_Emergente');
        $('#Modal_Emergente').modal('show');
    });

//----------------------------------------------------------------------------------//
//Función que enlista los sucursales existentes en dropdown Admin_Usuarios,
    function Listar_cmb_Emergentes_Sucursal()
    {
        $.post('php/Funciones.php',{Accion:'Listar_cmb_Emergentes_Sucursal'},function(data){
            if(data.length > 0)
            {
               var length = $('#cmb_Emergente_Sucursal ul').children('li').length;
                 if (length >0) 
                 {
                     $('#cmb_Emergente_Sucursal ul').empty();             
                 }
                   // var _Sucursales = "";                 
                    for(var i=0;i<data.length;i++)
                    {                       

                         $('#cmb_Emergente_Sucursal ul').append($('<li><a href="#">'+data[i].Sucursal+'</a></li>')); 
                    }       
            }
        },'json'); 
    }
//----------------------------------------------------------------------------------//
    //Función que enlista los registros emergentes
    function Listar_RegistroQr_Emergente(_Filtro){

        if(typeof(_Filtro)==='undefined') _Filtro = "";
        var _TipoRegistro ="Emergente";

        $.post("php/Funciones.php",{Accion:"Listar_RegistroQr_Emergente",Filtro:_Filtro,TipoRegistro:_TipoRegistro},function(data){
                if(data.length > 0)
                {
                    var _Registros = "";
                    for(var i=0;i<data.length;i++)
                    {
                        _Registros+= "<tr iRegistro= '"+data[i].iRegistro+"'>";
                        _Registros+= "<td>"+data[i].iEmpleado+"</td>";
                        _Registros+= "<td>"+data[i].Nombre+" "+data[i].Apellidos+"</td>";
                        _Registros+= "<td>"+data[i].FechaRegistro+"</td>";
                        _Registros+= "<td>"+data[i].iSucursal+"</td>";
                        _Registros+= "<td>"+data[i].Motivo+"</td>";
                        _Registros+= "<td>"+data[i].Usuario+"</td>";
                }
                $('#tbody_Admin_QrEmergente').html(_Registros);
            }   
        },"json");
    }
//----------------------------------------------------------------------------------//
    //Funcion que busca el empleado existente
     //Click en Buscar Emergentes
    $('#btn_Filtrar_Emergente_NumEmpleado').click(function(){
        if($('#txt_Emergente_NumEmpleado').val().length>0)
            Buscar_Empleado_RegistroQr_Emergente($('#txt_Emergente_NumEmpleado').val());
        else
        alert("Debe ingresar un numero de empleado");
    });
//----------------------------------------------------------------------------------//
    //Función que busca si el empleado existe 
    function Buscar_Empleado_RegistroQr_Emergente(_EmpleadoQr){

        $.post("php/Funciones.php",{Accion:"Buscar_Empleado_RegistroQr_Emergente",EmpleadoQr:_EmpleadoQr},function(data){
            if(data.length > 0)
            {
                //Encontró un sólo registro
                /*if(data.length == 1)
                {*/
                    $('#txt_Emergente_NumEmpleado').val(data[0].EmpleadoQr);
                    $('#txt_Emergente_Nombre').val(data[0].Nombre+" "+data[0].Apellidos);
                    $('#txt_Emergente_Rol').val(data[0].Rol);  
               /* }
                else
                {
                    //Encontró más de un registro, se abre modal para que eliga cuál verá.
                    var _Registros = "";
                    for(var i=0;i<data.length;i++)
                    {
                        _Registros+= "<tr class=\"empleado_ver\">";
                            _Registros+= "<td>"+data[i].EmpleadoQr+"</td>";
                            _Registros+= "<td>"+data[i].Nombre+" "+data[0].Apellidos+"</td>";
                            _Registros+= "<td>"+data[i].Rol+"</td>";
                            _Registros+= "<td><a href=\"#\"> <span class=\"icon-eye-open empleado_ver\"></span> </a></td>";
                        _Registros+= "</tr>";
                    }
                    $('#tbody_Empleados_Encontrados').html(_Registros);
                    Div_Display_Modal('Modal_Empleados_Encontrados');
                    $('#Modal_Empleados_Encontrados').modal('show');
                    
                    $('.empleado_ver').click(function(){
                        var _EmpleadoEncontrado = $(this).closest("tr").find("td:eq(0)").html();
                        Empleado_Seleccionado(_EmpleadoEncontrado);
                        $('#Modal_Empleados_Encontrados').modal('hide');
                        if ($('.modal-backdrop').is(':visible')) 
                        {
                           $('body').removeClass('modal-open'); 
                           $('.modal-backdrop').remove(); 
                        };

                    });
                }*/
            } 
            else
                alert("Numero de Empleado No Existe");
  
        },"json");
    }
//----------------------------------------------------------------------------------//
/*//Función que enlista el elmpleado seleccionado de la tabla. 
    function Empleado_Seleccionado(_EmpleadoQr){

        $.post("php/Funciones.php",{Accion:"Buscar_Empleado_RegistroQr_Emergente",EmpleadoQr:_EmpleadoQr},function(data){
            if(data.length > 0)
            {
  
                    $('#txt_Emergente_NumEmpleado').val(data[0].EmpleadoQr);
                    $('#txt_Emergente_Nombre').val(data[0].Nombre+" "+data[0].Apellidos);
                    $('#txt_Emergente_Rol').val(data[0].Rol);    
            }
  
        },"json");
    }*/
//----------------------------------------------------------------------------------//
//Click en btn_Emergentes_Aceptar 
    $('#btn_Modal_Emergente').click(function(){
        Agregar_Registro_Emergente();
    });
//----------------------------------------------------------------------------------//
//Función que agrega un registro emergente
    function Agregar_Registro_Emergente(){

        var _iUsuario = $('#lnk_Bienvenido').attr("iUsuario");
        var _TipoRegistro ="Emergente";
        var _EmpleadoQr = $('#txt_Emergente_NumEmpleado').val(); 
        var _Motivo= $('#txt_Modal_Motivo_Emergente').val();
        var _Sucursal = $('#cmb_Emergente_Sucursal').select('selectedItem').text;


            $.post("php/Funciones.php",{Accion:"Agregar_Registro_Emergente",EmpleadoQr:_EmpleadoQr,Sucursal:_Sucursal,iUsuario:_iUsuario,Motivo:_Motivo,TipoRegistro:_TipoRegistro},function(data){});
            
            
            var _Hora = $("#reloj").html();
            var _Mensaje = "";
                    _Mensaje+="Registro QR exitoso: | "+_EmpleadoQr+" | "+_Hora;
                
                    Div_Display_Modal('Modal_Mensajes')
                    $('#Modal_Mensaje').html(_Mensaje);
                    $('#Modal_Mensajes').modal('show');
            //Funcion que hace desaparecer el Modal Mensajes en 5 segundos
            setTimeout(function()
            { 
                $('#Modal_Mensajes').modal('hide'); 

            }, 3000); 
             $('#Modal_Emergente').modal('hide');
           
            Listar_RegistroQr_Emergente();            
    }  
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
                ///// *Administrador*Sucursales\\\\\ 
//----------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------//
    //Click en Buscar Sucursales
    $('#btn_Admin_Buscar_Sucursales').click(function(){
        if($('#txt_Admin_Buscar_Sucursales').val().length>0)
            Listar_Sucursales($('#txt_Admin_Buscar_Sucursales').val());
        else
            Listar_Sucursales();
    });
//----------------------------------------------------------------------------------//
    //Función que enlista los registros emergentes
    function Listar_Sucursales(_Filtro){

        if(typeof(_Filtro)==='undefined') _Filtro = "";
        $.post("php/Funciones.php",{Accion:"Listar_Sucursales",Filtro:_Filtro},function(data){
                if(data.length > 0)
                {
                    var _Sucursales = "";
                    for(var i=0;i<data.length;i++)
                    {
                        _Sucursales+= "<tr iSucursal= '"+data[i].iSucursal+"'>";
                        _Sucursales+= "<td>"+data[i].Sucursal+"</td>";
                        _Sucursales+= "<td>"+data[i].Tipo+"</td>";
                        _Sucursales+= "<td>"+data[i].Consultorio+"</td>";
                        _Sucursales+= "<td>"+data[i].Localidad+"</td>";
                        _Sucursales+= "<td>"+data[i].Calle+"</td>";
                        _Sucursales+= "<td>"+data[i].Zona+"</td>";
                        _Sucursales+= "<td>"+data[i].Colonia+"</td>";
                        _Sucursales+= "<td>"+data[i].Referencia+"</td>";

                        if(data[i].Estatus == '1')
                            _Sucursales+= "<td class='badge badge-success'>Activo</td>";
                        else
                            _Sucursales+= "<td class='badge badge-danger'>Inactivo</td>";

                        //_Sucursales+= "<td>"+data[i].Fecha+"</td>";
                        _Sucursales+= "<td><a href='#'><i class='icon-pencil editar_sucursales'></i></a></td>";
                        _Sucursales+= "<td><a href='#'><i class='icon-trash eliminar_sucursales'></i></a></td>";
                        _Sucursales+= "</tr>";
                }
                $('#tbody_Admin_Sucursales').html(_Sucursales);

                 //Click en Editar/ Actualizar Usuario
                $('.editar_sucursales').click(function(){
                    var _iSucursal = $(this).closest("tr").attr("iSucursal");
                    var _Sucursal = $(this).closest("tr").find("td:eq(0)").html();                    
                    var _Tipo = $(this).closest("tr").find("td:eq(1)").html();
                    var _Consultorio = $(this).closest("tr").find("td:eq(2)").html();
                    var _Localidad = $(this).closest("tr").find("td:eq(3)").html();
                    var _CalleNum = $(this).closest("tr").find("td:eq(4)").html();
                    var _Zona = $(this).closest("tr").find("td:eq(5)").html();
                    var _Colonia = $(this).closest("tr").find("td:eq(6)").html();
                    var _Referencia = $(this).closest("tr").find("td:eq(7)").html();
                    var _Estatus = $(this).closest("tr").find("td:eq(8)").html();

                    
                    $('#btn_Modal_Sucursales').attr('iSucursal',_iSucursal);
                    $('#txt_Sucursales_Sucursal').val(_Sucursal);
                    $('#cmb_Sucursales_Tipo').select('selectByText',_Tipo);
                    $('#cmb_Sucursales_Consultorio').select('selectByText',_Consultorio);
                    $('#cmb_Sucursales_Localidad').select('selectByText',_Localidad);

                    $('#txt_Sucursales_CalleNum').val(_CalleNum);
                    $('#txt_Sucursales_Zona').val(_Zona);
                    $('#txt_Sucursales_Colonia').val(_Colonia);
                    $('#txt_Sucursales_Referencia').val(_Referencia);
                    
                    $('#cmb_Sucursales_Estatus').select('selectByText',_Estatus);
        
                    Div_Display_Modal('Modal_Sucursales');
                    $('#Modal_Sucursales').modal('show');
                });

                //Click en Eliminar Usuario
                $('.eliminar_sucursales').click(function(){
                    var _iSucursal = $(this).closest("tr").attr("iSucursal");
                    $.post('php/Funciones.php',{Accion:'Eliminar_Sucursales',iSucursal:_iSucursal},function(data){
                        Listar_Sucursales();
                        
                        Div_Display_Modal('Modal_Mensajes')
                        $('#Modal_Mensaje').html(data);
                        $('#Modal_Mensajes').modal('show');
                    });
                });
            }   
        },"json");
    }
//----------------------------------------------------------------------------------//
    //Click en btn_Admin_Agregar_Sucursales
    $('#btn_Admin_Agregar_Sucursales').click(function(){ 
        $('#btn_Modal_Sucursales').attr('iSucursal','0');
        
        $('#txt_Sucursales_Sucursal').val('');
        $('#txt_Sucursales_Zona').val('');
        $('#txt_Sucursales_Colonia').val('');
        $('#txt_Sucursales_CalleNum').val('');
        $('#txt_Sucursales_Referencia').val('');
        
        Div_Display_Modal('Modal_');
        $('#Modal_Sucursales').modal('show');
    });

//----------------------------------------------------------------------------------//
    //Click en Buscar Sucursales
    $('#btn_Buscar_Sucursales_Sucursal').click(function(){
        if($('#txt_Sucursales_Sucursal').val().length>0)
            Buscar_Sucursal_Sucursales($('#txt_Sucursales_Sucursal').val());
        else
        alert("Debe ingresar un numero de sucursal");
    });
//----------------------------------------------------------------------------------//
    //Función que busca si la sucursal existe al presionar boton en modal
    function Buscar_Sucursal_Sucursales(_Sucursal){

        $.post("php/Funciones.php",{Accion:"Buscar_Sucursal_Sucursales",Sucursal:_Sucursal},function(data){
            if(data.length > 0)
            {       
                alert("Esta sucursal ya existe, no se puede duplicar");
                $('#Modal_Sucursales').modal('hide');


            } 
        else
                alert("Entrada de sucursal valida, por favor continue");

        },"json");
    }
//----------------------------------------------------------------------------------//
//Click en Aceptar del Modal Sucursales
    $('#btn_Modal_Sucursales').click(function(){

        Actualizar_Sucursales();
    });

    function Actualizar_Sucursales()
    {
        var _iSucursal = $('#btn_Modal_Sucursales').attr('iSucursal');
        
        var _Sucursal = $('#txt_Sucursales_Sucursal').val();
        var _Zona = $('#txt_Sucursales_Zona').val();
        var _Colonia = $('#txt_Sucursales_Colonia').val();
        var _CalleNum = $('#txt_Sucursales_CalleNum').val();
        var _Referencia = $('#txt_Sucursales_Referencia').val();
        
        var _Tipo = $('#cmb_Sucursales_Tipo').select('selectedItem').text;
        var _Consultorio = $('#cmb_Sucursales_Consultorio').select('selectedItem').text;
        var _Localidad = $('#cmb_Sucursales_Localidad').select('selectedItem').text;
        var _Estatus = $('#cmb_Sucursales_Estatus').select('selectedItem').text;

            if(_Estatus == 'Activo')
                _Estatus = '1';
            else
                _Estatus = '0';

            if(_iSucursal != "0")
            {
                $.post("php/Funciones.php",{Accion:"Actualizar_Sucursales",iSucursal:_iSucursal,Sucursal:_Sucursal,Zona:_Zona,Colonia:_Colonia,CalleNum:_CalleNum,Referencia:_Referencia,Tipo:_Tipo,Consultorio:_Consultorio,Localidad:_Localidad,Estatus:_Estatus},function(data){
                    if($('#txt_Admin_Buscar_Sucursales').val().length>0)
                        Listar_Sucursales($('#txt_Admin_Buscar_Sucursales').val());
                    else
                        Listar_Sucursales();
                    $('#Modal_Sucursales').modal('hide');

                });
            }
            else
            {
                $.post("php/Funciones.php",{Accion:"Agregar_Sucursales",iSucursal:_iSucursal,Sucursal:_Sucursal,Zona:_Zona,Colonia:_Colonia,CalleNum:_CalleNum,Referencia:_Referencia,Tipo:_Tipo,Consultorio:_Consultorio,Localidad:_Localidad,Estatus:_Estatus},function(data){
                    
                    Div_Display_Modal('Modal_Mensajes')
                    $('#Modal_Mensaje').html(data);
                    $('#Modal_Mensajes').modal('show');

                    if($('#txt_Admin_Buscar_Sucursales').val().length>0)
                        Listar_Sucursales($('#txt_Admin_Buscar_Sucursales').val());
                    else
                        Listar_Sucursales();
                    $('#Modal_Sucursales').modal('hide');
                });
            }
    }
//----------------------------------------------------------------------------------//
                    ///// Divs \\\\\ 
//----------------------------------------------------------------------------------//
//Función que Validar Divs
    function Mostrar_Div(_Div)
    {
        $('#Div_Login').addClass('display-none');
        $('#Div_QR_Scanner').addClass('display-none');
        $('#Div_Bandejas').addClass('display-none');
        $('#Div_Administrador').addClass('display-none');
        
        $('#'+_Div).removeClass('display-none');
    }
//----------------------------------------------------------------------------------//
    //Validar Div's Modales ya que empiezan a actuar raros...
    function Div_Display_Modal(_Div)
    {
        $('#Modal_Mensajes').css('display','none'); 
        $('#Modal_Motivo_Registro').css('display','none');
        $('#Modal_Usuarios').css('display','none'); 
        $('#Modal_Empleados').css('display','none');
        $('#Modal_Emergente').css('display','none');
        //$('#Modal_Empleados_Encontrados').css('display','none'); 
        $('#Modal_Sucursales').css('display','none'); 

        $('#'+_Div).css('display','block');
    }
//----------------------------------------------------------------------------------//
    
}); // Fin de $(document).ready(function(){//