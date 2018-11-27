<?php defined('BASEPATH') or exit('No direct script access allowed');

class Media_lib
{
    public function __construct()
    {
        $this->CI = &get_instance();
    }

// ------------------------------------------------------ PREPARE IMAGE OPTIONS FOR ITEM
    public function get_media_options($default, $options = null)
    {
        return [
            'show_thumb' => true,
            'img_w'      => $options['img_w'] ?? $default['img_w'],
            'img_h'      => $options['img_h'] ?? $default['img_h'],
            'thumb_w'    => $options['thumb_w'] ?? $default['thumb_w'],
            'thumb_h'    => $options['thumb_h'] ?? $default['thumb_h']
        ];
    }

// --------------------------------------------------------------------- CHECK SAVED FILE
    public function check_file($name = null, $path = null)
    {
        if (isset($name) && isset($path))
        {
            // GET FILE PATH
            $real_f = APPPATH . '../../' . $path . $name;

            // CHECK IF FILE EXISTS
            if (is_file($real_f))
            {
                // CREATE FILE INFO ARRAY
                $file = [
                    'file_name' => $name,
                    'file_size' => round((filesize($real_f) / 1048576), 3),
                    'file_path' => $real_f,
                    'file_info' => pathinfo($real_f),
                    'path'      => $path,
                    'src'       => base_url($path . $name),
                    'type'      => mime_content_type($real_f)
                ];

                return $file;
            }

            return null;
        }

        return null;
    }

// --------------------------------------------------------------------- CHECK BLOB
    public function check_blob()
    {
        $blob = $this->CI->input->get('blob');
        return (!empty($blob)) ? $blob : null;
    }

// ------------------------------------------------------------------------ CREATE MEDIA
    public function create_media($type)
    {
        if ($type === 'icon')
        {
            return $this->icon_edit('media');
        }
        else
        {
            return $this->CI->load->view('dash/upload/single', null, true);
        }
    }

// ------------------------------------------------------------------------ EDIT MEDIA
    public function edit_media($type = 'file', $name = null, $path = null, $options = null)
    {
        // CHECK IF SRC is from url
        if ($type === 'url')
        {
            return $this->linked_src($name);
        }

        // CHECK IF SRC is FILE or BLOB
        $file = $this->check_file($name, $path);
        $blob = $this->check_blob();

        // PREVIEW/EDIT ICON
        if (!$file && !$blob && $type === 'icon')
        {
            return $this->icon_edit('media', $name);
        }

        // CREATE MEDIA (upload file/select icon)
        if (!$file && !$blob)
        {
            return $this->create_media($type);
        }

        // PREVIEW/EDIT UPLOADED FILE (blob)
        if ($blob)
        {
            return $this->blob_edit($blob);
        }

        // PREVIEW/EDIT SAVED FILE
        if ($file)
        {
            return $this->file_edit($file, $options);
        }
    }

// ------------------------------------------------------------------- FILE PREVIEW/EDIT
    public function file_edit($file, $options)
    {
        // Get type of file
        $mime = explode('/', $file['type']);

        // IMAGE
        if ($mime[0] === 'image')
        {
            // Get image dimensions
            if ($mime[1] !== 'svg+xml')
            {
                $img_dim    = getimagesize($file['file_path']);
                $thumb_file = $file['file_info']['dirname'] . '/' . $file['file_info']['filename'] . '-thumb.' . $file['file_info']['extension'];

                $thumb_dim = getimagesize($thumb_file);
            }
            else
            {
                $img_dim   = ['100', '100'];
                $thumb_dim = ['100', '100'];
            }

            $options['img_src']  = $file['src'];
            $options['img_w']    = $options['max_img_w']    = $img_dim[0];
            $options['img_h']    = $options['max_img_h']    = $img_dim[1];
            $options['img_left'] = 0;
            $options['img_top']  = 0;

            // Get thumb data
            $thumb      = $file['file_info']['filename'] . '-thumb.' . $file['file_info']['extension'];
            $thumb_file = $file['file_info']['dirname'] . '/' . $thumb;

            $options['thumb_src']  = base_url($file['path'] . $thumb);
            $options['thumb_w']    = $options['max_thumb_w']    = $thumb_dim[0];
            $options['thumb_h']    = $options['max_thumb_h']    = $thumb_dim[1];
            $options['thumb_left'] = 0;
            $options['thumb_top']  = 0;

            $file['file_preview'] = $this->CI->load->view('dash/media/image', $options, true);
            return $this->CI->load->view('dash/upload/single', $file, true);
        }

        // VIDEO/ AUDIO
        if ($mime[0] === 'video' || $mime[0] === 'audio')
        {
            $file['file_preview'] = $this->CI->load->view('dash/media/' . $mime[0], $file, true);
            return $this->CI->load->view('dash/upload/single', $file, true);
        }

        // ANY OTHER FILE
        else
        {
            $file['file_preview'] = '<a href="' . $file['src'] . '"><i class="uk-icon-large uk-icon-file-o"></i></a>';

            return $this->CI->load->view('dash/upload/single', $file, true);
        }

    }

// -------------------------------------------------------------------- BLOB PREVIEW/EDIT
    public function blob_edit($blob)
    {
        if (empty($blob['type']))
        {
            return null;
        }

        // Get type of file
        $mime = explode('/', $blob['type']);

        // Preview media files
        if ($mime[0] === 'audio' || $mime[0] === 'video')
        {
            return $this->CI->load->view('dash/media/' . $mime[0], $blob);
        }

        // Preview pdf in frame
        if ($blob['type'] === 'application/pdf')
        {
            return $this->CI->load->view('dash/media/iframe', $blob);
        }

        // Preview & edit image
        if ($mime[0] === 'image')
        {
            // Prepare image params
            $images = ['img', 'thumb'];

            foreach ($images as $i)
            {
                // Get image result width & height from input (set original size if 'auto')
                $width  = ($blob[$i . '_w'] > 0) ? $blob[$i . '_w'] : $blob['width'];
                $height = ($blob[$i . '_h'] > 0) ? $blob[$i . '_h'] : $blob['height'];

                if (!$blob['width'] && !$blob['height'])
                {
                    $ratio = 1;
                }
                else
                {
                    // Reset width & height (if auto)
                    $blob[$i . '_w'] = $width;
                    $blob[$i . '_h'] = $height;

                    // Get ratio for proportional resize
                    $rx    = $width / $blob['width'];
                    $ry    = $height / $blob['height'];
                    $ratio = max($rx, $ry);
                }

                // Set max image size
                $blob['max_' . $i . '_w'] = round($blob['width'] * $ratio);
                $blob['max_' . $i . '_h'] = round($blob['height'] * $ratio);

                // Set left margin (if crop)
                $blob[$i . '_left'] = ($blob['max_' . $i . '_w'] > $width)
                    ? '-' . (($blob['max_' . $i . '_w'] - $width) / 2)
                    : '0';

                // Set top margin (if crop)
                $blob[$i . '_top'] = ($blob['max_' . $i . '_h'] > $height)
                    ? '-' . (($blob['max_' . $i . '_h'] - $height) / 2)
                    : '0';

                // Set overflow for container
                $blob[$i . '_overflow'] = (intval($blob['holder_w']) < $blob[$i . '_w'])
                    ? 'auto' : 'hidden';
            }

            return $this->CI->load->view('dash/media/image', $blob);
        }
    }

// ------------------------------------------------------------------ ICON PREVIEW/EDIT
    public function icon_edit($icon_cell, $icon = null)
    {
        $data = [
            'icon_cell' => $icon_cell,
            'icon'      => $icon
        ];

        return $this->CI->load->view('dash/media/icon', $data, true);
    }

// ------------------------------------------------------------------------ LINK SRC
    public function linked_src($link)
    {
        $data = [
            'link' => $link
        ];

        return $this->CI->load->view('dash/media/linked', $data, true);
    }

// ---------------------------------------------------------- UPLOAD ANY FILE IN LIBRARY
    public function upload_media($old, $new, $path, $filename = null, $overwrite = false)
    {
        // DELETE PREVIOUS MEDIA
        if (isset($new['file_del']))
        {
            unset($new['file_del']);
            $new = $this->del_media($old, $path, $new);
        }

        // UPLOAD NEW MEDIA
        if (isset($_FILES['userfile']) && is_uploaded_file($_FILES['userfile']['tmp_name']))
        {
            // GET FILE TYPE BY MIME
            $new['mime'] = $_FILES['userfile']['type'];

            // GET UPLOADED FILE
            $file = $this->CI->up_lib->upload_file($path, $filename, $overwrite);

            // SET FILE NAME
            $new['media'] = $file['file_name'];

            // CHECK IF IMAGE
            if ($file['is_image'])
            {
                // MAKEUP & THUMB CREATE
                $this->CI->img_lib->makeup($file, $new);
                $new['thumb'] = $file['raw_name'] . '-thumb' . $file['file_ext'];
            }
        }

        return $this->CI->img_lib->clean_input($new);
    }

// ------------------------------------------------------------------ DELETE MEDIA FILE(S)
    public function del_media($old, $path, $new = null)
    {
        // GET FILE
        $real_f = APPPATH . '../../' . $path . $old['media'];

        if (is_file($real_f))
        {
            $inputs = ['media', 'thumb', 'src', 'mime'];

            // GET FILE INFO
            $f = pathinfo($real_f);

            // GET MIME
            $mime = explode('/', isset($old['mime']) ? $old['mime'] : mime_content_type($real_f));

            // IF IS IMAGE
            if ($mime[0] === 'image')
            {
                // GET IMAGE (and if it has thumbnail and other generated images)
                $filename = $f['dirname'] . '/' . $f['filename'];

                $images = [
                    'media' => $real_f,
                    'orig'  => $filename . '-orig.' . $f['extension'],
                    'thumb' => $filename . '-thumb.' . $f['extension']
                ];

                // REMOVE FILES
                foreach ($images as $cell_name => $img)
                {
                    mfile_delete($img);
                }
            }

            // IF OTHER FILE
            else
            {
                mfile_delete($real_f);
            }

            // CLEAN INPUT
            foreach ($inputs as $cell)
            {
                if (isset($old[$cell]))
                {
                    $new[$cell] = '';
                }
            }
        }

        return $new;
    }

// ------------------------------------------------------------------------ WIDGET SELECT/EDIT
    public function widget($title, $name, $lib = [])
    {
        $data = [
            'label'       => $title,
            'widget_name' => $name,
            'lib_id'      => $lib[$name]['id'] ?? '0',
            'items'       => $lib[$name]['items'] ?? null,
            'widgets'     => $this->get_all_libs()
        ];

        return $this->CI->load->view('dash/edit/widget', $data, true);
    }

// ------------------------------------------------------------------------ GET WIDGETS
    public function get_all_libs($by_type = true)
    {
        $libs = $this->CI->db
                     ->select('medialib.id, medialib.name')
                     ->get('medialib')->result_array();

        $list['0'] = '---';

        if (!empty($libs))
        {
            // SORT MEDIA LIBRARIES BY TYPE
            foreach ($libs as $lib)
            {
                $list[$lib['id']] = $lib['name'];
            }
        }

        return $list;
    }

}
