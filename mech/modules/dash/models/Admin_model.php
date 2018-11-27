<?php defined('BASEPATH') or exit('No direct script access allowed');

class Admin_model extends MY_Model
{
    public $app;
    protected $def_lang_id;

    public function __construct()
    {
        parent::__construct();

        // GET APP CONFIG
        $this->app = $this->get_app_config();

        // GET DEFAULT APP LANGUAGE
        $this->def_lang_id = $this->app['def_lang']['id'];
    }

// ------------------------------------------------------------ GET APP/LOCALIZATION CONFIG
    public function get_app_config()
    {
        return $this->load->config('app', true) + $this->load->config('localize', true);
    }

// ----------------------------------------------- GET ALL MODULES & ACTIVE MODULE
    public function get_module($name = null)
    {
        // GET ALL MODULES + CURRENT
        if (!$name)
        {
            // GET ALL MODULES
            $mods = $this->db->where('active', 1)->get('modules')->result_array();

            foreach ($mods as $mod)
            {
                // SORT MODULES BY TYPE
                $modules['modules'][$mod['type']][] = $mod;

                // GET CURRENT MODULE
                if ($mod['name'] === $this->router->fetch_module())
                {
                    $current = $mod;

                    // GET MODULE ADMIN PATH
                    $index = base_url('admin/') . $current['name'] . '/';

                    $current += [
                        'index'   => $index,
                        'default' => $this->load->config('default', true)
                    ];
                }
            }

            // SET ACTIVE MODULE
            $modules['active'] = $current;

            return $modules;
        }

        // GET ONE MODULE
        else
        {
            return $this->db->where('name', $name)->get('modules', 1)->row_array();
        }

    }

}
