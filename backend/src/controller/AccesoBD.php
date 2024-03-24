<?php
namespace App\controller;

use PDO;
use PDOException;
use Psr\Container\ContainerInterface;

class AccesoBD{

    protected $container;
    public function __construct(ContainerInterface $c){$this->container = $c;}
    private function generarParam($datos){
        $cad ="(";
        foreach($datos as $campo=>$valor){
            $cad.=":$campo,";
        }
        $cad = trim($cad,',');
        $cad .=");";
        return $cad;
    }
    public function crearBD($datos,$recurso){
        $params = $this ->generarParam($datos);
        $sql = "SELECT nuevo$recurso$params";
        $d = [];
        foreach ($datos as $clave => $valor) $d[$clave] = $valor;
        $con = $this -> container->get('bd');
        $query = $con->prepare($sql);
       // var_dump($query); die();
        $query ->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con=null;
        return $res[0];
    }
    public function crearUsrBD($datos,$recurso,$rol,$campoId){
        $passw = $datos -> passwI;
        unset($datos->passwI);//deshacer password o excluir el dato
        $params = $this ->generarParam($datos);
        $con = $this -> container->get('bd');
        $con -> beginTransaction();//inicie la transacción

        try {
        $sql = "SELECT nuevo$recurso$params";
        $query = $con->prepare($sql);
        $d = [];
        foreach ($datos as $clave => $valor) $d[$clave] = filter_var($valor,FILTER_SANITIZE_SPECIAL_CHARS);
        $query ->execute($d);  
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        //crear usuario
        $sql = "SELECT nuevoUsuario(:idUsuario,:idRol,:passw);";
        $query = $con->prepare($sql);
        $query ->execute(array(
            'idUsuario' => $d[$campoId],
            'idRol' => $rol,
            'passw' => $passw
        ));  
        $con -> commit();//aplica las transacciones
        } catch (PDOException $ex ) {
            print_r($ex->getMessage());//se quita en produccion 
            $con -> rollback();// rollback es para deshacer la transaccion
            $res = 2; //error general
        }
        $query = null;
        $con=null;
        return $res[0];
    } 
    public function numRegsBD($datos , $recurso){
        $cadena="";
        foreach ($datos as $valor){ $cadena .="%$valor%&";}
        $sql= "call numRegs$recurso('$cadena')";
        $con = $this ->container-> get('bd');
        $query = $con -> prepare($sql);
        $query -> execute();
        $res = $query -> fetch(PDO::FETCH_NUM)[0];//fetch consultar datos y all todo
        $query=null;
        $con=null;
        return $res;
    }
   public function filtarBD($args, $datos , $recurso){
        $limite=$args['limite'];
        $pagina=($args['pagina']-1)*$limite;
        $cadena="";
        foreach ($datos as $valor){ $cadena .="%$valor%&";}
        $sql= "call filtrar$recurso('$cadena',$pagina,$limite)";
        $con = $this ->container-> get('bd');
        $query = $con -> prepare($sql);
        $query -> execute();
        $res = $query -> fetchAll();
        $query=null;
        $con=null;
        $datosRetorno['datos'] = $res;
        $datosRetorno['regs']=$this ->numRegsBD($datos,$recurso);
        return $datosRetorno;
    }

    /*public function editarBD($datos,$recurso,$id){
        $params = $this ->generarParam($datos);
        $params = substr($params,0,1).":id,". substr($params,1);
        $sql = "SELECT editar$recurso$params";
        $d ['id']=$id;
        foreach ($datos as $clave => $valor) $d[$clave] = $valor;
        $con = $this -> container->get('bd');
        $query = $con->prepare($sql);
        //var_dump($query);die();
        $query ->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con=null;
        return $res[0];     
    }*/

    public function editarBD($datos,$recurso,$id){
        $params = $this ->generarParam($datos);
        $params = substr($params,0,1).":id,". substr($params,1);
        $sql = "SELECT editar$recurso$params";
        $d ['id']=$id;
        foreach ($datos as $clave => $valor) $d[$clave] = $valor;
        $con = $this -> container->get('bd');
        $query = $con->prepare($sql);
        $query ->execute($d);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con=null;
        return $res[0]; 
    }


