<?php defined('BASEPATH') or exit('No direct script access allowed');

class Menu extends Frontend
{
    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------- SHOW MENU
    public function show_menu($pos)
    {
        $this->load->model('Menu_model');

        $menu = $this->Menu_model->view($pos);

        return (!empty($menu))
            ? $this->load->view('menu/' . $menu['tpl'] . '.tpl', $menu, true)
            : null;
    }

}
