<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash extends Admin
{
    protected $create_category = 'Нова категорія';
    protected $edit_category   = 'Редагувати категорію';
    protected $create_page     = 'Нова сторінка';
    protected $edit_page       = 'Редагувати сторінку';

    public function __construct()
    {
        parent::__construct();
    }

// ----------------------------------------------------------------------- DEFAULT METHOD
    public function index()
    {
        $this->_render('dash/list/admin');
        // $this->pages();
    }

// ------------------------------------------------------------------------ CATEGORIES LIST
    public function categories($pid = '0', $num = null, $offset = null)
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset($pid);

        // GET PARENT DATA
        $parent = $this->Dash_model->get_category($pid, true);

        // GET ALL CATEGORIES (if exist)
        $cats = $this->Dash_model->get_categories();

        // GET ELEMENTS FOR LIST
        $this->dash['elems'] = $this->Dash_model->get_categories($pid, $num, $offset);

        // RENDER CATEGORIES FOR LIST
        $this->dash['cats'] = $this->dash_lib->cats_list($cats, 'categories', 'pid');

        // GET PARENT CATEGORY
        $this->dash['parent'] = $parent ?? $this->dash_lib->parent_cat($cats);

        // PAGINATION
        $this->pagination('category', $pid);

        // RENDER LIST
        $this->dash['list'] = $this->load->view('pages_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('categories');
    }

// ------------------------------------------------------------------------ PAGES LIST
    public function pages($pid = '0', $num = null, $offset = null)
    {
        // SAVE PARENT ID, CAT ID AND BACK PATH TO SESSION
        $this->reset($pid);

        // GET PARENT DATA
        $parent = $this->Dash_model->get_category($pid, true);

        // GET ALL CATEGORIES (if exist)
        $cats = $this->Dash_model->get_categories();

        // GET PARENT CATEGORY
        $this->dash['parent'] = $parent ?? $this->dash_lib->parent_cat($cats);

        // RENDER CATEGORIES FOR LIST
        $this->dash['cats'] = $this->dash_lib->cats_list($cats, 'pages', 'pid');

        // GET PAGES FOR LIST
        $this->dash['elems'] = $this->Dash_model->get_pages($pid, $num, $offset);

        // GET PATH
        $this->dash['path'] = $this->path;

        // PAGINATION
        $this->pagination('page', $pid);

        // RENDER LIST
        $this->dash['list'] = $this->load->view('pages_table', $this->dash, true);

        // RENDER PAGE
        $this->_render('pages');
    }

// --------------------------------------------------------------------- PAGINATION
    public function pagination($type, $pid)
    {
        if ($this->_mod['default'][$type]['per_page'] > 0)
        {
            $count                    = ($type === 'category') ? 'count_it' : 'count_it_sec';
            $pagination['count']      = $this->Dash_model->$count(['pid' => $pid]);
            $pagination['per_page']   = $this->_mod['default'][$type]['per_page'];
            $this->dash['pagination'] = $this->load->view('dash/list/pagination', $pagination, true);
        }
        else
        {
            $this->dash['pagination'] = null;
        }
    }

// --------------------------------------------- SAVE/UPDATE/DELETE WITH SITEMAP UPDATE
    protected function save($type, $id = '')
    {
        parent::save($type, $id);
        $this->url_lib->make_sitemap();
        $this->url_lib->make_homepage();
    }

    public function del($type, $id = '')
    {
        parent::del($type, $id);
        $this->url_lib->make_sitemap();
        $this->url_lib->make_homepage();
    }

// ----------------------------------------------------------------- GET SLUG (AJAX)
    public function get_url_slug($pid)
    {
        $this->_isajax();

        echo $this->dash_lib->cat_slug($this->Dash_model->get_categories(), $pid, true);
    }

// ------------------------------------------------------------------------ PUB
    public function pub($elem, $id)
    {
        $this->Dash_model->pub($id);
        $this->url_lib->make_sitemap();
    }

// ---------------------------------------------------------------- CHECK URL (AJAX)
    public function url_check()
    {
        $this->_isajax();

        $page = $this->input->post();

        if ($page['old_url'] !== $page['url'] && $this->url_lib->url_check($page['url']) > 0)
        {
            echo json_encode($this->url_lib->url_rename($page));
        }

        return null;
    }

// -------------------------------------------------------- CHANGE CONTENT EDITOR FOR PAGE
    public function change_pagetype()
    {
        $this->_isajax();

        $data = $this->input->get();

        // Get category or page
        $pagecat = ($data['category']) ? 'category' : 'page';

        $create = 'create_' . $pagecat;
        $edit   = 'edit_' . $pagecat;

        // Get path to content editors
        $path = APPPATH . '../../mech/app/views/pageeditor/';
        // $path = APPPATH . '../../mech/modules/pages/views/editor/' . $pagecat . '/';

        // GET TEMPLATE FILES FROM PATH/DEFAULT MODULE TEMPLATES
        $files = (is_dir($path)) ? array_diff(scandir($path), array('.', '..')) : [];

        if (!empty($files))
        {
            foreach ($files as $file)
            {
                $name = str_replace('.php', '', $file);
                if ($name === $data['type'])
                {
                    $page = (!$data['id'])
                        ? $this->Dash_model->$create($this->_mod['default'], $data['pid'], $data['type'])
                        : $this->Dash_model->$edit($data['id'], $this->_mod['default'], $data['type']);

                    echo $page['editor'];
                }
            }
        }
        else
        {
            exit('Не знайдено шаблонів редактора для цього типу');
        }

        exit();

    }

// ---------------------------------------------- CHANGE TEMPLATES LIST FOR SELECTED PAGE TYPE
    public function change_pagetpl()
    {
        $this->_isajax();

        $data = $this->input->get();

        $elem = (!$data['id'])
            ? $this->Dash_model->create_category($this->_mod['default'], $data['type'])
            : $this->Dash_model->edit_category($data['id'], $this->_mod['default'], $data['type']);

        echo form_dropdown('options[subp_tpl]', $elem['page_tpl_select'], $elem['options']['subp_tpl'] ?? $elem['parent']['options']['subp_tpl'] ?? '', 'class="uk-width-large-1-5"');
    }

}
