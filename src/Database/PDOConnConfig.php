<?php

namespace Database {
    class PDOConnConfig {
        /**
         * Summary of _host
         * @var 
         */
        private $_host;
        /**
         * Summary of _db
         * @var 
         */
        private $_db;
        /**
         * Summary of _user
         * @var 
         */
        private $_user;
        /**
         * Summary of _pass
         * @var 
         */
        private $_pass;

        /**
         * Summary of _charset
         * @var 
         */
        private $_charset;

        /**
         * Summary of _options
         * @var array
         */
        private $_options = [];

        public function __construct() {

        }

        public function getString() {
            return "mysql:host=" . $this->getHost() . ";dbname=" . $this->getDb() . ";charset=" . $this->getCharset();
        }

        public function host($host) {
            $this->_host = $host;
            return $this;
        }

        public function user($user): static {
            $this->_user = $user;
            return $this;
        }

        public function pass($pass): static {
            $this->_pass = $pass;
            return $this;
        }

        public function db($db): static {
            $this->_db = $db;
            return $this;
        }

        public function charset($cs): static {
            $this->_charset = $cs;
            return $this;
        }
        public function options($opts): static {
            $this->_options = $opts;
            return $this;
        }

        public function getOptions() {
            return $this->_options;
        }

        public function getHost() {
            return $this->_host;
        }

        public function getDb() {
            return $this->_db;
        }

        public function getCharset() {
            return $this->_charset;
        }

        public function getUser() {
            return $this->_user;
        }
        public function getPassword() {
            return $this->_pass;
        }
        
        public static function create() {
            return new PDOConnConfig();
        }
    }
}