    public function buscarBD($id, $recurso){
        $sql="CALL buscar$recurso(0,:id);";
        $con=$this -> container-> get('bd');
        $query = $con -> prepare($sql);
        $query -> execute (['id' => $id]);
        $res =$query -> fetch(pdo::FETCH_ASSOC);
        $query =null;
        $con=null;
        return $res;
    }

    public function eliminarBD($id, $recurso){
        $sql="SELECT eliminar$recurso(:id);";
        $con = $this -> container->get('bd');
        $query = $con->prepare($sql);
        //var_dump($sql);die();
        $query ->execute(["id"=>$id]);
        $res = $query->fetch(PDO::FETCH_NUM);
        $query = null;
        $con=null;
        return $res[0];
    }

    public function cambiarPropietarioBD($d){
        $params = $this ->generarParam($d);
        $sql = "SELECT cambiarPropietario$params";
        $con = $this -> container->get('bd');
        $query = $con->prepare($sql);
        $query -> bindParam(':id',$d['id'],PDO::PARAM_INT);
        $query -> bindParam(':idCliente',$d['idCliente'],PDO::PARAM_INT);
        $query ->execute();
        $res = $query->fetch(PDO::FETCH_NUM)[0];
        $query = null;
        $con=null;
        return $res;
    }

    public function editarUsuario(String $idUsuario, int $idRol=-1, string $passwN = ''){

        $proce = $idRol == -1 ? 'select passwUsuario(:idUsuario,:passw);': 
        'select rolUSuario(:idUsuario,:idRol);';
    
        $sql = "call buscarUsuario(0,$idUsuario);";
        
        $con = $this -> container->get('bd');
        $query = $con->prepare($sql);

         $query ->execute();
        $usuario = $query ->fetch(pdo::FETCH_ASSOC);
        //var_dump($usuario);die();

        if($usuario){
            $params = ['idUsuario'=> $usuario['idUsuario']];
            $params = $idRol == -1 ? array_merge($params,['passw'=> $passwN])://unir arreglos
                                array_merge($params,['idRol'=> $idRol]);
            $query =$con->prepare($proce);

            $retorno = $query->execute($params);
        }else{
            $retorno = false;
        }
        $query = null;
        $con = null;
        return $retorno;
    }

    public function buscarUsr(int $id=0,string $idUsuario=''){
        $con=$this -> container-> get('bd');
        $query = $con -> prepare("CALL buscarUsuario($id,$idUsuario);");
        $query -> execute ();
        $res =$query -> fetch();//me hace un objeto si no le pongo el tipo
        $query =null;
        $con=null;
        return $res;
    }
    
    public function buscarNombre($id, string $tipoUsuario){
        $proc= 'buscar'.$tipoUsuario."(0,'$id')";
        $sql = "CALL $proc";
        $con=$this -> container-> get('bd');
        $query = $con -> prepare($sql);
        $query -> execute();
       
        if ($query -> rowCount() > 0) {
           $res= $query -> fetch(pdo::FETCH_ASSOC);
        }else{
            $res=[];
        }
        $query =null;
        $con=null;
        $res = $res['nombre'];
        if(str_contains($res, ' ')){
            $res = substr($res, 0, strpos($res,' '));}//me trae solo el primer nombre
        return $res;
    }
        
    public function accederToken( string $proc,string $idUsuario,string $tokenRef=""){
        
        $sql = $proc == 'modificar'? "select modificarToken(:idUsuario,:tk);":
            "CALL verificarToken(:idUsuario,:tk);";
            
            $con=$this -> container-> get('bd');
            $query = $con -> prepare($sql);
            $query -> execute(["idUsuario"=>$idUsuario, "tk"=> $tokenRef]);
            if ($proc == "modificar") {
               $datos = $query->fetch(PDO::FETCH_NUM);
            }else{
                $datos = $query->fetchColumn();
            }
        $query =null;
        $con=null;
        return $datos;
    }
}





