<?php defined('BASEPATH') or exit('No direct script access allowed');

class Site_model extends MY_Model
{
    protected $_table = 'pages';
    protected $_desc  = 'pages_desc';

    protected $_categories;
    protected $_path = 'assets/img/pages/';

    public function __construct()
    {
        parent::__construct();

        // GET LANGUAGE FROM SESSION
        $this->lang_id = $this->session->app_lang['id'];

        // GET ALL CATEGORIES
        $this->_categories = $this->get_categories();
    }

// ------------------------------------------------------------------ GET PAGE (by url)
    public function get_page($url)
    {
        // GET HOMEPAGE
        if ($url === true)
        {
            $this->db->where('pages.home', 1);
        }

        // GET ANY OTHER PAGE
        else
        {
            $this->db
                 ->where('pages.home', 0)
                 ->where('pages.url_crc', sprintf("%u", crc32($url)))
                 ->where('pages.url', $url);
        }

        // APPEND CONTENT
        $page = $this->db
                     ->select('pages.*')
                     ->select('pages_desc.*')
                     ->where('pub', 1)
                     ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->lang_id, 'left')
                     ->get('pages', 1)
                     ->row_array();

        // RETURN FULL PAGE DATA
        return (!empty($page)) ? $this->parse_pagedata($page) : null;
    }

// ----------------------------------------------------------- GET ONE CATEGORY (by ID)
    public function get_category($id)
    {
        $cat = $this->db
                    ->select('pages.*')
                    ->select('pages_desc.*')
                    ->where('pages.id', $id)
                    ->where('pages.cat', 1)
                    ->where('pub', 1)
                    ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->lang_id, 'left')
                    ->get('pages', 1)->row_array();

        if (!empty($cat))
        {
            // GET CAT OPTIONS
            $cat['options'] = json_decode($cat['options'], true);

            // GET PARENT CATEGORY
            $cat['parent_cat'] = $this->get_parent_cat($cat);

            // GET CATEGORY PATH
            $cat['path'] = $this->get_path($cat);
        }

        return $cat;
    }

// -------------------------------------------------------- GET PAGE PARENT CATEGORY
    public function get_parent_cat($page)
    {
        // GET PARENT CATEGORY (if isset)
        $cat = ($page['pid']) ? $this->get_row(['id' => $page['pid']]) : null;

        // GET CATEGORY OPTIONS
        if ($cat)
        {
            $cat['options'] = json_decode($cat['options'], true);
        }

        return $cat;
    }

// ------------------------------------------------------------------- GET ALL CATEGORIES
    public function get_categories()
    {
        return $this->db
                    ->select('pages.id, pages.pid, pages.name, pages.url, pages.sort, pages.pub, pages.home, pages.options')
                    ->select('pages_desc.title')
                    ->from('pages')
                    ->where('pages.cat', 1)
                    ->where('pages.pub', 1)
                    ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->lang_id, 'left')
                    ->order_by('sort ASC')
                    ->get()->result_array();
    }

