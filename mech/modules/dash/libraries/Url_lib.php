<?php defined('BASEPATH') or exit('No direct script access allowed');

class Url_lib
{
    private $def_lang_id;

    public function __construct()
    {
        $this->CI       = &get_instance();
        $this->loc = $this->CI->config->item('localize');
        $this->def_lang_id = $this->loc['def_lang']['id'];
    }

// ----------------------------------------------------------------- GET ALL PAGES
    public function get_all_pages($type = null, $except = null)
    {
        // GET ALL PAGES
        $this->CI->db
             ->select('pages.id, pages.pid, pages.name, pages.url, pages.home, pages.cat, pages.options')
             ->select('pages_desc.title')
             ->where('pub', 1)
             ->from('pages');

        // SELECT BY TYPE (page/category)
        $type === null or $this->CI->db->where('pages.cat', $type);

        // IF EXCEPTED PAGE SET (all pages except current one)
        $except === null or $this->CI->db->where('pages.id!=', $except);

        return $this->CI->db
                    ->join('pages_desc', 'pages_desc.id = pages.id AND pages_desc.lang_id=' . $this->def_lang_id, 'left')
                    ->get()->result_array();
    }

// ------------------------------------------------------------------------ CHECK URL
    public function url_check($url)
    {
        return $this->CI->db->where('url', $url)->from('pages')->count_all_results();
    }

// ------------------------------------------------------------------------ URL CHECK/RENAME
    public function url_check_rename($new, $old)
    {
        if (isset($old['url']) && $old['url'] !== $new['url'] && $this->url_check($new['url']) > 0)
        {
            $check['name']    = $new['name'];
            $check['url']     = $new['url'];
            $check['old_url'] = $old['url'];

            // CORRECT NAME & URL (if needed)
            $checked = $this->url_rename($check);

            $new['name'] = $checked['name'];
            $new['url']  = $checked['url'];
        }

        return $new;
    }

// -------------------------------------------------------------- COPY & RENAME URL IF EXISTS
    public function url_rename($page, $renamed = '')
    {
        if ($renamed === '')
        {
            // RENAME
            $page['name'] .= '-1';
            $page['url'] .= '-1';
        }
        else
        {
            // GET LAST SYMBOL OF LINK
            $add = intval(substr($renamed, -1) + 1);

            // ADD '1' TO LAST RENAMED ITEM
            $page['name'] = substr_replace($page['name'], $add, -1);
            $page['url']  = substr_replace($page['url'], $add, -1);
        }

        // CHECK IF NEW URL EXIST
        return ($page['url'] !== $page['old_url'] && $this->url_check($page['url']) > 0)
            ? $this->url_rename($page, $page['name'])
            : $page;
    }

// ----------------------------------------------------------------- SITEMAP AUTO UPDATE
    public function make_sitemap()
    {
        // LOAD SITEMAP LIBRARY
        $this->CI->load->library('dash/sitemap', base_url());

        $this->CI->sitemap->setFilename('sitemap');

        $pages = $this->CI->db
                      ->where('pub', 1)
                      ->select('url, created, updated, home')
                      ->get('pages')
                      ->result_array();

        // APPEND LANGUAGE SLUG (for multilingual version)
        if ($this->loc['multilang'])
        {
            // GET LANGUAGES FROM DB
            $langs = $this->loc['langs'];

            // GET LANGUAGES SLUGS (w/out default language)
            foreach ($langs as $lang)
            {
                if ($lang['id'] !== $this->loc['def_lang']['id'])
                {
                    $lang_slugs[] = $lang['slug'];
                }
            }

            // CREATE ARRAY WITH PAGES + LANGUAGE SLUGS
            $lang_pages = [];
            $new_pages  = [];

            foreach ($lang_slugs as $slug)
            {
                foreach ($pages as $page)
                {
                    $page_with_slug = $page;

                    // LEAVE ONLY SLUG FOR TRANSLATED HOMEPAGE
                    if ($page_with_slug['home'])
                    {
                        $page_with_slug['url']  = $slug;
                        $page_with_slug['home'] = 0;
                    }
                    // APPEND SLUG TO ALL OTHER PAGES
                    else
                    {
                        $page_with_slug['url'] = $slug . '/' . $page['url'];
                    }

                    $new_pages[] = $page_with_slug;
                }

                $lang_pages += $new_pages;
            }

            // MERGE PAGES WITH LANGUAGE SLUGS
            $pages = array_merge($pages, $lang_pages);
        }

        foreach ($pages as $page)
        {
            // GET CREATE/UPDATE TIME
            $updated = ($page['updated'] === '0000-00-00 00:00:00')
                ? $page['created'] : $page['updated'];

            // SET LINK
            $link = ($page['home']) ? '' : $page['url'];

            // SET PRIORITY
            $priority = ($page['home']) ? '1' : '0.8';

            // ADD ITEM TO SITEMAP
            $this->CI->sitemap->addItem($link, $priority, 'weekly', $updated);
        }

        // CREATE/UPDATE SITEMAP
        $this->CI->sitemap->createSitemapIndex(base_url(), 'Today');
    }

// ------------------------------------------------------------------------ GET HOMEPAGE
    public function get_homepage()
    {
        $home = $this->CI->db->where('home', 1)->select('id')->get('pages', 1)->row_array();
        return $home['id'];
    }

// ------------------------------------------------------------------------ MAKE|CHANGE HOMEPAGE
    public function make_homepage($id = null)
    {
        $current = $this->get_homepage();

        // CHANGE HOMEPAGE
        if (isset($id) && $id !== $current)
        {
            $this->CI->db->where('id', $current)->set('home', 0)->update('pages');
            $this->CI->db->where('id', $id)->set('home', 1)->update('pages');
        }

        // CREATE HOMEPAGE (on page create or delete)
        if (!$id && empty($current))
        {
            $page = $this->CI->db->get('pages', 1)->row_array();
            $this->CI->db->where('id', $page['id'])->set('home', 1)->update('pages');
        }
    }

}
