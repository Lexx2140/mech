<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    protected $create_medialib = 'Нова бібліотека';
    protected $edit_medialib   = 'Редагувати бібліотеку';
    protected $create_item     = 'Новий елемент';
    protected $edit_item       = 'Редагувати елемент';

    protected $path = 'assets/media/libs/';

    public function __construct()
    {
        parent::__construct();
    }

// ----------------------------------------------------------------------- DEFAULT METHOD
    public function index()
    {
        $this->list();
    }

// ------------------------------------------------------------------------ LIBRARIES LIST
    function list($type = null)
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset();

        // GET ITEMS FOR LIST (by type - optional)
        $this->dash['elems'] = $this->Dash_model->get_medialibs($type);

        // RENDER LIST
        $this->dash['list'] = $this->load->view('medialibs_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('medialibs');
    }

// ------------------------------------------------------------------------ ITEMS LIST
    public function items($pid, $page_id = null)
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset($pid);

        // GET LIBRARY DATA
        $this->dash['lib'] = $this->Dash_model->get_medialib($pid);

        // GET PATH
        $this->dash['path'] = $this->path . $this->dash['lib']['name'] . '/';

        // GET ITEMS & RENDER LIST
        $this->dash['elems'] = $this->Dash_model->get_items($pid, $page_id);

        // RENDER LIST
        $this->dash['list'] = $this->load->view('items_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('items');
    }

// ---------------------------------------------------------- ITEMS LIST FOR CURRENT PAGE
    public function page_list()
    {
        $this->_isajax();

        $lib_id = $this->input->get('lib_id');

        // GET LIBRARY DATA
        $lib['lib'] = $this->Dash_model->get_medialib($lib_id);

        // GET PATH
        $lib['path'] = $this->path . $lib['lib']['name'] . '/';

        // GET ITEMS & RENDER LIST
        $lib['elems'] = $this->Dash_model->get_items($lib_id);

        // OPEN MODAL WITH ITEMS LIST
        $data['list'] = $this->load->view('items_modal_table', $lib, true);

        echo $this->load->view('items_modal', $data, true);
    }

// -------------------------------------------------------------- MEDIALIB TEMPLATE SELECT
    public function tpl_select()
    {
        $this->_isajax();

        $type = $this->input->get('type');

        // TEMPLATE SELECT
        $tpl_select = $this->dash_lib->get_tpls('assets/tpl/medialib/' . $type . '/');

        echo form_dropdown('options[tpl]', $tpl_select, null);
    }

// -------------------------------------------------------------- SELECT MEDIA SRC TYPE
    public function mediasrc_select()
    {
        $this->_isajax();

        $data = $this->input->get();

        $item = (!$data['id'])
            ? $this->Dash_model->create_item($this->_mod['default'], $data['pid'], $data['src'])
            : $this->Dash_model->edit_item($data['id'], $this->_mod['default'], $data['src']);

        echo $item['media_edit'];
    }
}
