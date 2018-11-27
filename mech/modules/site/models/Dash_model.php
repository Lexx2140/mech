<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends Admin_model
{
    protected $def_lang_id;

    protected $_table  = 'pages';
    protected $_desc   = 'pages_desc';
    protected $_select = 'id, pid, cat, name, sort';

    // Base page data
    protected $base = 'id, pid, url, link, cat, sort, name, media, mime, thumb, options, json, ptype, pub';

    // Base page content
    protected $meta_base = 'title, m_title, m_desc, m_keys, cid, intro, content';

    // Path for images
    private $path = 'assets/media/pages/';

    // Category templates
    private $cat_tpls = APPPATH . '../../assets/tpl/pages/category';

    // Page templates
    private $page_tpls = APPPATH . '../../assets/tpl/pages/';

    // Page editor
    private $pageeditor = '../../../../app/views/pageeditor/';

    public function __construct()
    {
        parent::__construct();
    }

// ---------------------------------------------------------- GET GATEGORIES (by params)
    public function get_categories($pid = null, $num = null, $offset = null)
    {
        $this->db
             ->select('pages.id, pages.pid, pages.name, pages.url, pages.sort, pages.pub, pages.options, pages.home')
             ->select('pages_desc.title')
             ->from('pages')
             ->where('pages.cat', 1)
             ->limit($num, $offset);

        // GET CATEGORIES BY PID, (with offset - optional)
        if ($pid)
        {
            $this->db->where('pages.pid', $pid);
        }

        return
        $this->db
             ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->def_lang_id, 'left')
             ->order_by('sort ASC')
             ->get()->result_array();
    }

// --------------------------------------------------------------------- GET CATEGORY
    public function get_category($id, $content = false)
    {
        $category = $this->db
                         ->select('pages.*')
                         ->where('pages.id', $id)
                         ->get('pages', 1)->row_array();

        return ($content)
            ? $this->content_lib->get_content($category, $this->_desc)
            : $category;
    }

// ----------------------------------------------------------------------- GET PAGES
    public function get_pages($pid, $num = null, $offset = null)
    {
        return
        $this->db
             ->select('pages.id, pages.pid, pages.name, pages.url, pages.sort, pages.pub, pages.home')
             ->select('pages_desc.title')
             ->from('pages')
             ->where('pages.cat', 0)
             ->where('pages.pid', $pid)
             ->limit($num, $offset)
             ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->def_lang_id, 'left')
             ->order_by('sort ASC')
             ->get()->result_array();
    }

// --------------------------------------------------------------------- GET ONE PAGE
    public function get_page($id, $content = false)
    {
        $page = $this->db
                     ->select('pages.*')
                     ->where('pages.id', $id)
                     ->get('pages', 1)->row_array();

        $page = ($content) ? $this->content_lib->get_content($page, $this->_desc) : $page;

        // GET ADDON PAGE CONTENT
        if ($page['ptype'] === 'product')
        {
            $page['product'] = $this->db
                                    ->select('*')
                                    ->where('page_id', $id)
                                    ->get('products', 1)
                                    ->row_array();
        }

        return $page;
    }

// ------------------------------------------------------------------------ CREATE CATEGORY
    public function create_category($default, $pid = '0', $sub_type = null)
    {
        // GET PARENT CATEGORY
        $elem['parent'] = $this->get_category($pid, true);

        // SET DEFAULT SETTINGS
        $elem['default'] = $default['category'];

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('page_form', true);

        // GET ALL CATS
        $cats = $this->get_categories();

        // PARENT CATEGORY SELECT
        $elem['cat_select'] = $this->dash_lib->cat_select($cats, $pid, 'pid');

        // SHOW SUBS FROM OTHER CATEGORIES
        $elem['allied_cats'] = $this->dash_lib->page_multiselect(1, 'options[allied]', '-2');

        // GET PARENT URL SLUG (if isset)
        $elem['cat_slug'] = $this->dash_lib->cat_slug($cats, $pid, true);

        // SET OPTIONS FOR MEDIA FILES UPLOAD & EDIT
        $elem['media_options'] = json_encode($this->media_lib->get_media_options($elem['default'], $elem['parent']['options'] ?? null));

        // MEDIA EDIT (set allowed mimes to upload)
        $elem['media_edit'] = $this->media_lib->edit_media('file', $elem['parent']['options'] ?? $elem['default']);

        // CATEGORIES TEMPLATES LIST
        $elem['cat_tpl_select'] = $this->dash_lib->get_tpls($this->cat_tpls);

        // SUB PAGES TYPES LIST
        $sub_type = $sub_type ?? $elem['default']['subp_type'];

        // SUB PAGES TEMPLATES LIST
        $elem['page_tpl_select'] = $this->dash_lib->get_tpls($this->page_tpls . $sub_type);

        return $elem;
    }

