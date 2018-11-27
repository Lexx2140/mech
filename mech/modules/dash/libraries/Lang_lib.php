<?php defined('BASEPATH') or exit('No direct script access allowed');

class Lang_lib
{
    public function __construct()
    {
        $this->CI = &get_instance();
    }

// ------------------------------------------------------ GET ACTIVE/DEFAULT LANGUAGES
    public function get_langs()
    {
        // GET LOCALIZATION OPTIONS
        $loc = $this->CI->config->item('localize');

        if ($loc['multilang'])
        {
            $langs = array_merge(
              [$loc['def_lang']['slug'] => $loc['langs'][$loc['def_lang']['slug']]], $loc['langs']);
        }
        else
        {
            $langs[$loc['def_lang']['slug']] = $loc['def_lang'];
        }

        return $langs;
    }

// -------------------------------------------------- MULTILANG SWITCHER IN CONTENT EDITOR
    public function lang_switcher($ul_id)
    {
    		// GET LANGUAGES
    		$langs = $this->get_langs();

    		$multi = (count($langs) > 1) ? 1 : 0;

        $options = [
            'langs' => $langs,
            'ul_id' => $ul_id,
            'multi' => $multi
        ];

        return $this->CI->load->view('dash/edit/lang_switcher', $options, true);
    }
}