// ----------------------------------------------------------------- GET CATEGORY SUBS
    public function get_subs($cat, $limit = null, $offset = null, $allied = false)
    {
        // GET FIRST TOP PAGES (if isset)
        $top = ($cat['options']['items_top'] || !$allied)
            ? $cat['options']['items_top']
            : null;

        // GET LIMIT
        $limit = ($cat['options']['items_num'] && !$limit)
            ? $cat['options']['items_num']
            : $limit;

        // GET OFFSET (for AJAX pagination)
        $offset = ($this->input->is_ajax_request() && !$offset)
            ? $this->input->get('offset') * $limit
            : $offset;

        // GET SUBCATEGORIES FROM DB
        $subs['cats'] =
        $this->db
             ->select('pages.*')
             ->select('pages_desc.*')
             ->from('pages')
             ->where('pages.pid', $cat['id'])
             ->where('pages.pub', 1)
             ->where('pages.cat', 1)
             ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->lang_id, 'left')
             ->limit($limit, $offset)
             ->order_by($cat['options']['items_sort'], $cat['options']['items_sort_dir'])
             ->get()->result_array();

        // GET SUB PAGES FROM DB
        $subs['pages'] =
        $this->db
             ->select('pages.*')
             ->select('pages_desc.*')
             ->from('pages')
             ->where('pages.pid', $cat['id'])
             ->where('pages.pub', 1)
             ->where('pages.cat', 0)
             ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->lang_id, 'left')
             ->limit($limit, $offset + $top)
             ->order_by($cat['options']['items_sort'], $cat['options']['items_sort_dir'])
             ->get()->result_array();

        // GET TOP SUBS FROM DB
        if ($top)
        {
            $subs['top'] =
            $this->db
                 ->select('pages.*')
                 ->select('pages_desc.*')
                 ->from('pages', $top)
                 ->where('pages.pid', $cat['id'])
                 ->where('pages.pub', 1)
                 ->join('pages_desc', 'pages_desc.id=pages.id AND pages_desc.lang_id=' . $this->lang_id, 'left')
                 ->order_by($cat['options']['items_sort'], $cat['options']['items_sort_dir'])
                 ->get()->result_array();
        }

        // PREPARE SUBS CONTENT
        return (!empty($subs)) ? $this->render_subs($cat, $subs, $allied) : null;
    }

// ---------------------------------------------------------------------- RENDER SUBS
    public function render_subs($cat, $subs, $allied = false)
    {
        // PREPARE LINKS
        $links = $this->frontend_lib->links_prepare();

        $els = ['cats', 'pages', 'top'];

        foreach ($els as $el)
        {
            if (isset($subs[$el]) && !empty($subs[$el]))
            {
                // GET SUBS NUM
                $count = count($subs[$el]);

                for ($i = 0; $i < $count; $i++)
                {
                    // SET PATH
                    $subs[$el][$i]['path'] = $cat['path'];

                    // SET URLs
                    $subs[$el][$i]['url'] = ($subs[$el][$i]['home'])
                        ? $links['home']
                        : base_url($links['prefix'] . $subs[$el][$i]['url']);

                    // SUB CATEGORIES
                    if ($subs[$el][$i]['cat'])
                    {
                        // ADD CATEGORY NAME TO PATH
                        $subs[$el][$i]['path'] .= $subs[$el][$i]['name'] . '/';
                        $sub_name = 'categories';
                    }

                    // SUB PAGES
                    if (!$subs[$el][$i]['cat'])
                    {
                        if ($subs[$el][$i]['ptype'] === 'product')
                        {
                            $subs[$el][$i]['product'] = $this->get_product($subs[$el][$i]['id']);
                        }

                        $sub_name = 'pages';
                    }

                    // PREPARE ARRAYS for subs (straight|allied)
                    if ($allied)
                    {
                        $cat_subs[] = $subs[$el][$i];
                    }
                    else
                    {
                        $cat_subs[$el][] = $subs[$el][$i];
                    }
                }

            }
        }

        return $cat_subs ?? null;

    }

// ------------------------------------------------------------------------ GET PRODUCT
    public function get_product($page_id)
    {
        return $this->db->select('*')
                    ->where('page_id', $page_id)
                    ->get('products', 1)
                    ->row_array();
    }

// ----------------------------------------------------------------- GET ALLIED CATEGORIES
    public function get_allied($cat)
    {
        // GET LIST OF ALLIED CATEGORIES FROM OPTIONS
        $list = $cat['options']['allied'] ?? null;

        if ($list)
        {
            // GET CATEGORIES FROM DB
            foreach ($list as $id)
            {
                $allied_cat = ($id > 0) ? $this->get_category($id) : null;

                if ($allied_cat)
                {
                    $allied['cats'][$id] = $allied_cat;
                }
            }

            // GET SUB PAGES OF ALLIED CATEGORIES
            if (!empty($allied['cats']))
            {
                // SET LIMIT OF SHOWN PAGES
                $limit = $cat['options']['allied_num'] ?? 5;

                foreach ($allied['cats'] as $allied_cat)
                {
                    $allied['pages'][$allied_cat['id']] = $this->get_subs($allied_cat, $limit, null, true);
                }
            }
        }

        return $allied ?? null;
    }

