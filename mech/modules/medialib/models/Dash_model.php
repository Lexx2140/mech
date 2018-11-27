<?php defined('BASEPATH') or exit('No direct script access allowed');

class Dash_model extends Admin_model
{
    protected $_table  = 'medialib';
    protected $_desc   = 'medialib_desc';
    protected $_table2 = 'medialib_items';
    protected $_desc2  = 'medialib_items_desc';

    protected $path = 'assets/media/libs/';
    protected $tpls = 'assets/tpl/medialib/';

    public function __construct()
    {
        parent::__construct();
    }

// ---------------------------------------------------------- GET MEDIA LIBRARIES
    public function get_medialibs()
    {
        return
        $this->db
             ->select('medialib.id, medialib.name, medialib.pub, medialib.sort, medialib.tpl')
             ->select('medialib_desc.title')
             ->from('medialib')
             ->join('medialib_desc', 'medialib_desc.id=medialib.id AND medialib_desc.lang_id=' . $this->def_lang_id, 'left')
             ->get()->result_array();
    }

// -------------------------------------------------------------------- GET WIDGET
    public function get_medialib($id, $content = false)
    {
        $lib = $this->db
                    ->select('medialib.*')
                    ->select('medialib_desc.title')
                    ->from('medialib', 1)
                    ->where('medialib.id', $id)
                    ->join('medialib_desc', 'medialib_desc.id=medialib.id AND medialib_desc.lang_id=' . $this->def_lang_id, 'left')
                    ->get()->row_array();

        return ($content)
            ? $this->content_lib->get_content($lib, $this->_desc)
            : $lib;
    }

// ---------------------------------------------------------------- GET WIDGET ITEMS
    public function get_items($lib_id)
    {
        $this->db
             ->select('medialib_items.*')
             ->select('medialib_items_desc.title, medialib_items_desc.content')
             ->from('medialib_items')
             ->where('medialib_items.pid', $lib_id)
             ->join('medialib_items_desc', 'medialib_items_desc.id=medialib_items.id AND medialib_items_desc.lang_id=' . $this->def_lang_id, 'left')
             ->order_by('medialib_items.sort ASC');

        $items = $this->db->get()->result_array();

        return $items;
    }

// ------------------------------------------------------------------- GET WIDGET ITEM
    public function get_item($id, $content = false)
    {
        $item = $this->db
                     ->select('medialib_items.*')
                     ->select('pages.url, pages.home')
                     ->from('medialib_items', 1)
                     ->where('medialib_items.id', $id)
                     ->join('pages', 'pages.id=medialib_items.url_id', 'left')
                     ->get()->row_array();

        return ($content) ? $this->content_lib->get_content($item, $this->_desc2) : $item;
    }

// ------------------------------------------------------------------- CREATE LIBRARY
    public function create_medialib($default)
    {
        // GET DEFAULT SETTINGS FOR CURRENT TYPE OF LIBRARY
        $elem['default'] = $default;

        // FORM
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('medialib_form', true);

        // TEMPLATE SELECT
        $elem['tpl_select'] = $this->dash_lib->get_tpls($this->tpls);

        // MULTIUPLOAD FILES
        // $elem['items_multiupload'] = $this->load->view('dash/upload/multi', null, true);

        return $elem;
    }

// ---------------------------------------------------------------------- CREATE ITEM
    public function create_item($default, $pid, $src = null)
    {
        // GET PARENT LIB
        $elem['medialib']        = $this->get_medialib($pid, true);
        $elem['parent']['title'] = $elem['medialib']['name'];

        // DEFAULT
        $elem['default'] = $default;

        // FORM
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('medialib_form', true);

        // GET URLS FROM PAGES
        $elem['url_select'] = $this->dash_lib->page_select();

        // SET OPTIONS FOR MEDIA FILES UPLOAD & EDIT
        $elem['media_options'] = json_encode($this->media_lib->get_media_options($default, $elem['medialib']['options']));

        // MEDIA EDIT
        $elem['media_edit'] = $this->media_lib->edit_media($src ?? $default['src']);

        return $elem;
    }

// ------------------------------------------------------------------------ EDIT WIDGET
    public function edit_medialib($id, $default)
    {
        // GET FULL WIDGET DATA
        $elem = $this->get_medialib($id, true);

        // GET DEFAULT SETTINGS
        $elem['default'] = $default;

        // FORM
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('medialib_form', true);

        // TEMPLATE SELECT
        $elem['tpl_select'] = $this->dash_lib->get_tpls($this->tpls);

        // MULTIUPLOAD FILES
        // $elem['items_multiupload'] = $this->load->view('dash/upload/multi', null, true);

        return $elem;
    }

// ---------------------------------------------------------------------- EDIT ITEM
    public function edit_item($id, $default, $src = null)
    {
        // GET ITEM DATA
        $elem = $this->get_item($id, true);

        // GET PARENT LIB
        $lib                     = $this->get_medialib($elem['pid'], true);
        $elem['medialib']        = $lib;
        $elem['parent']['title'] = $elem['medialib']['name'];

        // GET DEFAULT SETTINGS
        $elem['default'] = $default;

        // FORM
        $elem['form'] = $this->load->config('dash/base_form', true)
         + $this->load->config('medialib_form', true);

        // SET URL
        if ($elem['url_id'])
        {
            $elem['link'] = ($elem['home'])
                ? rtrim(base_url(), '/')
                : base_url($elem['url']);
        }

        // GET URLS FROM PAGES
        $elem['url_select'] = $this->dash_lib->page_select($elem['url_id']);

        // SET OPTIONS FOR MEDIA FILES UPLOAD & EDIT
        $elem['media_options'] = json_encode($this->media_lib->get_media_options($elem['default'], $lib['options']));

        // MEDIA EDIT (set allowed mimes to upload)
        $elem['media_edit'] = (!$src || $src === $elem['src'])
            ? $this->media_lib->edit_media($elem['src'], $elem['media'], $this->path . $lib['name'] . '/', $lib['options'])
            : $this->media_lib->edit_media($src);

        return $elem;
    }

// ---------------------------------------------------------------------- SAVE MEDIALIB
    public function save_medialib($old, $new)
    {
        // LOWERCASE WIDGET NAME
        $new['name'] = strtolower($new['name']);

        // CHECK IF NAME EXISTS
        copy_check($old['name'] ?? '', $new['name'], $this->count_it(['name' => $new['name']]));

        // PREPARE FOR ITEMS MULTIUPLOAD
        // $multi_items = $this->multiupload_prepare($new);

        // PREPARE CONTENT
        $new = $this->content_lib->prepare_content($new);

        $elem = $new['base'];

        // SAVE NEW LIB
        if (!isset($old['id']))
        {
            // SET SORT ORDER
            $elem['sort'] = $this->new_order('medialib', $elem);

            // CREATE NEW FOLDER
            mdir_create($this->path . $elem['name']);

            // INSERT TO DB
            $elem_id = $this->insert($elem);

            // SAVE CONTENT
            $this->content_lib->save_content($elem_id, $new['desc'], $this->_desc);
        }

        // UPDATE PARENT
        else
        {
            // RENAME FOLDER (if changed)
            if ($elem['name'] !== $old['name'])
            {
                mdir_rename($this->path . $old['name'], $this->path . $elem['name']);
            }

            // UPDATE DB
            $this->update($old['id'], $elem);

            // UPDATE DESCRIPTION/TRANSLATION
            $this->content_lib->update_content($old['id'], $new['desc'], $this->_desc);
        }

        // SAVE MULTIPLE WIDGET ITEMS
        // if (isset($multi_items) && !empty($multi_items))
        // {
        //     $multi_items['pid'] = $old['id'] ?? $elem_id;

        //     $this->images_multisave($multi_items);
        // }
    }

// ------------------------------------------------------------------------ SAVE ITEM
    public function save_item($old, $new)
    {
        // GET MEDIALIB DATA
        $lib = $this->get_medialib($new['pid'], true);

        // SET PATH
        $path = $this->path . $lib['name'] . '/';

        // UPLOAD/DELETE FILE
        $new = $this->media_lib->upload_media($old, $new, $path, $filename = null, $overwrite = false);

        // CHECK IF MEDIATYPE CHANGED
        if (isset($new['media']) && $new['media'] !== $old['media'] || $new['src'] !== $old['src'])
        {
            $this->media_lib->del_media($old, $path, $new);

            // REMOVE THUMB & MIME IF NEW MEDIA IS NOT A FILE
            if ($new['src'] !== 'file')
            {
                $new['thumb'] = $new['mime'] = '';
            }

            // REMOVE OLD MEDIA NAME IF WAS ICON
            if ($new['src'] === 'file' && empty($new['mime']))
            {
                $new['media'] = $new['thumb'] = '';
            }

            // REMOVE THUMB NAME IF ICON
            if (!empty($old['mime']))
            {
                $mime = explode('/', $old['mime']);

                if ($mime[0] !== 'image')
                {
                    $new['thumb'] = '';
                }
            }
        }

        // PREPARE CONTENT & OPTIONS
        $new = $this->content_lib->prepare_content($new);

        // SPLIT CONTENT
        $elem = $new['base'];

        // SAVE NEW ITEM
        if (!isset($old['id']))
        {
            // SET SORT ORDER
            $elem['sort'] = $this->new_order('item', $elem);

            // SET CREATED DATE
            $elem['created'] = date('Y-m-d H:i:s');

            // SAVE BASE
            $elem_id = $this->insert_sec($elem);

            // SAVE CONTENT
            $this->content_lib->save_content($elem_id, $new['desc'], $this->_desc2);
        }

        // UPDATE ITEM
        if (isset($old['id']))
        {
            // SET UPDATE DATE
            $elem['updated'] = date('Y-m-d H:i:s');

            // UPDATE ITEM BASE
            $this->update_sec($old['id'], $elem);

            // UPDATE ITEM CONTENT
            $this->content_lib->update_content($old['id'], $new['desc'], $this->_desc2);
        }
    }

// ------------------------------------------------------------------------ DELETE PARENT
    public function del_medialib($lib)
    {
        // GET ITEMS
        $items = $this->get_items($lib['id']);

        // DELETE ITEMS (if not empty)
        if (!empty($items))
        {
            foreach ($items as $item)
            {
                $this->del_item($item, $lib);
            }
        }

        // DELETE WIDGET
        if ($this->db->where('id', $lib['id'])->delete($this->_table))
        {
            // DELETE FOLDER
            mdir_delete($this->path . $lib['name']);

            // DELETE CONTENT
            $this->db->where('id', $lib['id'])->delete($this->_desc);

            // REORDER
            $this->reorder('medialib', $lib);
        }
    }

// ------------------------------------------------------------------------ DELETE ITEM
    public function del_item($item, $lib = null)
    {
        // GET PARENT DATA
        $lib = $lib ?? $this->get_medialib($item['pid']);

        // DELETE ITEM
        if ($this->delete_sec($item['id']))
        {
            // DELETE CONTENT
            $this->db->where('id', $item['id'])->delete($this->_desc2);

            // REORDER
            $this->reorder('item', $item);

            // DELETE IMAGE(s)
            if (!empty($item['media']) && $item['src'] === 'file')
            {
                $path = $this->path . $lib['name'] . '/';
                $this->media_lib->del_media($item, $path);
            }
        }
    }

// --------------------------------------------------------------------- MULTIUPLOAD PREPARE
    public function multiupload_prepare($lib)
    {
        // CHECK IF IMAGES WHERE UPLOADED
        if (isset($_FILES['userfile']) && is_uploaded_file($_FILES['userfile']['tmp_name'][0]))
        {
            $default = $this->load->config('default', true);

            return [
                'path'    => $this->path . $lib['name'],
                'thumb'   => $lib['options']['show_thumb'],
                'img_w'   => $lib['options']['img_w'],
                'img_h'   => $lib['options']['img_h'],
                'thumb_w' => ($lib['options']['show_thumb'])
                    ? $lib['options']['thumb_w']
                    : $default['thumb_w'],
                'thumb_h' => ($lib['options']['show_thumb'])
                    ? $lib['options']['thumb_h']
                    : $default['thumb_h']
            ];
        }
        return null;
    }

// -------------------------------------------------------------------- UPLOAD ALL WIDGET IMAGES
    public function images_multisave($data)
    {
        // SAVE UPLOADED IMAGES
        $images = $this->up_lib->multiupload_img($data['path']);

        // PREPARE ITEMS CONTENT
        if (!empty($images))
        {
            // COUNT IMAGES
            $count = count($images);

            // GET LAST ELEMENT ORDER
            $sort = $this->new_order('item', $data);

            for ($i = 0; $i < $count; $i++)
            {
                // SET PARENT WIDGET
                $items[$i]['pid'] = $data['pid'];

                // SET PAGE TO SHOW ON (0 for uniq medialib)
                // $items[$i]['show_on'] = $data['show_on'];

                // SET PUB
                $items[$i]['pub'] = '1';

                // SET SORT
                $items[$i]['sort'] = $sort + $i;

                // SET SRC TYPE
                $items[$i]['src'] = 'file';

                // SET MIME TYPE
                $items[$i]['mime'] = $images[$i]['file_type'];

                // SET CREATE TIME
                $items[$i]['created'] = date('Y-m-d H:i:s');

                // SET IMAGE
                $items[$i]['media'] = $images[$i]['file_name'];

                // SET THUMB
                $items[$i]['thumb'] = $images[$i]['raw_name'] . '-thumb' . $images[$i]['file_ext'];

                // IMAGE & THUMB MAKEUP
                $this->img_lib->makeup($images[$i], $data, 'media');
            }

            // INSERT ITEMS IN DB
            empty($items) or $this->insert_batch_sec($items);
        }
    }

// --------------------------------------------------------------------------------------- SORT
    public function sort_medialib($order)
    {
        $this->batch_up($order);
    }

    public function sort_item($order)
    {
        $this->batch_up_sec($order);
    }

// ---------------------------------------------------------------------------------- PUBLICATE
    public function pub_medialib($id)
    {
        $this->pub($id);
    }

    public function pub_item($id)
    {
        $this->pub_sec($id);
    }

// ----------------------------------------------------------------- SET ORDER FOR NEW ELEMENT
    public function new_order($type, $elem)
    {
        $sort = ($type === 'medialib')
            ? $this->last('sort')
            : $this->last_sec('sort', ['pid' => $elem['pid']]);

        return intval($sort) + 1;
    }

// ------------------------------------------ REORDER SORTED LIST (after upper element delete)
    public function reorder($type, $elem)
    {
        if ($type === 'medialib')
        {
            $elems   = $this->get_medialib($elem['id']);
            $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);
            empty($reorder) or $this->batch_up($reorder);
        }

        if ($type === 'item')
        {
            $elems   = $this->get_items($elem['pid']);
            $reorder = $this->dash_lib->reorder_del($elem['sort'], $elems);
            empty($reorder) or $this->batch_up_sec($reorder);
        }
    }
}
