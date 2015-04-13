<?php

class Config {

    private static $conf = array();

    public function load() {
        self::$conf = json_decode(file_get_contents(dirname(__file__) . '/config.json'));
        //var_dump(self::$conf);
    }

    public function set($name, $value) {
        self::$conf->$name = $value;
    }

    public function get($name) {
        /* if (!array_key_exists($name, self::$conf)) */
        /*   throw new Exception('Config '.$name.' does not exist.'); */

        return self::$conf->$name;
    }

}
