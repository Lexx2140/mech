<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    protected $create_menu = 'Нове меню';
    protected $edit_menu   = 'Редагувати меню';
    protected $create_item = 'Новий пункт';
    protected $edit_item   = 'Редагувати пункт меню';

    public function __construct()
    {
        parent::__construct();
    }

// ----------------------------------------------------------------------- DEFAULT METHOD
    public function index()
    {
        $this->menu();
    }

// ------------------------------------------------------------------------ MENU LIST
    public function menu()
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset();

        // GET ITEMS FOR LIST
        $this->dash['elems'] = $this->Dash_model->get_menus();

        // RENDER LIST
        $this->dash['list'] = $this->load->view('menus_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('menus');
    }

// ------------------------------------------------------------------------ ITEMS LIST
    public function items($pid, $cat_id = '0')
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset($pid, $cat_id);

        // GET PARENT DATA
        $parent = $this->Dash_model->get_menu($pid);

        // GET ALL CATEGORIES (if exist)
        $cats = $this->Dash_model->get_cats($pid);

        // GET PARENT CATEGORY
        $this->dash['parent'] = $parent ?? $this->dash_lib->parent_cat($cats);

        // RENDER CATEGORIES FOR LIST
        $this->dash['cats'] = $this->dash_lib->cats_list($cats, 'items', 'cat_id', $pid);

        // GET ITEMS FOR LIST
        $this->dash['elems'] = $this->Dash_model->get_items($pid, $cat_id);

        // RENDER LIST
        $this->dash['list'] = $this->load->view('items_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('items');
    }

// ------------------------------------------------------------------------ COPY MENU/ITEMS
    public function copy($type, $id)
    {
      if ($type === 'menu')
      {
        $this->Dash_model->copy_menu($id);
      }

      if ($type === 'item')
      {
        $this->Dash_model->copy_item($id);
      }
    }
}