// ------------------------------------------------------------------------ CREATE PAGE
    public function create_page($default, $pid = '0', $ptype = null)
    {
        // GET PARENT CATEGORY
        $elem['parent'] = $this->get_category($pid, true);

        // SET CURRENT ID & ID
        $elem['id']  = null;
        $elem['pid'] = $pid;

        // SET DEFAULT SETTINGS
        $elem['default'] = $default['page'];

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('page_form', true);

        // GET ALL CATS
        $cats = $this->get_categories();

        // PARENT CATEGORY SELECT
        $elem['cat_select'] = $this->dash_lib->cat_select($cats, $pid, 'pid');

        // CATEGORIES SELECT LIST
        $elem['cat_preview'] = $this->dash_lib->page_select(null, 1);

        // GET PARENT URL SLUG (if isset)
        $elem['cat_slug'] = $this->dash_lib->cat_slug($cats, $pid, true);

        // SET OPTIONS FOR MEDIA FILES UPLOAD & EDIT
        $elem['media_options'] = json_encode($this->media_lib->get_media_options($elem['default'], $elem['parent']['options'] ?? null));

        // MEDIA EDIT (set allowed mimes to upload)
        $elem['media_edit'] = $this->media_lib->edit_media('file', $elem['parent']['options'] ?? $elem['default']);

        // LANGUAGES SELECT
        $elem['langs'] = $this->lang_lib->get_langs();

        // PAGE TYPE
        if (!$ptype)
        {
            $ptype = (!empty($elem['parent']))
                ? $elem['parent']['options']['subp_type']
                : $elem['default']['pagetype'];
        }

        // PAGE TEMPLATE SELECT
        $elem['tpl_select'] = $this->dash_lib->get_tpls($this->page_tpls . $ptype);

        // PAGE EDITOR SELECT
        $elem['editor'] = $this->load->view($this->pageeditor . $ptype, $elem, true);

        return $elem;
    }

// ------------------------------------------------------------------------ EDIT CATEGORY
    public function edit_category($id, $default, $sub_type = null)
    {
        // GET BASE CATEGORY DATA
        $elem = $this->get_category($id, true);

        // GET ALL CATS
        $cats = $this->get_categories();

        // GET PARENT CATEGORY (if isset)
        $elem['parent'] = $this->get_category($elem['pid'], true);

        // SET DEFAULT SETTINGS
        $elem['default'] = $default['category'];

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('page_form', true);

        // PARENT CATEGORY SELECT
        $elem['cat_select'] = $this->dash_lib->cat_select($cats, $elem['pid'], 'pid');

        // GET URL SLUG
        $elem['cat_slug'] = $this->dash_lib->cat_slug($cats, $elem['pid'], true);

        // SHOW SUBS FROM OTHER CATEGORIES
        $elem['allied_cats'] = $this->dash_lib->page_multiselect(1, 'options[allied]', $elem['options']['allied'] ?? '-2', null, true);

        // GET PATH
        $this->path .= (isset($elem['parent']))
            ? $this->dash_lib->cat_slug($cats, $elem['pid']) . $elem['name'] . '/'
            : $elem['name'] . '/';

        // SET OPTIONS FOR MEDIA FILES UPLOAD & EDIT
        $elem['media_options'] = json_encode($this->media_lib->get_media_options($elem['default'], $elem['parent']['options'] ?? null));

        // MEDIA EDIT (set allowed mimes to upload)
        $elem['media_edit'] = $this->media_lib->edit_media('file', $elem['media'], $this->path, $elem['parent']['options'] ?? $elem['default']);

        // CATEGORIES TEMPLATES LIST
        $elem['cat_tpl_select'] = $this->dash_lib->get_tpls($this->cat_tpls);

        // SUB PAGES TYPES LIST
        $sub_type = $sub_type ?? $elem['options']['subp_type'];

        // SUB PAGES TEMPLATES LIST
        $elem['page_tpl_select'] = $this->dash_lib->get_tpls($this->page_tpls . $sub_type);

        return $elem;
    }

