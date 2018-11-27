<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends Admin_model
{
    protected $def_lang_id;

    protected $_table  = 'menu';
    protected $_table2 = 'menu_items';
    protected $_desc2  = 'menu_items_desc';

    protected $_select = 'id, title, pos, tpl, pub, sort';
    protected $_order  = 'sort ASC';

    private $path = 'assets/img/';

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ GET
    public function get_menus()
    {
        return $this->get();
    }

    public function get_menu($id = null, $content = false)
    {
        $menu = $this->get_row(['id' => $id ?? $this->session->pid]);
        return ($content) ? $this->content_lib->get_options($menu) : $menu;
    }

    public function get_items($pid, $cat_id = '')
    {
        return
        $this->db
             ->select('menu_items.id, menu_items.cat_id, menu_items.pid, menu_items.icon, menu_items.sort, menu_items.link, menu_items.url_id, menu_items.anchor, menu_items.item_type, menu_items.pub')
             ->select('pages.url, pages.home')
             ->select('menu_items_desc.title')
             ->from('menu_items')
             ->where('menu_items.pid', $pid)
             ->where('menu_items.cat_id', $cat_id)
             ->join('pages', 'pages.id=menu_items.url_id', 'left')
             ->join('menu_items_desc', 'menu_items_desc.id=menu_items.id AND menu_items_desc.lang_id=' . $this->def_lang_id)
             ->order_by('menu_items.sort ASC')
             ->get()->result_array();
    }

    public function get_item($id, $content = false)
    {
        $elem = $this->db
                     ->select('menu_items.*')
                     ->select('pages.url, pages.home')
                     ->from('menu_items', 1)
                     ->where('menu_items.id', $id)
                     ->join('pages', 'pages.id=menu_items.url_id', 'left')
                     ->get()->row_array();

        return ($content)
            ? $this->content_lib->get_content($elem, $this->_desc2)
            : $elem;
    }

    public function get_cats($pid, $cat_id = null)
    {
        $this->db
             ->select('menu_items.id, menu_items.cat_id, menu_items.pid')
             ->select('menu_items_desc.title')
             ->from('menu_items')
             ->where('menu_items.pid', $pid);

        if ($cat_id)
        {
            $this->db->where('menu_items.cat_id', $cat_id);
        }

        return $this->db->where('menu_items.item_type', 'cat')
                    ->order_by('menu_items.sort ASC')
                    ->join('menu_items_desc', 'menu_items_desc.id=menu_items.id AND menu_items_desc.lang_id=' . $this->def_lang_id, 'left')
                    ->get()->result_array();
    }

// ------------------------------------------------------------------------ CREATE MENU
    public function create_menu($default)
    {
        // SET DEFAULT SETTINGS
        $elem['default'] = $default;

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('menu_form', true);

        // SELECT TEMPLATE
        $elem['tpl_select'] = $this->dash_lib->get_tpls();

        return $elem;
    }

// ------------------------------------------------------------------------ CREATE ITEM
    public function create_item($default, $pid = '0')
    {
        // GET PARENT MENU
        $elem['parent'] = $this->get_row($pid);

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('item_form', true);

        // PARENT CATEGORY SELECT
        $cat_id             = $this->session->cat_id;
        $elem['cat_select'] = $this->dash_lib->cat_select($this->get_cats($pid), $cat_id, 'cat_id');

        // ICON EDIT
        $elem['icon_edit'] = $this->media_lib->icon_edit('icon');

        // GET URLS FROM PAGES
        $elem['url_select'] = $this->dash_lib->page_select();

        return $elem;
    }

// ------------------------------------------------------------------------ EDIT MENU
    public function edit_menu($id, $default)
    {
        // GET PARENT DATA WITH JOPTIONS
        $elem = $this->get_menu($id, true);

        // SET DEFAULT SETTINGS
        $elem['default'] = $default;

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('menu_form', true);

        // TEMPLATE SELECT
        $elem['tpl_select'] = $this->dash_lib->get_tpls();

        return $elem;
    }

// ------------------------------------------------------------------------ EDIT ITEM
    public function edit_item($id)
    {
        // GET ITEM DATA
        $elem = $this->get_item($id, true);

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('item_form', true);

        // SET URL
        if ($elem['url_id'])
        {
            $elem['url'] = ($elem['home']) ? rtrim(base_url(), '/') : base_url($elem['url']);
        }

        // PARENT CATEGORY SELECT
        $elem['cat_select'] = $this->dash_lib->cat_select(
            $this->get_cats($elem['pid']), $elem['cat_id'], 'cat_id', $id
        );

        // ICON EDIT
        $elem['icon_edit'] = $this->media_lib->icon_edit('icon', $elem['icon']);

        // SELECT URL FOR ITEM
        $elem['url_select'] = $this->dash_lib->page_select($elem['url_id']);

        return $elem;
    }

// ------------------------------------------------------------------------ SAVE MENU
    public function save_menu($old, $new)
    {
        // SAVE NEW MENU
        if (!isset($old['id']))
        {
            $new['sort'] = $this->new_order('menu', $new);
            $this->insert($new);
        }

        // UPDATE MENU
        else
        {
            $this->update($old['id'], $new);
        }
    }

// ------------------------------------------------------------------------ SAVE ITEM
    public function save_item($old, $new)
    {
        // CHECK IF NOT EMPTY CATEGORY (if change type)
        if (isset($old) && $old['item_type'] === 'cat' && $new['item_type'] !== 'cat')
        {
            cat_check($this->get_items($old['pid'], $old['id'])) or die();
        }

        // PREPARE MULTICONTENT
        $new = $this->content_lib->prepare_content($new);

        // SPLIT CONTENT
        $elem = $new['base'];

        // SAVE NEW ITEM
        if (!isset($old['id']))
        {
            // SET PARENT MENU
            $elem['pid'] = $this->session->pid;

            // SET SORT ORDER
            $elem['sort'] = $this->new_order('item', $elem);

            // SAVE ITEM TO DB & RETURN IT ID
            $elem_id = $this->insert_sec($elem);

            // SAVE CONTENT
            $this->content_lib->save_content($elem_id, $new['desc'], $this->_desc2);
        }

        // UPDATE ITEM
        else
        {
            // UPDATE DB
            $this->update_sec($old['id'], $elem);

            // UPDATE ITEM DESCRIPTION/TRANSLATION
            $this->content_lib->update_content($old['id'], $new['desc'], $this->_desc2);
        }
    }

// ------------------------------------------------------------------------ DELETE MENU
    public function del_menu($menu)
    {
        // GET ITEMS
        $items = $this->get_items($menu['id']);

        // DELETE ITEMS (if not empty)
        if (!empty($items))
        {
            foreach ($items as $item)
            {
                $this->del_item($item);
            }
        }

        // DELETE MENU
        if ($this->delete($menu['id']))
        {
            // REORDER
            $this->reorder('menu', $menu);
        };
    }

// ------------------------------------------------------------------------ DELETE ITEM
    public function del_item($item)
    {
        // DELETE ITEM
        if ($this->delete_sec($item['id']))
        {
            // DELETE CONTENT
            $this->db->where('id', $item['id'])->delete($this->_desc2);

            // REORDER
            $this->reorder('item', $item);
        }

        // DELETE CATEGORY SUBS
        if ($item['item_type'] === 'cat')
        {
            // GET SUBITEMS
            $subs = $this->get_items($item['pid'], $item['id']);

            // IF THERE ARE SUBITEMS -> delete recursive
            if (!empty($subs))
            {
                foreach ($subs as $sub)
                {
                    $this->del_item($sub);
                }
            }
        }
    }

// ------------------------------------------------------------------------ PUBLICATE
    public function pub_menu($id)
    {
        $this->pub($id);
    }

    public function pub_item($id)
    {
        $this->pub_sec($id);
    }

// ------------------------------------------------------------------------ SORT MENUS
    public function sort_menu($order)
    {
        $this->batch_up($order);
    }

// ------------------------------------------------------------------------ SORT ITEMS
    public function sort_item($order)
    {
        $this->batch_up_sec($order);
    }

// ----------------------------------------------------------------- SET ORDER FOR NEW ELEMENT
    public function new_order($type, $elem)
    {
        if ($type === 'menu')
        {
            return intval($this->last('sort')) + 1;
        }

        if ($type === 'item')
        {
            return intval($this->last_sec('sort', ['pid' => $elem['pid'], 'cat_id' => $elem['cat_id']])) + 1;
        }
    }

// ------------------------------------------ REORDER SORTED LIST (after upper element delete)
    public function reorder($type, $elem)
    {
        if ($type === 'menu')
        {
            $elems   = $this->get_menus();
            $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);
            empty($reorder) or $this->batch_up($reorder);
        }

        if ($type === 'item')
        {
            $elems   = $this->get_items($elem['pid'], $elem['cat_id']);
            $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);
            empty($reorder) or $this->batch_up_sec($reorder);
        }
    }

