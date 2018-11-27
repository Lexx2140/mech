<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_lib
{
    private $_mod;
    private $app;

    public function __construct($admin)
    {
        $this->CI = &get_instance();

        // Set module & app config
        $this->_mod = $admin['module'];
        $this->app  = $admin['app'];

        // Load Admin libraries
        $this->CI->load->library(['dash/up_lib', 'dash/img_lib', 'dash/url_lib', 'dash/lang_lib', 'dash/content_lib', 'dash/media_lib']);

        // Load module Dash model
        $this->CI->load->model('Dash_model');

        // Load Admin helpers
        $this->CI->load->helper(
            ['cookie', 'file', 'directory', 'text', 'dash/dirfile', 'dash/array', 'dash/check']
        );

        // TimeZone
        if (ENVIRONMENT === 'development')
        {
            date_default_timezone_set('Europe/Kiev');
        }
    }

// ------------------------------------------------------------ CATEGORIES URL SLUG
    public function cat_slug($cats, $pid, $linked = false)
    {
        $slug = '';

        // GET ARRAY WITH ALL PARENT CATEGORIES (for current element)
        $cats_htree = ($pid) ? array_reverse($this->cat_hierarhy($cats, $pid)) : null;

        if ($cats_htree)
        {
            foreach ($cats_htree as $cat)
            {
                // GET FOLDER PATH FOR CATEGORIES
                if ($linked === false)
                {
                    $slug .= $cat['name'] . '/';
                }

                // GET URL SLUG FOR CATEGORIES
                else
                {
                    // GET "ADD URL" FROM CATEGORY OPTIONS
                    $cat['options'] = json_decode($cat['options'], true);

                    if (isset($cat['options']['add_url']) && $cat['options']['add_url'])
                    {
                        $slug .= $cat['name'] . '/';
                    }
                }
            }
        }
        return $slug;
    }

// ------------------------- CREATE CATEGORIES PARENT DEPENDED ONE DIMENSIONAL ARRAY (DESC)
    public function cat_hierarhy($cats, $pid, $cats_htree = [])
    {
        foreach ($cats as $cat)
        {
            if ($cat['id'] == $pid)
            {
                $cats_htree[] = $cat;
                $cats_htree += $this->cat_hierarhy($cats, $cat['pid'], $cats_htree);
            }
        }
        return $cats_htree;
    }

// ------------------------------------------------------------------ GET TEMPLATE FOR MODULE
    public function get_tpls($path = null, $none = false)
    {
        // GET PATH
        $path = ($path ?? APPPATH . '../../assets/tpl/' . $this->_mod['name']) . '/';

        // GET TEMPLATE FILES FROM PATH/DEFAULT MODULE TEMPLATES
        $files = (is_dir($path)) ? array_diff(scandir($path), array('.', '..')) : [];

        // SHOW EMPTY LIST (option)
        $tpls = (!$none) ? [] : ['' => '---'];

        if (!empty($files))
        {
            foreach ($files as $file)
            {
                $realfile = $path . $file;

                if (is_file($realfile))
                {
                    $ff = pathinfo($realfile);

                    if ($ff['extension'] === 'tpl')
                    {
                        $tpls[$ff['filename']] = $ff['filename'];
                    }
                }
            }
        }
        return $tpls;
    }

// ------------------------------------------------------------------- GET PARENT CATEGORY
    public function parent_cat($cats = null, $cat_id = '0')
    {
        if ($cat_id === '0' || !$cats)
        {
            $parent = [
                'title'  => 'Без категорії',
                'id'     => '0',
                'pid'    => '0',
                'cat_id' => '0'
            ];
        }
        else
        {
            foreach ($cats as $cat)
            {
                if ($cat['id'] == $cat_id)
                {
                    $parent = $cat;
                }
            }
        }

        return $parent;
    }

// ------------------------------------------------------------------ ALLIED CATEGORIES
    public function allied_cats($cat_array, $current = null)
    {
        $allied = ['' => '---'];
        // CHECK IF THERE ARE CATEGORIES
        if (is_array($cat_array) && !empty($cat_array))
        {
            foreach ($cat_array as $cat)
            {
                if ($cat['id'] !== $current)
                {
                    $allied[$cat['id']] = $cat['title'];
                }
            }
        }
        return $allied;
    }

// -------------------------------------------------------------- CATEGORY SELECT (recursive)
    /**
     * @param  [array]  $cat_array   [array of all categories]
     * @param  [num]    $pid         [current pid/cat_id]
     * @param  [string] $cat_id_name [name of parent descriptor('pid' or 'cat_id')]
     * @param  [num]    $current     [select all categories, except current]
     * @return [html]   [formatted select list]
     */
    public function cat_select($cat_array, $pid = '0', $cat_id_name, $current = null)
    {
        $nocat = '<option value="0">Без категорії</option>';

        function cat_select_tree($cats, $active_id, $pid, $lvl = 0)
        {
            $tree = '';
            $padd = '';

            if (is_array($cats) && isset($cats[$pid]))
            {
                // Padding for subs
                if ($lvl > 0)
                {
                    for ($i = 1; $i <= $lvl; $i++)
                    {
                        $padd .= '&nbsp;&nbsp;';
                    }
                }

                foreach ($cats[$pid] as $cat)
                {
                    // Set selected
                    $sel = ($active_id === $cat['id']) ? ' selected' : null;

                    $tree .= '<option' . $sel . ' value="' . $cat['id'] . '">';
                    $tree .= $padd . $cat['title'] . '</option>';
                    $tree .= cat_select_tree($cats, $active_id, $cat['id'], $lvl + 1);
                }
            }
            return $tree;
        }

        // IF THERE ARE CATEGORIES
        if (is_array($cat_array) && !empty($cat_array))
        {
            // SORT CATEGORIES ARRAY
            foreach ($cat_array as $cat)
            {
                // SELECT ALL CATEGORIES EXCEPT CURRENT (if current id isset)
                if ($cat['id'] !== $current)
                {
                    $cats[$cat[$cat_id_name]][] = $cat;
                }
            }

            // IF CATEGORY NOT EMPTY
            if (!empty($cats))
            {
                return $nocat . cat_select_tree($cats, $pid, '0');
            }

            // IF EMPTY CATEGORY
            return $nocat;
        }

        // IF NO CATEGORIES
        return $nocat;
    }

// -------------------------------------------------------------------- CATEGORIES LIST
    /**
     * @param  [array]  $cats     [all categories send by controller]
     * @param  [string] $elems    [categories of what elements to show (pages/items/images)]
     * @param  [string] $key_name [categories parent descriptor (pid/cat_id)]
     * @param  [num]    $pid      [if isset - adds parent slug to path (parent/1/)]
     * @return [sting]  [html formatted list of categories with hrefs to their subs]
     */
    public function cats_list($cats, $elems, $key_name, $pid = null)
    {
        // GET SLUG
        $slug = $this->_mod['index'] . $elems;
        $slug .= ($pid) ? '/' . $pid : '';

        // RENDER TABLE
        $tree = '<thead><tr><td>';
        $tree .= '<b>Категорії:</b></td></tr></thead>';
        $tree .= '<tbody><tr><td><a href="' . $slug . '">Без категорії</a></td></tr>';
        $tree .= (!empty($cats)) ? $this->cats_table_render($cats, $slug, $key_name) : null;
        $tree .= '</tbody>';

        return $tree;
    }

    public function cats_table_render($cats, $slug, $key_name, $key = '0', $lvl = 0)
    {
        // CREATE HTML FORMATTING AND NEXT LEVEL INDENT
        $html    = '';
        $padding = '';

        for ($i = 1; $i <= $lvl; $i++)
        {
            $padding .= '&nbsp;&nbsp;';
        }

        // FIND SUB CATEGORIES IN CAT ARRAY
        foreach ($cats as $cat)
        {
            $parents[] = $cat[$key_name];
        }

        // GO THROUGH ALL CATEGORIES
        foreach ($cats as $cat)
        {
            // SET LINK
            $href = '<a href="' . $slug . '/' . $cat['id'] . '">' . $padding . $cat['title'] . '</a>';

            // IF THERE ARE SUBCATS IN CAT
            if ($cat[$key_name] === $key)
            {
                $html .= '<tr><td>' . $href . '</td></tr>';

                // SUBCATEGORIES LIST
                if (in_array($cat['id'], $parents))
                {
                    $html .= $this->cats_table_render($cats, $slug, $key_name, $cat['id'], $lvl + 1);
                }
            }
        }
        return $html;
    }

// ------------------------------------------------------------------ PAGES SELECT LIST
    public function page_select($selected = null, $pagetype = null)
    {
        // GET ALL PAGES
        $pages = $this->CI->url_lib->get_all_pages($pagetype);

        // RENDER LIST TREE
        function page_select_tree($elems, $pid = '0', $selected, $lvl = 0)
        {
            // CREATE HTML FORMATTING AND NEXT LEVEL INDENT
            $tree = '';
            $padd = '';

            if ($lvl > 0)
            {
                for ($i = 1; $i <= $lvl; $i++)
                {
                    $padd .= '&nbsp;';
                }
            }

            foreach ($elems as $elem)
            {
                // SET SELECTED
                $sel = ($selected === $elem['id']) ? ' selected' : null;

                if ($elem['pid'] === $pid)
                {
                    // IF CATEGORY
                    if ($elem['cat'])
                    {
                        $tree .= '<option' . $sel . ' value="' . $elem['id'] . '" data-link="' . $elem['url'] . '" data-home="' . $elem['home'] . '">';
                        $tree .= $padd . $elem['title'] . '</option>';
                        $tree .= page_select_tree($elems, $elem['id'], $selected, $lvl + 1);
                    }

                    // IF PAGE
                    else
                    {
                        $tree .= '<option' . $sel . ' value="' . $elem['id'] . '" data-link="' . $elem['url'] . '" data-home="' . $elem['home'] . '">';
                        $tree .= $padd . $elem['title'] . '</option>';
                    }
                }
            }
            return $tree;
        }

        $tree = '<option value="0">---</option>';
        $tree .= (!empty($pages)) ? page_select_tree($pages, '0', $selected) : null;

        return $tree;
    }

// ---------------------------------------------------------------------- PAGES MULTISELECT
    public function page_multiselect($type = null, $name = 'show_on', $selected = null, $current = null, $hide_nocat = false)
    {
        // GET PAGES (except cuurent, if isset)(all/by type)
        $pages = $this->CI->url_lib->get_all_pages($type, $current);

        // PREPARE SELECTED
        if (isset($selected) && !is_array($selected))
        {
            $selected = (is_numeric($selected)) ? $selected : json_decode($selected);
        }

        // GET ALL SELECTED
        $all = ($selected === '-1') ? 'checked' : '';

        // GET NO CATEGORY SELECTED (if only number)
        if (is_numeric($selected))
        {
            $nocat = ($selected === '0') ? 'checked' : '';
        }

        // GET NO CATEGORY SELECTED (if is array)
        if (is_array($selected))
        {
            $nocat = (in_array('0', $selected)) ? 'checked' : '';
        }

        // RENDER LIST
        $multi = '<li data-parent><label><input type="checkbox" name="' . $name . '[]" value="-1" ' . $all . '> Всі категорії</label><ul>';

        // SHOW/HIDE NO CATEGORIES
        if (!$hide_nocat)
        {
            $multi .= '<li><label><input type="checkbox" name="' . $name . '[]" value="0" ' . $nocat . '> Без категорії</label></li>';
        }

        // TREE RECURSION
        function multiselect_tree($cats, $pid = '0', $name, $selected)
        {
            $tree = '';

            if (isset($cats[$pid]))
            {
                foreach ($cats[$pid] as $cat)
                {
                    // SET CHECKED ELEMENTS
                    if (!$selected)
                    {
                        $checked = '';
                    }

                    // IF IS NUMERIC
                    if (is_numeric($selected))
                    {
                        $checked = ($selected === $cat['id']) ? 'checked' : '';
                    }

                    // IF IS ARRAY
                    if (is_array($selected))
                    {
                        $checked = in_array($cat['id'], $selected) ? 'checked' : '';
                    }

                    // RENDER LI IF CATEGORY HAS SUBS
                    if (array_key_exists($cat['id'], $cats))
                    {
                        $tree .= '<li data-parent><label><input type="checkbox" name="' . $name . '[]"';
                        $tree .= ' value="' . $cat['id'] . '" ' . $checked . '> ' . $cat['title'] . '</label>';
                        $tree .= '<ul>' . multiselect_tree($cats, $cat['id'], $name, $selected) . '</ul>';
                    }

                    // RENDER LI IF NO SUBS
                    else
                    {
                        $tree .= '<li><label><input type="checkbox" name="' . $name . '[]"';
                        $tree .= ' value="' . $cat['id'] . '" ' . $checked . '> ' . $cat['title'] . '</label>';
                    }

                    $tree .= '</li>';
                }
            }

            return $tree;
        }

        // SORT CATEGORIES ARRAY BY PID ---------
        foreach ($pages as $page)
        {
            $cats[$page['pid']][] = $page;
        }

        // IF THERE ARE CATEGORIES
        if (!empty($cats))
        {
            $multi .= multiselect_tree($cats, '0', $name, $selected);
        }

        return $multi . '</ul>';
    }

// ------------------------------------------ REORDER SORTED LIST (after upper element delete)
    public function reorder_del($current, $elems)
    {
        $reorder = [];

        if (!empty($elems) && count($elems) > 1)
        {
            foreach ($elems as $nb)
            {
                if ($current < $nb['sort'])
                {
                    $reorder[$nb['id']]['id']   = $nb['id'];
                    $reorder[$nb['id']]['sort'] = intval($nb['sort'] - 1);
                }
            }
        }

        return $reorder;
    }
}
