<?php

namespace Database {
    class MySQLPDODatabase {

        private bool $connected          = false;
        private string $connectionString;

        private \PDO $connection;

        private PDOConnConfig $config;
        private $errorMessage = null;
        private $errorCode    = null;

        public function __construct(PDOConnConfig $config) {
            $this->config           = $config;
            $this->connectionString = $config->getString();
        }

        public function getConnection(): \PDO {
            return $this->connection;
        }

        public function connect(): bool {
            if ($this->connected)
                return true;

            try {
                $this->connection = new \PDO(
                    $this->connectionString, 
                    $this->config->getUser(), 
                    $this->config->getPassword(), 
                $this->config->getOptions()
                );

                return true;
            } catch(\PDOException $ex) {
                $this->errorMessage = $ex->getMessage();
                $this->errorCode    = $ex->getCode();
            }

            return false;
        }
    };
}