// ------------------------------------------------------------------------ EDIT PAGE
    public function edit_page($id, $default, $ptype = null)
    {
        // GET PAGE
        $elem = $this->get_page($id, true);

        // GET ALL CATS
        $cats = $this->get_categories();

        // GET PARENT CATEGORY (if isset)
        $elem['parent'] = $this->get_category($elem['pid'], true);

        // SET DEFAULT SETTINGS
        $elem['default'] = $default['page'];

        // INPUT FORMS DATA
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('page_form', true);

        // GET URL SLUG
        $elem['cat_slug'] = $this->dash_lib->cat_slug($cats, $elem['pid'], true);

        // GET PATH
        $this->path .= (isset($elem['parent']))
            ? $this->dash_lib->cat_slug($cats, $elem['pid'])
            : null;

        // SET OPTIONS FOR MEDIA FILES UPLOAD & EDIT
        $elem['media_options'] = json_encode($this->media_lib->get_media_options($elem['default'], $elem['parent']['options'] ?? null));

        // MEDIA EDIT (set allowed mimes to upload)
        $elem['media_edit'] = $this->media_lib->edit_media('file', $elem['media'], $this->path, $elem['parent']['options'] ?? $elem['default']);

        // PARENT CATEGORY SELECT
        $elem['cat_select'] = $this->dash_lib->cat_select($cats, $elem['pid'], 'pid');

        // CATEGORIES SELECT LIST
        $elem['cat_preview'] = $this->dash_lib->page_select($elem['options']['cat_preview'] ?? null, 1);

        // LANGUAGES SELECT
        $elem['langs'] = $this->lang_lib->get_langs();

        // CURRENT PAGE TYPE
        $ptype = (!$ptype) ? $elem['ptype'] : $ptype;

        // PAGE TEMPLATE SELECT
        $elem['tpl_select'] = $this->dash_lib->get_tpls($this->page_tpls . $ptype);

        // PAGE EDITOR
        $elem['editor'] = $this->load->view($this->pageeditor . $ptype, $elem, true);

        return $elem;
    }

// ------------------------------------------------------------------------ SAVE CATEGORY
    public function save_category($old, $new)
    {
        // GET ALL CATS
        $cats = $this->get_categories();

        // SET CATEGORY PATH
        $path = $this->path . $this->dash_lib->cat_slug($cats, $new['pid']) . $new['name'] . '/';

        // UPLOAD/DELETE MEDIA
        $new = $this->media_lib->upload_media(
            $old,
            $new,
            $path,
            $filename = $new['name'],
            $overwrite = true
        );

        // COMPILE CONTENT
        $compiled = $this->content_lib->prepare_page_content($new, $this->base, $this->meta_base, 1);

        // SPLIT CONTENT
        $page = $compiled['base'];

        // SAVE NEW CATEGORY
        if (!isset($old['id']))
        {
            // CREATE CATEGORY FOLDER
            mdir_create($path);

            // SET SORT ORDER
            $page['sort'] = $this->new_order($page);

            // SET CREATED DATE
            $page['created'] = date('Y-m-d H:i:s');

            // SAVE TO DB AND GET INSERTED PAGE ID
            $page_id = $this->insert($page);

            // SAVE CONTENT
            $this->content_lib->save_content($page_id, $compiled['desc'], $this->_desc);
        }

        // UPDATE CATEGORY
        if (isset($old['id']))
        {
            // GET CATEGORY OPTIONS
            $old['options'] = json_decode($old['options'], true);

            // GET OLD FOLDER PATH
            $old_path = $this->path . $this->dash_lib->cat_slug($cats, $old['pid']) . $old['name'];

            // MOVE/RENAME CATEGORY FOLDER (if parent category/category name changed)
            if ($page['pid'] !== $old['pid'] || $page['name'] !== $old['name'])
            {
                mdir_rename($old_path, $path);
            }

            // RENAME IMAGE (if category name/url changed)
            if ($page['name'] !== $old['name'] && isset($old['media']) && !isset($page['media']))
            {
                $page = $this->img_lib->img_rename($old, $page, 'media', $path . '/', $page['name']);
            }

            // UPDATE CATEGORY
            $this->update($old['id'], $page);

            // UPDATE CONTENT
            $this->content_lib->update_content($old['id'], $compiled['desc'], $this->_desc);

            // CHECK/UPDATE SUBS (if category url/add_url option changed)
            if ($old['options']['add_url'] !== $new['options']['add_url'] || $old['url'] !== $page['url'] || $page['pid'] !== $old['pid'])
            {
                $this->subs_update($old['id']);
            }
        }
    }

