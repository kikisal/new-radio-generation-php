<?php

namespace Core\Session {
    class UserSession implements IUserSession {
        private static $_sessionInstance = null;

        private $sessionDataTable = [];

        public function __construct() {
            $this->initSession();
        }

        public function initSession() {
            session_start();

            $this->sessionDataTable = $_SESSION;
        }

        public function value(string $key): ?string {
            if ($this->has($key))
                return $this->sessionDataTable[$key];
            return null;
        }

        public function store(string $key, string $value): void {
            $this->sessionDataTable[$key] = $value;
        }
        public function delete(string $key): bool {
            if (isset($this->sessionDataTable[$key])) {
                unset($this->sessionDataTable[$key]);
                return true;
            }

            return false;
        }

        public function has(string $key): bool {
            return isset($this->sessionDataTable[$key]);
        }

        public static function instance(): IUserSession {
            return self::$_sessionInstance ? self::$_sessionInstance : self::$_sessionInstance = new UserSession();
        }   
    }
}