// -------------------------------------------------------------- PREPARE FULL PAGE DATA
    public function parse_pagedata($page, $parent_cat = null)
    {
        // GET CATEGORIES TREE
        $htree = $this->frontend_lib->cat_htree($this->_categories, $page['pid']);

        // GET OPTIONS
        $page['options'] = json_decode($page['options'], true);

        // GET PARENT CATEGORY
        $page['parent_cat'] = $parent_cat ?? $this->get_parent_cat($page);

        // GET PATH & SLUG
        $page['path'] = $this->get_path($page, $htree);

        // GET PAGE CONTENT
        $page = $this->get_content($page);

        // IF CATEGORY
        if ($page['cat'])
        {
            // GET ALL SUBS (categories and pages)
            $page['subs'] = $this->get_subs($page);

            // GET ALLIED (categories and pages)
            $page['allied'] = $this->get_allied($page);

            // PREPARE PAGINATION FOR SUBS
            $page['pagination'] = $this->get_pagination($page);
        }

        // GENEREATE BREADCRUMBS
        $page['breadcrumbs'] = $this->frontend_lib->generate_breadcrumbs($page, $htree);

        // RENDER PAGE
        return $page;
    }

// ------------------------------------------------------------------------- GET PAGE PATH
    public function get_path($page, $htree = null)
    {
        // GET SLUG/PATH
        $slug = (isset($page['parent_cat']) && !empty($page['parent_cat']))
            ? $this->cat_slug($page['pid'], $htree)
            : '';

        // ADD CATEGORY NAME (if category)
        $slug .= ($page['cat']) ? $page['name'] . '/' : '';

        // GENERATE PATH
        return $this->_path . $slug;
    }

// ---------------------------------------------------------------------- GET PAGE CONTENT
    public function get_content($page)
    {
        // META TITLE SUFFIX
        $suffix = $this->config->item('app')['suff'];
        $ls     = $this->session->app_lang['slug'];

        $suffix = (!empty($suffix[$ls]))
            ? ' | ' . $suffix[$ls]
            : null;

        // META TITLE
        $page['m_title'] = (empty($page['m_title']))
            ? $page['title'] . $suffix
            : $page['m_title'] . $suffix;

        // GET PAGE CONTENT FROM JSON
        $page['content'] = ($page['json'])
            ? json_decode($page['content'], true)
            : $page['content'];

        // GET ADDON PAGE CONTENT
        if ($page['ptype'] === 'product')
        {
            $page['product'] = $this->get_product($page['id']);
        }

        // GET WIDGET(s)
        $page['widget'] = (isset($page['options']['widget']))
            ? $page['options']['widget']
            : null;

        // GET CATEGORY(s) TO PREVIEW AT PAGE
        $page['cat_preview'] = (isset($page['options']['cat_preview']))
            ? $this->cat_preview($page['options']['cat_preview'])
            : null;

        // GET PAGE IMAGE
        $page = $this->get_image($page);

        return $page;
    }

// ------------------------------------------------------------------------ GET PAGE IMAGE
    public function get_image($page)
    {
        if (!empty($page['img']) && is_file($page['path'] . $page['img']))
        {
            // GET IMAGE FILE
            $img = $page['path'] . $page['img'];

            $page['img_path'] = base_url($img);

            // GET IMAGE OPTIONS FROM FILE
            $dim = [
                0 => 'auto',
                1 => 'auto',
                2 => '',
                3 => 'width="auto" height="auto"'
            ];

            $dim = getimagesize($page['img_path']);

            $page['page_img'] = '<img itemprop="contentUrl" src="' . $page['img_path'] . '" alt="' . $page['title'] . '" title="' . $page['title'] . '" ' . $dim['3'] . '/><link itemprop="url" href="' . $page['img_path'] . '"><meta itemprop="width" content="' . $dim[0] . '"><meta itemprop="height" content="' . $dim[1] . '"><meta itemprop="datePublished" content="' . $page['created'] . '"/>';
        }

        return $page;
    }

