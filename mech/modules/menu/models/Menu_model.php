<?php defined('BASEPATH') or exit('No direct script access allowed');

class Menu_model extends MY_Model
{
    private $lang_id;

    protected $_table  = 'menu';
    protected $_table2 = 'menu_items';

    public function __construct()
    {
        parent::__construct();
        $this->lang_id = $this->session->app_lang['id'];
    }

// ------------------------------------------------------------------ GET ITEMS
    public function get_items($pid)
    {
        return
        $this->db
             ->select('menu_items.id, menu_items.cat_id, menu_items.pid, menu_items.icon, menu_items.link, menu_items.url_id, menu_items.anchor, menu_items.target, menu_items.item_type, menu_items.pub')
             ->select('pages.url, pages.home')
             ->select('menu_items_desc.title, menu_items_desc.seo_title')
             ->from('menu_items')
             ->where('menu_items.pid', $pid)
             ->where('menu_items.pub', 1)
             ->order_by('menu_items.sort ASC')
             ->join('pages', 'pages.id=menu_items.url_id', 'left')
             ->join('menu_items_desc', 'menu_items_desc.id=menu_items.id AND menu_items_desc.lang_id=' . $this->lang_id, 'left')
             ->get()->result_array();
    }

// ---------------------------------------------------------------------- GET MENU
    public function get_menu($pos)
    {
        return $this->get_row(['pos' => $pos, 'pub' => 1]);
    }

// ------------------------------------------------------------------------ GET MENU
    public function view($pos)
    {
        // GET MENU FROM DB
        $menu = $this->get_menu($pos);
        return (!empty($menu)) ? $this->get_menu_items($menu) : null;
    }

// ------------------------------------------------------------------------ GET MENU ITEMS
    public function get_menu_items($data)
    {
        // GET ITEMS
        $items = $this->get_items($data['id']);

        if (!empty($items))
        {
            // PREPARE LINKS (if multilanguage i.e.)
            $this->links = $this->frontend_lib->links_prepare();

            // RENDER ITEMS
            $data['items'] = $this->render_menu($items, $data);
        }
        else
        {
            $data['items'] = null;
        }

        return $data;
    }

// ------------------------------------------------ STYLED MENU (navbar, offcanvas, sidebar)
    public function render_menu($items, $data, $cat_id = 0, $lvl = 0)
    {
        // BUILD ITEMS TREE
        $tree = '';

        foreach ($items as $item)
        {
            // RENDER ICON/IMAGE (if isset)
            $this->icon = (!empty($item['icon']))
                ? $this->load->view('menu/elements/icon.tpl', ['icon' => $item['icon']], true)
                : '';

            // RENDER LINK
            $this->link = $this->render_link($item);

            // RENDER MENU CATEGORY/ITEM
            if ($item['cat_id'] == $cat_id)
            {
                $tree .= ($item['item_type'] === 'cat')
                    ? $this->render_category($data, $items, $item, $lvl)
                    : $this->render_item($item);
            }
        }
        return $tree;
    }

// ----------------------------------------------------------------------- SLUG RENDER
    public function render_link($item)
    {
        // SET SEO TITLE FOR HREF
        $seotitle = (isset($item['seo_title']) && !empty($item['seo_title']))
            ? ' title="' . $item['seo_title'] . '"' : '';
        $scroll = null;

        // SET TARGET FOR LINK
        $target = (!empty($item['target'])) ? ' target="' . $item['target'] . '"' : '';

        // SET LINK
        if ($item['item_type'] === 'link' || $item['item_type'] === 'cat')
        {
            // IF ANY LINK ISSET
            if ($item['url_id'] || !empty($item['link']))
            {
                // SITE PAGE LINK
                if ($item['url_id'])
                {
                    // SET LINK
                    $url = ($item['home'])
                        ? $this->links['home']
                        : base_url($this->links['prefix'] . $item['url']);

                    // SET ANCHOR
                    if (!empty($item['anchor']))
                    {
                        $url .= '/' . $item['anchor'];
                        $scroll = ' data-scroll ';
                    }

                    return '<a href="' . $url . '" ' . $seotitle . $scroll . '>' . $this->icon . $item['title'] . '</a>';
                }

                // OTHER LINK
                if ($item['link'])
                {
                    return '<a href="' . $item['link'] . '"' . $seotitle . '>' . $this->icon . $item['title'] . '</a>';
                }
            }

            // IF ANCHOR ONLY
            if (!empty($item['anchor']))
            {
                return '<a href="' . $item['anchor'] . '">' . $this->icon . $item['title'] . '</a>';
            }
        }

        return null;
    }

// ------------------------------------------------------------------- SINGLE ITEM RENDER
    public function render_item($item)
    {
        // DIVIDER
        if ($item['item_type'] === 'div')
        {
            return $this->load->view('menu/elements/divider.tpl', null, true);
        }

        // HEADER
        if ($item['item_type'] === 'header')
        {
            return $this->load->view('menu/elements/header.tpl', ['title' => $this->icon . $item['title']], true);
        }

        // HREF
        if ($item['item_type'] === 'link')
        {
            return '<li>' . $this->link . '</li>';
        }
    }

// ------------------------------------------------------------------------ CATEGORY RENDER
    public function render_category($data, $items, $item, $lvl)
    {
        switch ($data['tpl'])
        {
            // NAVBAR
            case 'navbar':
                if (!$lvl)
                {
                    $cat = '<li class="uk-parent" data-uk-dropdown="{mode:\'hover\'}">' . $this->link;
                    $cat .= '<div class="uk-dropdown uk-dropdown-navbar">';
                    $cat .= '<ul class="uk-nav uk-nav-navbar">';
                    $cat .= $this->render_menu($items, $data, $item['id'], $lvl + 1);
                    $cat .= '</ul></div></li>';
                }
                else
                {
                    $cat = '<li class="uk-parent">' . $this->link;
                    $cat .= '<ul class="uk-nav-sub">';
                    $cat .= $this->render_menu($items, $data, $item['id'], $lvl + 1);
                    $cat .= '</ul></li>';
                }
                break;

            // SIDEBAR|OFFCANVAS|MOBILE
            case 'offcanvas':
            case 'sidebar':
            case 'mobile':
                $cat = '<li class="uk-parent">' . $this->link;
                $cat .= '<ul class="uk-nav-sub">';
                $cat .= $this->render_menu($items, $data, $item['id'], $lvl + 1);
                $cat .= '</ul></li>';
                break;
        }

        return $cat;
    }
}
