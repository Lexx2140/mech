<?php defined('BASEPATH') or exit('No direct script access allowed');

class Content_lib
{
    // APP LANGUAGES
    private $langs;

    public function __construct()
    {
        $this->CI = &get_instance();

        // LOAD ACTIVE APP LANGUAGES
        $this->langs = $this->CI->lang_lib->get_langs();
    }

// ------------------------------------------------------------ GET CONTENT FROM SUB TABLE(s)
    public function get_content($elem, $table)
    {
        // GET WIDGET(s)
        if (isset($elem['widget']) && !empty($elem['widget']))
        {
            $elem['widget'] = unserialize($elem['widget']);
        }

        // GET CONTENT
        $content = $this->CI->db
                        ->select('*')
                        ->where('id', $elem['id'])
                        ->order_by('lang_id ASC')
                        ->get($table, count($this->langs))
                        ->result_array();

        if (!empty($content))
        {
            // SET CONTENT TO RETRIEVE & SORT BY LANG ID
            foreach ($content as $key => $val)
            {
                unset($val['id']);
                $sorted[$val['lang_id']] = $val;

                if (isset($elem['json']) && $elem['json'])
                {
                    $sorted[$val['lang_id']]['content'] = json_decode($sorted[$val['lang_id']]['content'], true);
                }
            }

            // CREATE ARRAY OF CONTENT LABELS
            $labels = array_keys($sorted[1]);

            foreach ($labels as $label)
            {
                foreach ($this->langs as $key => $val)
                {
                    $desc[$label][$key] = $sorted[$val['id']][$label] ?? '';
                }
            }

            // MERGE BASE & CONTENT
            $elem = array_merge($elem, $desc);
        }

// ------------------------------------------------------------------------ TODO
        $elem = $this->get_options($elem);

        if (isset($elem['ptype']))
        {
            if ($elem['ptype'] === 'product')
            {
                // GET ADDON CONTENT
                $elem['product'] = $this->CI->db
                                        ->select('*')
                                        ->where('page_id', $elem['id'])
                                        ->get('products', 1)
                                        ->row_array();
            }
        }

        return $elem;
    }

// --------------------------------------------------------------------- GET OPTIONS/JOPTIONS
    public function get_options($elem)
    {
        // GET ONLY JOPTIONS
        if (isset($elem['joptions']))
        {
            $elem['joptions'] = json_decode($elem['joptions'], true);
            return $elem;
        }

        // GET OPTIONS
        if (isset($elem['options']))
        {
            $elem['options'] = json_decode($elem['options'], true);

            // GET JOPTIONS INSIDE OPTIONS
            if (isset($elem['options']['joptions']))
            {
                $elem['joptions'] = json_decode($elem['options']['joptions'], true);
                unset($elem['options']['joptions']);
            }
        }

        return $elem;
    }

// --------------------------------------------- PREPARE CONTENT AND OPTIONS TO SAVE
    public function prepare_content($input)
    {
        // CHECK IF THERE ARE ARRAYS IN INPUT WHERE (KEY === LANGUAGE KEY)
        foreach ($input as $name => $value)
        {
            if (is_array($value) && empty(array_diff_key($value, $this->langs)))
            {
                // CREATE ARRAY OF TRANSLATED ITEMS
                $translated[] = $name;
            }
        }

        // IF THERE ARE TRANSLATED ITEMS
        if (isset($translated) && !empty($translated))
        {
            // CREATE COPY OF INPUT FOR EACH LANGUAGE
            foreach ($this->langs as $lang_key => $lang_vals)
            {
                // ASSIGN LANGUAGE
                $new['lang_id'] = $lang_vals['id'];

                // SET TRANSLATED VALUES
                foreach ($translated as $name)
                {
                    $new[$name] = $input[$name][$lang_key];
                }

                // CREATE ARRAY WITH TRANSLATED INPUTS
                $content['desc'][] = $new;
            }

            // PREPARE BASE
            foreach ($translated as $name)
            {
                unset($input[$name]);
            }
        }

        // PREPARE OPTIONS
        if (isset($input['options']))
        {
            $input = $this->prepare_options($input);
        }

        $content['base'] = $input;

        return $content;
    }

// --------------------------------------------------------------------- PREPARE OPTIONS
    public function prepare_options($input, $base = null)
    {
        // CHECK FOR JSON OPTIONS
        if (isset($input['joptions']))
        {
            $input['options']['joptions'] = $this->prepare_joptions($input['joptions']);
            unset($input['joptions']);
        }

        // CHECK FOR OPTIONS
        if (isset($input['options']))
        {
            $input['options'] = json_encode($input['options']);
        }

        return $input;
    }

// ------------------------------------------------- PREPARE JS OPTIONS GROUPS
    public function prepare_joptions($joptions)
    {
        // GET ALL JS OPTIONS WITH PARENT KEYS AS NAME OF OPTION
        foreach ($joptions as $key => $value)
        {
            // IF VALUES HAVE PARENT KEY
            if (isset($value[$key]) && $value[$key] === 'true')
            {
                // IF PARENT KEY IS TRUE - save value(s)
                unset($value[$key]);
                $json[$key] = $value;
            }
            else
            {
                $json[$key] = '';
            }
        }

        // SAVE OPTIONS IN JSON
        $joptions = json_encode($json);

        return $joptions;
    }

// ---------------------------------------------------------- SAVE CONTENT TO DESC_TABLE
    public function save_content($elem_id, $content, $table)
    {
        // SAVE ITEM CONTENT
        foreach ($content as $desc)
        {
            $desc['id'] = $elem_id;
            $batch[]    = $desc;
        }

        $this->CI->db->insert_batch($table, $batch);
    }

// --------------------------------------------------------- SAVE EXTRA CONTENT (TODO)
    public function save_addon_content($page_id, $content)
    {
        if (isset($content['products']))
        {
            // SAVE ITEM CONTENT
            $data['page_id'] = $page_id;
            $data += $content['product'];

            $this->CI->db->insert('products', $data);
        }
    }

// ---------------------------------------------------------- UPDATE TRANSLATED CONTENT
    public function update_content($elem_id, $content, $table)
    {
        $created = [];
        $updated = [];

        // CHECK IF LANGUAGES NOT CHANGED/ CONTENT ADDED
        foreach ($content as $desc)
        {
            // IF NOT CHANGED
            if (isset($desc['cid']) && !empty($desc['cid']))
            {
                $updated[] = $desc;
            }

            // IF LANGUAGE/CONTENT ADDED
            else
            {
                $created[] = $desc;
            }
        }

        // UPDATE CONTENT
        if (!empty($updated))
        {
            $this->CI->db->update_batch($table, $updated, 'cid');
        }

        // INSERT NEW CONTENT
        if (!empty($created))
        {
            $this->save_content($elem_id, $created, $table);
        }
    }

// --------------------------------------------------------- SAVE EXTRA CONTENT (TODO)
    public function update_addon_content($page_id, $content)
    {
        // PREPARE DATA TO SAVE IN SPECIFIED TABLE
        $data = (isset($content['product'])) ? $content['product'] : null;

        if ($data)
        {

            // CHECK IF SPECIFIC CONTENT EXISTs
            $existing = $this->CI->db->where('page_id', $page_id)->get('products', 1)->row_array();

            if ($existing)
            {
                $this->CI->db->where('page_id', $page_id)->update('products', $data);
            }
            else
            {
                $data['page_id'] = $page_id;
                $this->CI->db->insert('products', $data);
            }
        }
    }

// ------------------------------------------------------------- DELETE EXTRA CONTENT (TODO)
    public function delete_addon_content($page)
    {
        // GET CONTENT|PAGE TYPE
        if ($page['ptype'] === 'product')
        {
            $this->CI->db->where('page_id', $page['id'])->delete('products');
        }
    }

// ------------------------------------------------------------- PREPARE TO SAVE PAGE CONTENT
    public function prepare_page_content($input, $base, $meta_base, $category = 0)
    {
        // GET DEFAULT INPUTS
        $base      = explode(', ', $base);
        $meta_base = explode(', ', $meta_base);

        // GET WIDGETS
        $input['widget'] = (!empty($input['widget']))
            ? serialize($input['widget'])
            : null;

        // CANONIC PAGE
        if (!$input['options']['canonic'])
        {
            unset($input['options']['canonic']);
        }

        // JSON ENCODE OPTIONS (if isset)
        $input = $this->prepare_options($input);

        // SORT CONTENT
        $content = [];

        // CHECK/PREPARE JSON CONTENT
        if (isset($input['json']) && $input['json'])
        {
            $json = $this->prepare_json_multicontent($input['content']);
        }

        // BASE/DESC PREPARE
        foreach ($input as $name => $value)
        {
            // SET BASE
            if (in_array($name, $base))
            {
                $content['base'][$name] = $value;
                unset($input[$name]);
            }

            // SET META
            if (in_array($name, $meta_base))
            {
                $meta[$name] = $value;
                unset($input[$name]);
            }
        }

// ------------------------------------------------------------------------ TODO
        // PREPARE TABLE SPECIFIED CONTENT
        if (isset($input['product']))
        {
            $content['product'] = $input['product'];
        }

// ------------------------------------------------------------------------

        // COMPILE CONTENT
        $content['desc'] = $this->desc_prepare($meta);
        $count           = count($content['desc']);

        if (isset($json) && !empty($json))
        {
            $content['base']['json'] = 1;

            for ($i = 1; $i <= $count; $i++)
            {
                $content['desc'][$i]['content'] = $json[$i];
            }
        }

        // SET CATEGORY/PAGE
        $content['base']['cat'] = $category;

        // SAVE URL IN CRC32 (for faster search in DB)
        $content['base']['url_crc'] = sprintf("%u", crc32($content['base']['url']));

        return $content;
    }

// ------------------------------------------------------------ CONTENT DESCRIPTION PREPARE
    public function desc_prepare($input)
    {
        // GET KEYS(names) OF INPUT
        $keys = array_keys($input);

        foreach ($this->langs as $lang_key => $lang_vals)
        {
            foreach ($keys as $name)
            {
                // FOR TRANSLATED CONTENT
                if (is_array($input[$name]) && array_key_exists($lang_key, $input[$name]))
                {
                    $new['lang_id'] = $lang_vals['id'];
                    $new[$name]     = $input[$name][$lang_key];
                }
            }

            // CREATE ARRAY WITH TRANSLATED INPUTS (WITH THE LANG_ID AS A KEY )
            $desc[$lang_vals['id']] = $new;
        }

        return $desc;
    }

// --------------------------------------------------------- PREPARE TO SAVE PAGE JSON MULTICONTENT
    public function prepare_json_multicontent($json)
    {
        $content = [];

        foreach ($this->langs as $lang_key => $lang_params)
        {
            if (isset($json[$lang_key]))
            {
                $content[$lang_params['id']] = json_encode($json[$lang_key], JSON_UNESCAPED_UNICODE);
            }
        }

        return $content;
    }