// ------------------------------------------------------------------------ SAVE PAGE
    public function save_page($old, $new, $home = false)
    {
        // GET ALL CATS
        $cats = $this->get_categories();

        // GET CATEGORY SLUG & SET FOLDER PATH
        $path = $this->path . $this->dash_lib->cat_slug($cats, $new['pid']);

        // UPLOAD/DELETE MEDIA
        $new = $this->media_lib->upload_media(
            $old,
            $new,
            $path,
            $filename = $new['name'],
            $overwrite = true
        );

        // COMPILE CONTENT
        $compiled = $this->content_lib->prepare_page_content($new, $this->base, $this->meta_base);

        // SET BASE PAGE DATA
        $page = $compiled['base'];

        // SAVE NEW ELEMENT
        if (!isset($old['id']))
        {
            // SET SORT ORDER
            $page['sort'] = $this->new_order($page);

            // SET CREATED DATE
            $page['created'] = (isset($new['created'])) ? $new['created'] : date('Y-m-d H:i:s');

            // SAVE TO DB
            $page_id = $this->insert($page);

            // SAVE CONTENT
            $this->content_lib->save_content($page_id, $compiled['desc'], $this->_desc);

// ------------------------------------------------------------------------ TODO
            // SAVE EXTRA CONTENT
            $this->content_lib->save_addon_content($page_id, $compiled);
        }

// ------------------------------------------------------------------------

        // UPDATE PAGE
        if (isset($old))
        {
            // MOVE/RENAME IMAGE (if url/parent category changed)
            if (isset($old['media']) && !isset($page['media']))
            {
                if ($page['pid'] !== $old['pid'] || $page['name'] !== $old['name'])
                {
                    // GET OLD FOLDER PATH
                    $old_path = $this->path . $this->dash_lib->cat_slug($cats, $old['pid']);

                    // MOVE/RENAME FILE(s)
                    $page = $this->img_lib->img_rename($old, $page, 'media', $old_path, $page['name'], $new_path);
                }
            }

            // UPDATE PAGE
            $this->update($old['id'], $page);

            // UPDATE CONTENT
            $this->content_lib->update_content($old['id'], $compiled['desc'], $this->_desc);

            // UPDATE EXTRA CONTENT
            $this->content_lib->update_addon_content($old['id'], $compiled);
        }
    }

// --------------------------------------------------------------------- DELETE CATEGORY
    public function del_category($cat)
    {
        // GET CATEGORY SUBS
        $subs = $this->get(['pid' => $cat['id']]);

        // CHECK IF EMPTY
        cat_check($subs);

        // GET CATEGORY SLUG
        $this->path .= $this->dash_lib->cat_slug($this->get_categories(), $cat['pid']);

        // DELETE CATEGORY
        if ($this->delete($cat['id']))
        {
            // DELETE CONTENT
            $this->db->where('id', $cat['id'])->delete($this->_desc);

            // REORDER
            $this->reorder($cat);

            // DELETE FOLDER WITH ALL FILES
            mdir_delete($this->path . $cat['name']);
        }
    }

// ------------------------------------------------------------------------ DELETE PAGE
    public function del_page($page)
    {
        // DELETE PAGE
        if ($this->delete($page['id']))
        {
            // DELETE CONTENT FROM PAGES TABLE
            $this->db->where('id', $page['id'])->delete($this->_desc);

            // DELETE CONTENT FROM ADDON TABLE
            $this->content_lib->delete_addon_content($page);

            // REORDER
            $this->reorder($page);

            // DELETE HERO MEDIA
            if (!empty($page['media']))
            {
                $path = $this->path . $this->dash_lib->cat_slug($this->get_categories(), $page['pid']);

                $this->media_lib->del_media($page, $path);
            }
        }
    }

// -------------------------------------------------------------------- SUBS UPDATE
    public function subs_update($pid, $cats = null)
    {
        // GET CATEGORY SUBS
        $subs = $this->get(['pid' => $pid]);

        if (!empty($subs))
        {
            // CREATE TEMP ARRAY FOR SUBS UPDATE
            $subs_update = [];

            // GET ALL CATS
            $cats = $cats ?? $this->get_categories();

            foreach ($subs as $sub)
            {
                $sub['url']     = $this->dash_lib->cat_slug($cats, $pid, true) . $sub['name'];
                $sub['url_crc'] = sprintf("%u", crc32($sub['url']));
                $sub['updated'] = date('Y-m-d H:i:s');

                // UPDATE SUB CATEGORIES
                if ($sub['cat'])
                {
                    // UPDATE CATEGORY
                    $this->update($sub['id'], $sub);

                    // CHECK/UPDATE SUBS
                    $this->subs_update($sub['id'], $cats);
                }

                // UPDATE SUB PAGES
                else
                {
                    $updated[] = $sub;
                }
            }

            // BATCH UPDATE SUB PAGES
            if (!empty($updated))
            {
                $this->batch_up($updated);
            }
        }
    }

// ------------------------------------------------------------------- SORT CATEGORIES
    public function sort_category($order)
    {
        $this->batch_up($order);
    }

// ---------------------------------------------------------------------- SORT PAGES
    public function sort_page($order)
    {
        $this->batch_up($order);
    }

// ------------------------------------------------------- SET ORDER FOR NEW ELEMENT
    public function new_order($elem)
    {
        return intval($this->last(
            'sort', ['pid' => $elem['pid'], 'cat' => $elem['cat'], 'cat' => $elem['cat']])
        ) + 1;
    }

// -------------------------------- REORDER SORTED LIST (after upper element delete)
    public function reorder($elem)
    {
        $elems   = $this->get(['pid' => $elem['pid'], 'cat' => $elem['cat']]);
        $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);

        empty($reorder) or $this->batch_up($reorder);
    }
}
