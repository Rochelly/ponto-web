<?php
require_once(dirname(__file__).'/../../conf/Config.php');

class LDAPResult {

    private $conn = null;
    private $sr = null;
    private $entry = null;

    public function __construct($conn, $sr) {
        $this->conn = $conn;
        $this->sr = $sr;
    }

    public function first() {
        $this->entry = ldap_first_entry($this->conn, $this->sr);
        return ldap_get_attributes($this->conn, $this->entry);
    }

    public function next() {
        $this->entry = ldap_next_entry($this->conn, $this->entry);
        return ldap_get_attributes($this->conn, $this->entry);
    }

    public function entry_dn() {
        return ldap_get_dn($this->conn, $this->entry);
    }

}

class Ldap {
    private $ldapbind;
    private $ldapconn;

    public function getLdapbind() {
        return $this->ldapbind;
    }

    public function getLdapconn() {
        return $this->ldapconn;
    }

    public function __construct() {
        Config::load();
        
        $this->ldapconn = ldap_connect(Config::get('ldap_host')) or die("Não foi possível conectar com o LDAP server.");
        if ($this->ldapconn) {
            ldap_set_option($this->ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
            if (Config::get('ldap_tls') && !ldap_start_tls($this->ldapconn)) {
                echo "start_tls fail";
                ldap_close($this->ldapconn);
                return;
            }

            $this->ldapbind = ldap_bind($this->ldapconn, Config::get('ldap_admin'), Config::get('ldap_passwd'));
        } else {
            echo "Unable to connect to LDAP server";
        }
    }

    public function bind($user_dn, $password) {
        return ldap_bind($this->ldapconn, $user_dn, $password);
    }

    public function close() {
        ldap_close($this->ldapconn);
    }

    public function search($base_dn, $filter, $attrs) {
        $sr = ldap_search($this->ldapconn, $base_dn, $filter, $attrs);
        return new LDAPResult($this->ldapconn, $sr);
    }

}

?>