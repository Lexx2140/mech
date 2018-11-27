<?php defined('BASEPATH') or exit('No direct script access allowed');

class Frontend extends MX_Controller
{
    // APP LOCALIZATION
    public $loc;

    // ALL ACTIVE LANGUAGES
    public $langs;

    // CURRENT APP LANGUAGE
    public $app_lang;

    // DEFAULT APP LANGUAGE
    public $def_lang;

    // LANGUAGE SHORTCUT
    public $ls;

    public function __construct()
    {
        parent::__construct();

        // LOCALIZE APP
        $this->_localize();

        // LOAD FRONTEND LIBRARY
        $this->load->library('site/frontend_lib', $this->loc);

        // LOAD HELPERS
        $this->load->helper(['language', 'text']);
    }

// ------------------------------------------------------------------------ SET/CHECK LANGUAGE
    protected function _localize()
    {
        // LOAD LOCALIZATION CONFIG
        $this->loc = $this->config->load('localize', true);

        // GET ALL ACTIVE LANGUAGES
        $this->langs = $this->loc['langs'];

        // IF IT WAS AJAX REQUEST
        if ($this->input->is_ajax_request())
        {
            $this->app_lang = $this->session->app_lang;
        }
        // CHECK IF IT IS NOT AJAX REQUEST
        else
        {
            // SET DEFAULT APP LANGUAGE
            foreach ($this->langs as $key => $value)
            {
                if ($key === $this->loc['def_lang']['slug'])
                {
                    $this->def_lang = $value;
                }
            }

            // GET LANGUAGE SLUG (by first uri segment) & CHECK IT
            $slug = $this->uri->segment(1);

            // SET CURRENT LANGUAGE
            $this->app_lang = ($this->loc['multilang'] && $slug && $slug !== $this->loc['def_lang'] && array_key_exists($slug, $this->langs))
                ? $this->langs[$slug]
                : $this->def_lang;

            // SAVE LANGUAGE IN SESSION
            $this->session->set_userdata('app_lang', $this->app_lang);
        }

        // LOAD LANGUAGE FILE
        $this->config->set_item('language', $this->app_lang['name']);

        // LOAD APP MESSAGES FOR THIS LANGUAGE
        $this->lang->load('app_messages', $this->app_lang['name']);

        // SET SHORTCUT FOR LANG
        $this->ls = $this->app_lang['slug'];
    }

}
