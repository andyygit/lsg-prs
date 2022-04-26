<?php
class DB {
    private static $_instance = null;
    private $_pdo,
            $_query,
            $_error = false,
            $_results,
            $_count;
    private function __construct() {
        try {
            $this->_pdo = new PDO('mysql:host=localhost;dbname=?', '?', '?');
            $this->_pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->_pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $e) {
            die ($e->getMessage());
        }
    }
    public static function getInstance() {
        if(!isset(self::$_instance)) {
            self::$_instance = new DB();
        }
        return self::$_instance;
    }
    public function query($sql, $params = array()) {
        $this->_error = false;
        if ($this->_query = $this->_pdo->prepare($sql)) {
            $x = 1;
            if (count($params)) {
                foreach ($params as $param) {
                    $this->_query->bindValue($x, $param);
                    $x++;
                }
            }
        }
        if ($this->_query->execute()) {
            $this->_results = $this->_query->fetchAll(PDO::FETCH_ASSOC);
            $this->_count = $this->_query->rowCount();
        } else {
            $this->_error = true;
        }
        return $this;
    }
    public function error() {
        return $this->_error;
    }
    public function count() {
        return $this->_count;
    }
    public function results() {
        return $this->_results;
    }
    public function first() {
        return $this->_results()[0];
    }
}

if (isset($_POST['colet'])) {
    $in = DB::getInstance()->query("INSERT INTO epantofi (id) VALUES (?)", array(
        'id' => $_POST['colet']
    ));
    if ($in->error()) {
        echo json_encode(array(
            'msg' => 'Error writing to db'
        ));
    } else {
        echo json_encode(array(
            'msg' => 'OK'
        ));
    }
} else if (isset($_POST['awb'])) {
    $out = DB::getInstance()->query("SELECT id FROM epantofi WHERE id = ?", array(
        'id' => $_POST['awb']
    ));
    
    if (!$out->count()) {
        echo json_encode(array(
            'msg' => 'No results found!'
        ));
    } else {
        echo json_encode(array(
            'msg' => 'For this parcel a order has been already issued!'
        ));
    }
}