    // // --------------------------------------------------------- PREPARE TO SAVE PAGE JSON MULTICONTENT
    //     public function prepare_json_multicontent($json)
    //     {
    //         // SEPARATE TRANSLATED/NOT TRANSLATED CONTENT

    //         // ARRAY FOR TR CONTENT
    //         $parsed['tr'] = [];

    //         // ARRAY FOR nonTR CONTENT
    //         $parsed['ntr'] = [];

    //         foreach ($json as $key => $value)
    //         {
    //             // MULTILANGUAGE CONTENT
    //             if (empty(array_diff_key($value, $this->langs)))
    //             {
    //                 $parsed['tr'][$key] = $json[$key];
    //             }
    //             else
    //             {
    //                 $parsed['ntr'][$key] = $json[$key];
    //             }
    //         }

    //         // COMPILE TRANSLATED CONTENT
    //         $ctr = [];

    //         if (!empty($parsed['tr']))
    //         {
    //             // SORT TRANSLATED JSON BY LANGS
    //             foreach ($this->langs as $lang_key => $lang_params)
    //             {
    //                 foreach ($parsed['tr'] as $key => $content)
    //                 {
    //                     $j[$key] = $content[$lang_key];
    //                 }

    //                 $ctr[][$lang_key] = $j;
    //             }
    //         }

    //         // COMPILE TRANSLATED & NON TRANSLATED CONTENT
    //         for ($i = 0; $i < count($ctr); $i++)
    //         {
    //             $ctr[$i] += $parsed['ntr'];
    //             $ctr[$i] = json_encode($ctr[$i], JSON_UNESCAPED_UNICODE);
    //         }

    //         return $ctr;
    //     }
}
