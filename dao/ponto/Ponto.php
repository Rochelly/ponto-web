<?php

require_once(dirname(__file__).'/../../conf/Config.php');

class Ponto {
    private function request($method, $parms = null) {
        Config::load();
    	if ($parms){
            $uri = Config::get('api_uri') . '/' . $method . '/' . implode('/', $parms);
        }
        else
            $uri = Config::get('api_uri') . '/' . $method;

        $response = json_decode(file_get_contents($uri));
        $result = $response->result;
        $data = pack('H*', $result);

        $key = Config::get('api_key');
        $iv = Config::get('api_iv');

        $data = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $data, MCRYPT_MODE_CBC, $iv);


        $pos_a = strrpos($data, '}');
        $pos_b = strrpos($data, ']');
        $len = ($pos_a > $pos_b) ? ++$pos_a : ++$pos_b;
        $data = substr($data, 0, $len);

	//var_dump($uri, json_decode(file_get_contents($uri)), $data, json_decode($data));

        $json = json_decode($data);
        return $json;
    }

    public function __call($name, $args) {
        return $this->request($name, $args);
    }

    public function ultima_atualizacao() {
        return $this->request('ultima_atualizacao')->ultima_atualizacao;
    }
}