// ------------------------------------------------------------------------ COPY MENU/ITEMS
    public function copy_menu($id)
    {
        // GET MENU
        $menu = $this->get_menu($id);

        // GET MENU ITEMS
        $items = $this->db->where('pid', $id)->get($this->_table2)->result_array();

        // COPY MENU
        // unset($menu['id']);
        // $menu['title'] .= '-copy';
        // $menu['sort'] = $this->new_order('menu', $menu);
        // $new_pid      = $this->insert($menu);

        // COPY ITEMS
        foreach ($items as $item)
        {
            // GET ITEM DESCRIPTION
            $items_desc[] = $this->db->where('id', $item['id'])->get($this->_desc2)->result_array();

            if ($item['item_type'] === 'cat')
            {
              # code...
            }

            else {

            }

            // PREPARE ITEM FOR COPY
            unset($item['id']);
            $item['pid']  = $new_pid;
            $new_items[]  = $item;
        }

        // $this->insert_batch_sec($new_items);

        // // COPY ITEMS DESCRIPTION(s)
        // if (isset($items_desc) && !empty($items_desc))
        // {
        //     $langs = count($this->lang_lib->get_langs());

        //     foreach ($items_desc as $desc)
        //     {
        //         for ($i = 0; $i < $langs; $i++)
        //         {
        //             {
        //                 $new_desc = $desc[$i];
        //                 unset($new_desc['cid']);
        //             }
        //             $new_items_desc[] = $new_desc;
        //         }

        //         echo "<pre>";
        //         print_r($new_items_desc);
        //         echo "</pre>";

        //     }

        //     // echo "<pre>";
        //     // print_r($new_items_desc);
        //     // echo "</pre>";
        // }

    }
}
