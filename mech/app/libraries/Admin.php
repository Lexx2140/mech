<?php defined('BASEPATH') or exit('No direct script access allowed');

class Admin extends MX_Controller
{
    // All modules
    protected $_mods;

    // Current module
    protected $_mod;

    // Dashboard
    protected $dash;

    // Module path
    protected $path;

    public function __construct()
    {
        parent::__construct();

        // Load admin model
        $this->load->model('dash/Admin_model');

        // Get app config
        $this->app = $this->Admin_model->get_app_config();

        // Get current module & modules
        $this->get_modules();

        // Load Admin libraries
        $this->load->library('dash/dash_lib', ['module' => $this->_mod, 'app' => $this->app]);

        // Get language(s)
        $this->langs = $this->lang_lib->get_langs();

        // Profiler
        // $this->output->enable_profiler(true);
    }

// ------------------------------------------------ CHECK URL & LOGIN IF NOT AUTHORIZED
    public function _remap($method, $params = [])
    {
        if (method_exists($this, $method))
        {
            return ($this->_auth())
                ? call_user_func_array(array($this, $method), $params)
                : $this->_login();
        }

        show_404();
    }

// ------------------------------------------------------------------ ADMIN AUTHORIZATION CHECK
    protected function _auth()
    {
        // SET ADMIN MODE
        if (!$this->session->mode || $this->session->mode !== 'admin')
        {
            $this->session->set_userdata('mode', 'admin');
        }

        // DEV MODE/CHECK USER ROLE IN ADMIN MODE
        if (ENVIRONMENT === 'development')
        {
            return true;
        }

        if ($this->session->role === 'admin')
        {
            return true;
        }
    }

// ------------------------------------------------------------------ GET ALL MODULES
    protected function get_modules()
    {
        // GET ALL MODULES (system, plugins, medialib)
        $all_modules = $this->Admin_model->get_module();

        // CURRENT MODULE
        $this->_mod = $this->dash['mod'] = $all_modules['active'];

        // ALL MODULES
        $this->_mods = $all_modules;
    }

// ------------------------------------------------------------------ RESET PID & CAT_ID
    protected function reset($pid = '0', $cat_id = '0')
    {
        $this->session->set_userdata(['pid' => $pid, 'cat_id' => $cat_id]);
    }

// ----------------------------------------------------------------- Check if is AJAX request
    protected function _isajax()
    {
        if (!$this->input->is_ajax_request())
        {
            return show_404();
        }
    }

// ------------------------------------------------------------------------------- CREATE ELEMENT
    protected function create($type, $pid = null)
    {
        // GET TYPE
        $create       = 'create_' . $type;
        $this->credit = $this->$create;

        // GET ELEMENT DATA
        $elem = $this->Dash_model->$create($this->_mod['default'], $pid);

        // SAVE CONTROLLER
        $this->dash['save'] = $this->_mod['index'] . 'save/' . $type;

        // RENDER ELEMENT CREATE PAGE WITH DATA
        $this->dash['edit'] = $this->load->view($type . '_edit', $elem, true);

        // RENDER DASHBOARD
        $this->_render('dash/edit/element');
    }

// --------------------------------------------------------------------------------- EDIT ELEMENT
    protected function edit($type, $id)
    {
        // GET TYPE
        $edit         = 'edit_' . $type;
        $this->credit = $this->$edit;

        // GET ELEMENT DATA
        $elem = $this->Dash_model->$edit($id, $this->_mod['default']);

        // SAVE CONTROLLER
        $this->dash['save'] = $this->_mod['index'] . 'save/' . $type . '/' . $id;

        // RENDER ELEMENT EDIT PAGE WITH DATA
        $this->dash['edit'] = $this->load->view($type . '_edit', $elem, true);

        // RENDER DASHBOARD
        $this->_render('dash/edit/element');
    }

// --------------------------------------------------------------------------------- SAVE
    protected function save($type, $id = '')
    {
        // CHECK IF IS AJAX REQUEST
        $this->_isajax();

        // GET TYPE
        $get  = 'get_' . $type;
        $save = 'save_' . $type;

        // CHECK FOR VALIDATION RULES
        if (file_exists(APPPATH . '../modules/' . $this->_mod['name'] . '/config/form_validation.php'))
        {
            // LOAD VALIDATION RULES
            $val_config = $this->config->load('form_validation', true);

            if (array_key_exists($type . '_val', $val_config))
            {
                // FORM VALIDATION
                $this->load->library('form_validation');
                $this->form_validation->run($type . '_val') === true or exit(validation_errors());
            }
        }

        // GET OLD DATA (if isset)
        $old = ($id !== '') ? $this->Dash_model->$get($id) : null;

        // GET NEW INPUT DATA
        $new = $this->input->post();

        // SAVE NEW DATA
        $this->Dash_model->$save($old, $new);
    }

// ------------------------------------------------------------------------------- DELETE
    protected function del($type, $id = null)
    {
        // CHECK IF IS AJAX REQUEST
        $this->_isajax();

        // GET TYPE
        $get = 'get_' . $type;
        $del = 'del_' . $type;

        // ONE ELEMENT
        if ($id)
        {
            $elem = $this->Dash_model->$get($id);
            $this->Dash_model->$del($elem);
        }

        // MULTIPLE ELEMENTS
        else
        {
            $selected = json_decode($this->input->post('data'), true);

            foreach ($selected as $key => $item_id)
            {
                $elem = $this->Dash_model->$get($item_id);
                $this->Dash_model->$del($elem);
            }
        }
    }

// ---------------------------------------------------------------- CHANGE PUBLICATE STATUS
    protected function pub($type, $id)
    {
        // CHECK IF IS AJAX REQUEST
        $this->_isajax();

        // GET TYPE
        $pub = 'pub_' . $type;

        // CHANGE STATE
        $this->Dash_model->$pub($id);
    }

// ------------------------------------------------------------------------ SORT ELEMENTS
    protected function sort($type)
    {
        // CHECK IF IS AJAX REQUEST
        $this->_isajax();

        // GET TYPE
        $sort = 'sort_' . $type;

        // GET NEW ORDER FROM INPUT
        $order = json_decode($this->input->post('data'), true);

        // CREATE NEW ORDER ARRAY (id => sort)
        foreach ($order as $key => $value)
        {
            $items['id']   = $key;
            $items['sort'] = $value;
            $new_order[]   = $items;
        }

        // SORT
        $this->Dash_model->$sort($new_order);
    }

// -------------------------------------------------------------------- RENDER ADMIN DASHBOARD
    protected function _render($tpl)
    {
        // RENDER DASH MENU(s)
        $dash['sidebar'] = $this->load->view('dash/dash/sidebar.tpl', $this->_mods, true);

        // RENDER DASH CONTENT
        $dash['dash_content'] = $this->load->view($tpl, $this->dash, true);

        // RENDER DASHBOARD
        $index['content'] = $this->load->view('dash/dash/dash.tpl', $dash, true);

        // GET ADDITIONAL SCRIPTS (WYSIWYG, i.e.)
        $index['scripts'] = $this->load->view('dash/dash/scripts.tpl', null, true);

        // RENDER INDEX PAGE
        $this->load->view('dash/index', $index);
    }

// ------------------------------------------------------------------ RENDER ADMIN LOGIN PAGE
    protected function _login()
    {
        // REDIRECT TO ADMIN HOME PAGE (if not)
        $admin = base_url('admin');

        if (current_url() !== $admin)
        {
            redirect($admin);
        }

        // LOAD REDIRECT
        $login['redirect'] = $admin;

        // RENDER ADMIN LOGIN PAGE
        $index['content'] = $this->load->view('pages/system/admin_login.tpl', $login, true);

        $this->load->view('dash/index', $index);
    }

// ------------------------------------------------------------------- SETUP (SITE/MODULE)
    protected function setup()
    {
        // GET SRC
        $src = $this->uri->segment(2);

        // GET CONFIGURATION DATA
        $setup = $this->Dash_model->get_setup();

        $this->dash['title'] = $this->_mod['title'];
        $this->dash['save']  = $this->_mod['index'] . 'save_setup';

        // LOAD SETUP EDITOR TEMPLATE
        $tpl                   = ($src === 'dash') ? 'dash/edit/app_setup' : $src . '/setup';
        $this->dash['content'] = $this->load->view($tpl, $setup, true);

        // RENDER PAGE
        $this->_render('dash/edit/setup');
    }

// ------------------------------------------------------------------- SAVE SETUP
    public function save_setup()
    {
        $this->Dash_model->save_setup();
    }

// ------------------------------------------------------------------------ FILE UPLOAD
    public function file_upload()
    {
        $this->_isajax();
        echo $this->media_lib->edit_media();
    }

// -------------------------------------------------------- FONTAWESOME ICONS SELECT LIST
    protected function icon_select()
    {
        $this->_isajax();

        // GET ICON FOR ITEM
        $data['icons'] = $this->load->config('dash/fawicons', true);
        echo $this->load->view('dash/media/icons_modal', $data);
    }

}
