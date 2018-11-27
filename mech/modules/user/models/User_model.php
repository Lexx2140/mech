<?php defined('BASEPATH') or exit('No direct script access allowed');

class User_model extends MY_Model
{
    protected $_table   = 'users_groups';
    protected $_table2  = 'users';
    protected $_select  = 'id, title, role, sort';
    protected $_select2 = 'id, sort, login, email';

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------ GET USER FROM DB
    public function get_user($login)
    {
        return
        $this->db
             ->select('users.*')
             ->select('users_groups.title, users_groups.role')
             ->from('users')
             ->where('users.login', $login)
             ->join('users_groups', 'users_groups.id=users.pid')
             ->get()->row_array();
    }

}
