<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    protected $create_group = 'Нова група';
    protected $edit_group   = 'Редагувати групу';
    protected $create_user  = 'Новий користувач';
    protected $edit_user    = 'Редагувати користувача';

    protected $path = 'assets/img/users';

    public function __construct()
    {
        parent::__construct();
    }

// ----------------------------------------------------------------------- DEFAULT METHOD
    public function index()
    {
        $this->groups();
    }

// ------------------------------------------------------------------------ MENU LIST
    public function groups()
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset();

        // GET ITEMS FOR LIST
        $this->dash['elems'] = $this->Dash_model->get_groups();

        // RENDER LIST
        $this->dash['list'] = $this->load->view('groups_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('groups');
    }

// ------------------------------------------------------------------------ ITEMS LIST
    public function users($pid)
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset($pid);

        // GET PARENT GROUP DATA
        $this->dash['parent'] = $this->Dash_model->get_group($pid);

        // GET ITEMS FOR LIST
        $this->dash['elems'] = $this->Dash_model->get_users($pid);

        // RENDER LIST
        $this->dash['list'] = $this->load->view('users_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('users');
    }

}