// -------------------------------------------------------------- CATEGORY PREVIEW AT PAGE
    public function cat_preview($id = null)
    {
        // GET CATEGORY
        if ($id)
        {
            $cat = $this->get_category($id);

            // Get category subs
            $cat['subs'] = $this->get_subs($cat);
        }

        $tpl         = $cat['options']['tpl'];
        $cat_preview = ($cat)
            ? $this->load->view('pages/category/preview/' . $tpl . '.tpl', $cat, true)
            : null;

        return $cat_preview;
    }

// ------------------------------------------------------------------- CATEGORIES URL SLUG
    public function cat_slug($pid, $htree = null, $linked = false)
    {
        $slug = '';

        // GET ARRAY WITH ALL PARENT CATEGORIES (for current element)
        if (!$htree)
        {
            $htree = ($pid) ? $this->cat_htree($this->_categories, $pid) : null;
        }

        if ($htree)
        {
            foreach ($htree as $cat)
            {
                // GET URL SLUG/FOLDER PATH FOR CATEGORIES
                if ((isset($cat['options']['add_url']) && $cat['options']['add_url']) || !$linked)
                {
                    $slug .= $cat['name'] . '/';
                }
            }
        }

        return $slug;
    }

// ----------------------------------------------------------------- GET PAGINATION OPTIONS
    public function get_pagination($cat)
    {
        // GET ALL ROWS (for pagination)
        if ($cat['options']['items_num'])
        {
            // COUNT ALL ROWS
            $total = $this->db->where('pub', 1)
                          ->where('pid', $cat['id'])
                          ->get('pages')->num_rows();

            // PREPARE PAGINATION OPTIONS
            if ($cat['options']['items_num'] < $total)
            {
                $pagination = [
                    'total_rows' => $total,
                    'per_page'   => $cat['options']['items_num']
                ];
            }
        }

        return $pagination ?? null;
    }

// -------------------------------------------------------------- GENERATE BREADCRUMBS
    public function generate_breadcrumbs($page, $htree = null)
    {
        // CHECK IF CATEGORY HIERARCHICAL TREE ISSET
        if ($htree)
        {
            // PREPARE LINKS (if multilanguage i.e.)
            $links = $this->frontend_lib->links_prepare();

            // GET NUMBER OF PARENT CATEGORIES
            $count = count($htree);

            // RENDER CRUMBS
            for ($i = 0; $i < $count; $i++)
            {
                // GET PREVIOUS PARENT
                $parent = ($i > 0) ? $htree[$i - 1] : null;

                // SET PAGE URL
                if (!$parent)
                {
                    $links['home'] .= '/' . $htree[$i]['name'];
                }
                else
                {
                    $options = json_decode($parent['options'], true);

                    $links['home'] = ($options['add_url'])
                        ? $links['home'] . '/' . $htree[$i]['name']
                        : rtrim($links['home'], $parent['name']) . $htree[$i]['name'];
                }

                $breadcrumbs['crumbs'][$i] = [
                    'url'   => $links['home'],
                    'title' => $htree[$i]['title']
                ];
            }

            // SET CRUMBS FOR CURRENT PAGE
            $breadcrumbs['current'] = $page['title'];
            $breadcrumbs['count']   = $count;
        }

        return $breadcrumbs ?? null;
    }

// ----------------------------------------------- CREATE CATEGORIES HIERARCHICAL TREE
    public function cat_htree($cats, $pid)
    {
        return array_reverse($this->recurse_htree($cats, $pid));
    }

    public function recurse_htree($cats, $pid, $htree = [])
    {
        foreach ($cats as $cat)
        {
            if ($cat['id'] == $pid)
            {
                $htree[] = $cat;
                $htree += $this->recurse_htree($cats, $cat['pid'], $htree);
            }
        }

        return $htree;
    }
}
