<?php defined('BASEPATH') or exit('No direct script access allowed');

class Frontend_lib
{
    public $loc;

    public function __construct($loc)
    {
        $this->CI = &get_instance();

        $this->loc = $loc;

        // TimeZone for localhost (OpenServer)
        if (ENVIRONMENT === 'development')
        {
            date_default_timezone_set('Europe/Kiev');
        }
    }

// --------------------------------------------------------- PREPARE LINKS FOR PAGES/MENU/WIDGETS
    public function links_prepare()
    {
        // RENDER LINKS
        $home   = rtrim(base_url(), '/');
        $prefix = '';

        // IF MULTILANGUAGE
        if ($this->loc['multilang'])
        {
            $current = $this->CI->session->app_lang;

            if ($current['id'] !== $this->loc['def_lang']['id'])
            {
                $home   = base_url($current['slug']);
                $prefix = $current['slug'] . '/';
            }
        }

        return [
            'home'   => $home,
            'prefix' => $prefix
        ];
    }

// ------------------------------------------------------------------ APPEND LANG SLUG TO LINK
    public function lang_url($url = null)
    {
        $prepared = $this->links_prepare();
        return base_url($prepared['prefix'] . $url);
    }

}
