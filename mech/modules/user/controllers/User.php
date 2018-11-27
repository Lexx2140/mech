<?php defined('BASEPATH') or exit('No direct script access allowed');

class User extends Frontend
{
    protected $ip;

    public function __construct()
    {
        parent::__construct();
        $this->load->model('User_model');
    }

// ------------------------------------------------------------------------ LOGIN
    public function login()
    {
        // GET INPUT
        $login = $this->input->post();

        // CHECK INPUT
        !empty($login) or show_404();

        // FIND USER IN DB
        $user = $this->User_model->get_user($login['login']);

        // CHECK IF USER EXISTS
        if (!$user)
        {
            echo 'Користувача з таким іменем не знайдено!';
        }
        else
        {
            // CHECK USER PASSWORD
            password_verify($login['pass'], $user['pass'])
                ? $this->session->set_userdata('role', $user['role'])
                : $this->_bruteout();
        }

    }

// ----------------------------------------------------------------- ANTI BRUTE FORCE
    private function _bruteout()
    {
        // GET/SET USER IP
        // $this->ip = (!$this->ip) ? $this->input->ip_address() : $this->ip;

        // echo $this->ip;

        echo ('Невірний пароль');

        // $try = $this->session->try;

        // $addtry = (!isset($try)) ? ['try' => '1'] : ['try' => $try + 1];
        // $this->session->set_userdata($addtry);

        // if ($try >= '5')
        // {
        //     $this->session->sess_destroy();
        //     $this->logout();
        //     // exit('Досить себе мучити!!!');
        // }
    }

// ------------------------------------------------------------------------ LOGOUT
    public function logout()
    {
        $back = ($this->session->mode === 'admin') ? 'admin' : '';

        $this->session->sess_destroy();
        redirect(base_url($back));
    }

}
