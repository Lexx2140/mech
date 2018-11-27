<?php defined('BASEPATH') or exit('No direct script access allowed');

class Site extends Frontend
{
    public $page;
    public $app;

    protected $data;
    protected $contacts;
    protected $index;

    public function __construct()
    {
        parent::__construct();

        // LOAD APP CONFIG
        $this->app = $this->config->load('app', true);

        // ECOMMERCE (CURRENCY)
        if (isset($this->app['ecomm']) && $this->app['ecomm'])
        {
            $this->app['cur_kurs'] = (!$this->app['curr_kurs'])
                ? currency_converter($this->app['curr'])
                : $this->app['curr_kurs'];
        }

        // CHECK IF SITE IS ONLINE
        // $this->_offline();

        // CACHE (on/off)
        // (!$this->app['cache']) or $this->output->cache($this->app['cache_time']);

        // LOAD PAGES MODEL
        $this->load->model('Site_model');

        // Profiler (doesnt work with html compress)
        // $this->output->enable_profiler(true);
    }

// ------------------------------------------------------------------------ VIEW HOME PAGE
    public function index()
    {
        $this->view();
    }

// ------------------------------------------------------------------------ VIEW PAGES
    public function view()
    {
        // GENERATE & CHECK URL
        $url = $this->router(func_get_args());

        // IF PAGE EXISTS IN DB
        if (!$this->page = ($url !== null) ? $this->Site_model->get_page($url) : null)
        {
            $this->page_not_found();
        }

        // RENDER PAGE
        $this->_render_page();
    }

// --------------------------------------------------------------------- GENERATE URL FROM ARRAY
    private function router($url_array)
    {
        // FOR MULTILANGUAGE SITE
        if ($this->loc['multilang'])
        {
            // GET LANGUAGE SLUG (first uri segment after baseurl) & CHECK IT
            $slug = $this->uri->segment(1);

            // IF LANGUAGE SLUG EXISTS (but not in default language!)
            if ($slug && array_key_exists($slug, $this->langs) && $slug !== $this->loc['def_lang']['slug'])
            {
                // REMOVE LANGUAGE SLUG FROM QUERY
                unset($url_array[0]);
            }
        }

        // IF HOMEPAGE (base_url())
        if (empty($url_array))
        {
            return true;
        }

        // IF SOME OTHER PAGE
        else
        {
            $path = '';

            // CONVERT URL ARRAY TO STRING
            foreach ($url_array as $seg)
            {
                $path .= '/' . $seg;
            }

            return ltrim($path, '/');
        }
    }

// ------------------------------------------------------------------------ RENDER PAGE
    private function _render_page()
    {
        // SET LANGUAGE HREFS/ SWITCHER
        $this->lang_options();

        // RENDER LOGO
        $this->render_logo();

        // RENDER CONTACT INFO
        $this->render_contacts();

        // RENDER METADATA
        $this->render_metadata();

        // RENDER SCRIPTS
        $this->render_scripts();

        // RENDER PAGE LAYOUT
        $this->render_layout();

        // RENDER PAGE
        $this->show_page();
    }

// ----------------------------------------------------------------- LANGUAGE + HREFS/ SWITCHER
    protected function lang_options()
    {
        // CURRENT (DEFAULT) LANGUAGE
        $this->page['lang'] = $this->app_lang['code'] . '-' . $this->loc['country'];

        // ALTERNATE HREFLANGS LINKS
        $this->index['alt_hreflang'] = '';

        // LANGUAGE SWITCHER RENDER
        $this->loc['switcher'] = [];

        if ($this->loc['multilang'])
        {
            foreach ($this->langs as $lang => $params)
            {
                // SET CODE/X-DEFAULT
                $def  = ($params['id'] === $this->loc['def_lang']['id']) ? true : false;
                $code = ($def) ? 'x-default' : $params['code'];

                // REMOVE BACKSLASH IN THE END OF HOME PAGE & APPEND LANGUAGE SLUG
                if (isset($this->page['home']) && $this->page['home'])
                {
                    $link = ($def) ? rtrim(base_url(), '/') : base_url($params['slug']);
                }

                // APPEND LANGUAGE SLUG
                else
                {
                    $slug = (!$def) ? $params['slug'] . '/' : null;
                    $link = base_url($slug . ($this->page['url'] ?? null));
                }

                $this->index['alt_hreflang'] .= '<link rel="alternate" hreflang="' . $code . '" href="' . $link . '"/>';

                $this->loc['switcher'][] = '<a href="' . $link . '">' . $params['slug'] . '</a>';
            }
        }

        // TRANSLATE APP CONFIG
        foreach ($this->app as $key => $value)
        {
            if (is_array($value) && array_key_exists($this->app_lang['slug'], $value))
            {
                $this->app[$key] = $value[$this->app_lang['slug']];
            }
        }

        // SET LOCALIZATION CONFIG
        $this->config->set_item('localize', $this->loc);
    }

// ----------------------------------------------------------------- RENDER MAIN LOGO
    private function render_logo()
    {
        // GET LOGO FROM CONFIG
        $logo   = 'assets/img/' . $this->app['logo'];
        $links  = $this->frontend_lib->links_prepare();
        $dim[3] = '';

        // RENDER IMAGE
        if (!empty($this->app['logo']) && is_file($logo))
        {
            if (mime_content_type($logo) !== 'image/svg+xml')
            {
                $dim = getimagesize($logo);
            }

            $img = '<img src="' . base_url($logo) . '" ' . $dim[3] . ' alt="' . $this->app['sitename'] . '"/>';

            $this->app['logo'] = (rtrim(current_url(), '/') !== $links['home'])
                ? '<a href="' . $links['home'] . '" title="' . $this->app['sitename'] . '">' . $img . '</a>'
                : $img;
            $this->app['logo_path'] = base_url($logo);
        }
        else
        {
            $this->app['logo'] = (rtrim(current_url(), '/') !== $links['home'])
                ? '<a href="' . $links['home'] . '" title="' . $this->app['sitename'] . '">' . $this->app['sitename'] . '</a>'
                : $this->app['sitename'];
        }

        // RESET CONFIG WITH LOGO
        $this->config->set_item('app', $this->app);
    }

// ------------------------------------------------------------------------ RENDER CONTACTS
    protected function render_contacts()
    {
        // GET ALL CONTACTS INFO
        $contacts = ['tels', 'emails', 'social', 'address', 'open'];

        foreach ($contacts as $c)
        {
            if (!empty($this->app[$c][0]))
            {
                $this->contacts[$c] = $this->app[$c];
            }
        }
    }

// ------------------------------------------------------------------------ RENDER METADATA
    protected function render_metadata()
    {
        // LOAD FAVICON(s)
        $this->index['favicon'] = $this->load->view('layout/meta/favicon.tpl', null, true);

        // LOAD MICRODATA LIBRARY
        $this->load->library('site/microdata_lib');
        $md = $this->microdata_lib->render_ljson($this->app, $this->contacts);

        // Load Google (LJSON)
        $this->index['ljson'] = $this->load->view('layout/meta/ljson.tpl', $md, true);

        // Load Facebook microdata (Opengraph)
        $this->index['og'] = $this->load->view('layout/meta/og.tpl', null, true);
    }

// ------------------------------------------------------------------- SCRIPTS RENDER
    protected function render_scripts()
    {
        // INLINE SCRIPTS
        $scripts = ['fonts', 'head', 'body'];

        foreach ($scripts as $js)
        {
            $this->index[$js . '_js'] = ($this->app[$js . '_js'])
                ? '<script>' . file_get_contents('./assets/js/inline/' . $js . '_in.js') . '</script>'
                : null;
        }

        // Load jQuery (CDN/local)
        $this->index['jquery'] = ($this->app['jquery'] !== '')
            ? '<script src="' . $this->app['jquery'] . '"></script>'
            : '<script>' . file_get_contents('./assets/js/inline/jquery.js') . '</script>';
    }

// ----------------------------------------------------------- RENDER LAYOUT & CONTENT
    protected function render_layout()
    {
        // GET PAGE LAYOUT
        $tpl = (!isset($this->tpl))
            ? ('pages/' . ($this->page['cat'] ? 'category/' : $this->page['ptype'] . '/') . $this->page['options']['tpl'])
            : $this->tpl;

        // PRELOADER
        $this->index['preloader'] = ($this->app['preloader'])
            ? $this->load->view('layout/preloader.tpl', null, true)
            : null;

        // HEADER
        $this->index['header'] = ($this->app['header'])
            ? $this->load->view('layout/header.tpl', $this->contacts, true)
            : null;

        // FOOTER
        $this->index['footer'] = ($this->app['footer'])
            ? $this->load->view('layout/footer.tpl', $this->contacts, true)
            : null;

        // GO TOP
        $this->index['gotop'] = ($this->app['gotop'])
            ? $this->load->view('layout/gotop.tpl', null, true)
            : null;

        // BREADCRUMBS
        $this->page['breadcrumbs'] = (isset($this->page['breadcrumbs']))
            ? $this->load->view('layout/breadcrumbs.tpl', $this->page['breadcrumbs'], true)
            : null;

        // PAGINATION
        $this->page['pagination'] = (isset($this->page['pagination']))
            ? $this->load->view('layout/pagination.tpl', $this->page['pagination'], true)
            : null;

        // PAGE CONTENT
        $this->index['content'] = $this->load->view($tpl.'.tpl', $this->page, true);
    }

// ------------------------------------------------------------------------ 404
    public function page_not_found()
    {
        $this->page['m_title'] = lang('page_not_found');
        $this->tpl             = 'pages/system/error_404';
        $this->output->set_status_header('404');
    }

// --------------------------------------------------------------------- TEST MODE
    // private function _offline()
    // {
    //     if ($this->app['off_air'] && $this->session->role !== 'test')
    //     {
    //         // SET LANGUAGE HREFS/ SWITCHER
    //         $this->lang_render();

    //         // RENDER LOGO
    //         $this->logo_render();

    //         // RENDER SCRIPTS
    //         $this->scripts_render();

    //         // BODY
    //         $this->index['body'] = $this->load->view('pages/system/offline', null, true);

    //         // RENDER PAGE
    //         $this->output->set_output($this->load->view('index', $this->index, true))->_display();

    //         exit();
    //     }
    // }

// ---------------------------------------------------------- OUTPUT PAGE (w/o HTML MINIFY)
    private function show_page()
    {
    		// SHOW COMPRESSED HTML
        if ($this->app['html_compress'])
        {
            $this->load->library('compress_lib');

            $data['index'] = $this->compress_lib->minify_html($this->load->view('index', $this->index, true));

            return $this->load->view('minified', $data);
        }

        // SHOW WITHOUT COMPRESSION
        return $this->load->view('index', $this->index);
    }

}
