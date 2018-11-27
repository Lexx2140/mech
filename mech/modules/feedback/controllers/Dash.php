<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    protected $create_parent = 'Нова форма';
    protected $edit_parent   = 'Редагувати форму';
    protected $create_item   = 'Нове поле';
    protected $edit_item     = 'Редагувати поле';

    public function __construct()
    {
        parent::__construct();
    }
}
