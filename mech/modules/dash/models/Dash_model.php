<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends Admin_model
{
    private $_cache_path = APPPATH . '/cache/';
    private $_logo_path  = 'assets/img/';
    private $old;
    private $new;

    public function __construct()
    {
        parent::__construct();
    }

// ------------------------------------------------------------------------ SITE CONFIG
    public function get_setup()
    {
        // GET SETUP CONTENT & FORM
        $setup         = $this->load->config('app', true);
        $setup['form'] = $this->load->config('dash/base_form', true);

        // GET HOMEPAGE
        $setup['homepage_select'] = $this->dash_lib->page_select($setup['homepage'] ?? '');

        // LOGO EDIT
        $logo_options = [
            'img_w' => '100',
            'img_h' => '50'
        ];

        $setup['logo_options'] = json_encode($logo_options);
        $setup['logo_edit'] = $this->media_lib->edit_media('file', $setup['logo'], $this->_logo_path);

        // SCRIPTS EDIT
        $scripts = ['head', 'body'];

        foreach ($scripts as $js)
        {
            $setup[$js . '_js'] = ($setup[$js . '_js'])
                ? file_get_contents('./assets/js/inline/' . $js . '_in.js') : '';
        }

        // CURRENCIES
        $setup['currencies'] = $this->config->load('currencies', true);

        return $setup;
    }

// ----------------------------------------------------------------- SAVE SITE CONFIG
    public function save_setup()
    {
        // GET OLD CONFIG DATA
        $this->old = $this->config->item('app');

        // GET INPUT CONFIG DATA
        $this->new = $this->input->post();

        // UPDATE HOMEPAGE
        $this->url_lib->make_homepage($this->new['homepage']);

        // LOGO SETUP
        $this->_logo_setup();

        // SCRIPTS OPTIONS
        $this->_scripts_setup();

        // CONTACTS SETUP
        $this->_contacts_setup();

        // CACHE OPTIONS
        $this->_cache_setup();

        // SAVE CONFIG TO FILE
        $this->_save_setup_file();
    }

// ------------------------------------------------------------------------ LOGO SETUP
    private function _logo_setup()
    {
        $this->new = $this->img_lib->img_control(
            $this->old,
            $this->new,
            $img_cell = 'logo',
            $path = $this->_logo_path,
            $filename = 'logo',
            $overwrite = true,
            $thumb = false
        );

        $this->new['logo'] = $this->new['logo'] ?? $this->old['logo'];
    }

// ------------------------------------------------------ CONTACTS SETUP (json -> array)
    private function _contacts_setup()
    {
        // SOCIAL CONTACTS PREPARE
        $social = $this->new['social'];
        unset($this->new['social']);

        foreach ($social as $s)
        {
            $this->new['social'][] = json_decode($s, true);
        }

        // PHONES PREPARE (title & href)
        $phones = $this->new['tels'];

        if (!empty($phones[0]))
        {
            unset($this->new['tels']);
            foreach ($phones as $phone)
            {
                $this->new['tels'][] = [
                    'tel'  => $phone,
                    'href' => preg_replace('/[^0-9]/', '', $phone)
                ];
            }
        }
    }

// ------------------------------------------------------------------------ SCRIPTS SETUP
    private function _scripts_setup()
    {
        // SCRIPTS EDIT
        $scripts = ['head', 'body'];

        foreach ($scripts as $js)
        {
            if ($this->new[$js . '_js'] !== '')
            {
                file_put_contents('./assets/js/inline/' . $js . '_in.js', $this->new[$js . '_js']);
                $this->new[$js . '_js'] = 1;
            }
            else
            {
                fopen('./assets/js/inline/' . $js . '_in.js', 'w');
                $this->new[$js . '_js'] = 0;
            }
        }
    }

// ------------------------------------------------------------------------ CACHE SETUP
    private function _cache_setup()
    {
        // CLEAN CACHE AND STOP CACHING FOR OFFLINE MODE
        if ($this->new['off_air'])
        {
            $this->new['cache'] = 0;
            $this->_cache_clean();
        }

        // CANCEL PAGE CACHING AND CLEAN ALL CACHE DATA
        if (!$this->new['cache'])
        {
            $this->_cache_clean();
        }
    }

// ------------------------------------------------------------------------ CACHE CLEAN
    private function _cache_clean()
    {
        $dir = scandir($this->_cache_path);

        unset($dir['0'], $dir['1']);

        if (!empty($dir))
        {
            foreach ($dir as $file)
            {
                if ($file !== '.htaccess' && $file !== 'index.html')
                {
                    unlink($this->_cache . $file);
                }
            }
        }
    }

// ------------------------------------------------------------- SAVE APP CONFIG TO FILE
    private function _save_setup_file()
    {
        file_put_contents(
            './mech/app/config/app.php', '<?php defined(\'BASEPATH\') or exit(\'No direct script access allowed\');' . "\n \n" . '$config = ' . var_export($this->new, true) . ';'
        );
    }
}
