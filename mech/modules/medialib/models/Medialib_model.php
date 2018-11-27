<?php defined('BASEPATH') or exit('No direct script access allowed');

class Medialib_model extends MY_Model
{
    protected $_table  = 'medialib';
    protected $_table2 = 'medialib_items';
    protected $_order2 = 'sort ASC';

    private $lang_id;

    private $path = 'assets/media/libs/';

    public function __construct()
    {
        parent::__construct();
        $this->lang_id = $this->session->app_lang['id'];
    }

// ------------------------------------------------------------------------ GET LIB
    public function get_medialib($id)
    {
        $medialib = $this->db
                         ->select('medialib.id, medialib.name, medialib.tpl, medialib.options')
                         ->select('medialib_desc.title, medialib_desc.content')
                         ->from('medialib', 1)
                         ->where('medialib.id', $id)
                         ->where('medialib.pub', 1)
                         ->join('medialib_desc', 'medialib_desc.id=medialib.id AND medialib_desc.lang_id=' . $this->lang_id, 'left')
                         ->get()->row_array();

        if (!empty($medialib))
        {
            $medialib['options'] = json_decode($medialib['options'], true);
        }

        return $medialib;
    }

// ------------------------------------------------------------------------ GET LIB ITEMS
    public function get_items($pid, $sort, $dir)
    {
        $this->db
             ->select('medialib_items.media, medialib_items.thumb, medialib_items.href, medialib_items.link, medialib_items.url_id, medialib_items.options, medialib_items.src, medialib_items.mime')
             ->select('medialib_items_desc.title, medialib_items_desc.content')
             ->select('pages.url, pages.home')
             ->from('medialib_items')
             ->where('medialib_items.pid', $pid)
             ->where('medialib_items.pub', 1)
             ->join('medialib_items_desc', 'medialib_items_desc.id=medialib_items.id AND medialib_items_desc.lang_id=' . $this->lang_id, 'left')
             ->join('pages', 'pages.id=medialib_items.url_id', 'left')
             ->order_by('medialib_items.' . $sort . ' ' . $dir);

        $items = $this->db->get()->result_array();

        return $items;
    }

// --------------------------------------------------------------- GET LIB ITEMS BY ID
    public function get_items_by_id($lib_id, $list)
    {
        $items = [];

        foreach ($list as $id)
        {
            $this->db
                 ->select('medialib_items.media, medialib_items.thumb, medialib_items.href, medialib_items.link, medialib_items.url_id, medialib_items.options, medialib_items.src, medialib_items.mime')
                 ->select('medialib_items_desc.title, medialib_items_desc.content')
                 ->select('pages.url, pages.home')
                 ->from('medialib_items')
                 ->where('medialib_items.pid', $lib_id)
                 ->where('medialib_items.id', $id)
                 ->where('medialib_items.pub', 1)
                 ->join('medialib_items_desc', 'medialib_items_desc.id=medialib_items.id AND medialib_items_desc.lang_id=' . $this->lang_id, 'left')
                 ->join('pages', 'pages.id=medialib_items.url_id', 'left');
            $item = $this->db->get()->row_array();

            // CHECK IF ITEM EXISTS & NOT EMPTY
            if (!empty($item))
            {
                $items[] = $item;
            }

            // TODO - sort items by manual order
        }

        return $items;
    }

// ------------------------------------------------------------------------ RENDER LIB
    public function render_medialib($lib_id, $items)
    {
        // GET MEDIALIB
        $lib = $this->get_medialib($lib_id);

        // GET ITEMS
        if (!empty($lib))
        {
            // ALL/ONE ITEM(s)
            if (!empty($items))
            {
            		// GET SORT OPTIONS
            		$order = $lib['options']['items_sort'];
            		$dir = $lib['options']['items_sort_dir'];

                $list = explode(',', $items);

                $lib['items'] = ($list[0] == -1)
                    ? $this->get_items($lib_id, $order, $dir)
                    : $this->get_items_by_id($lib_id, $list);
            }

            // NO ITEMS
            else
            {
                $lib['items'] = null;
            }

            return ($lib['items'])
                ? $this->render_items($lib)
                : $lib;
        }

        return null;
    }

// ------------------------------------------------------------------------ RENDER ITEMS
    public function render_items($lib)
    {
        // IF ITEMS
        $count = count($lib['items']);

        // GET PATH
        $lib['options']['path'] = $this->path . $lib['name'] . '/';

        // RENDER ITEMS
        for ($i = 0; $i < $count; $i++)
        {
            // RENDER FILE
            if ($lib['items'][$i]['src'] === 'file')
            {
                $lib['items'][$i] = $this->render_file($lib['options'], $lib['items'][$i]);
            }

            // RENDER ICON
            if ($lib['items'][$i]['src'] === 'icon')
            {
                $lib['items'][$i] = $this->render_icon($lib['options'], $lib['items'][$i]);
            }

            // RENDER LINKED SOURCE
            if ($lib['items'][$i]['src'] === 'url')
            {
                $lib['items'][$i]['src'] = $lib['items'][$i]['media'];
            }

            // GET ITEM LINK
            $lib['items'][$i]['link'] = $this->render_item_link($lib['items'][$i]);
        }

        return $lib;
    }

// -------------------------------------------------------------------- RENDER ICON
    public function render_icon($options, $item)
    {
        // RENDER THUMB
        $item['width']  = $options['thumb_w'] ?? 'auto';
        $item['height'] = $options['thumb_h'] ?? 'auto';
        $item['thumb']  = $this->load->view('media/icon-thumb.tpl', $item, true);

        // RENDER FULL IMAGE
        $item['width']  = $options['img_w'] ?? 'auto';
        $item['height'] = $options['img_h'] ?? 'auto';
        $item['media']  = $this->load->view('media/icon.tpl', $item, true);

        return $item;
    }

// -------------------------------------------------------------------- RENDER FILE
    public function render_file($options, $item)
    {
        // GET MIME
        $mime = explode('/', $item['mime']);

        // IMAGE
        if ($mime[0] === 'image')
        {
            // RENDER THUMB
            $item['width']  = $options['thumb_w'] ?? 'auto';
            $item['height'] = $options['thumb_h'] ?? 'auto';
            $item['src']    = $options['path'] . $item['thumb'];
            $item['thumb']  = $this->load->view('media/image-thumb.tpl', $item, true);

            // RENDER IMAGE
            $item['width']  = $options['img_w'] ?? 'auto';
            $item['height'] = $options['img_h'] ?? 'auto';
            $item['src']    = $options['path'] . $item['media'];
            $item['media']  = $this->load->view('media/image.tpl', $item, true);
        }

        // VIDEO
        if ($mime[0] === 'video')
        {
            $item['src']   = $options['path'] . $item['media'];
            $item['thumb'] = $this->load->view('media/video-thumb.tpl', $item, true);
            $item['media'] = $this->load->view('media/video.tpl', $item, true);
        }

        // AUDIO
        if ($mime[0] === 'audio')
        {
            $item['src']   = $options['path'] . $item['media'];
            $item['thumb'] = $this->load->view('media/audio-thumb.tpl', $item, true);
            $item['media'] = $this->load->view('media/audio.tpl', $item, true);
        }

        // APPLICATION/PDF
        if ($mime[1] === 'pdf')
        {
            $item['src']   = $options['path'] . $item['media'];
            $item['thumb'] = $this->load->view('media/iframe.tpl', $item, true);
            $item['media'] = $this->load->view('media/iframe.tpl', $item, true);
        }

        return $item;
    }

// --------------------------------------------------------------------- ITEM LINK RENDER
    public function render_item_link($item)
    {
        if ($item['href'])
        {
            // IF SITE PAGE LINK/ HOMEPAGE
            if ($item['url_id'])
            {
                // PREPARE LINKS
                $links = $this->frontend_lib->links_prepare();

                return ($item['home'])
                    ? $links['home']
                    : base_url($links['prefix'] . $item['url']);
            }

            // IF OTHER LINK/ANCHOR
            else
            {
                return $item['link'];
            }
        }

        return null;
    }

}
